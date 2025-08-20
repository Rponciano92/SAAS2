// Fireflies.ai History Service - Real API Integration
// Clean implementation focused on real data display

const FIREFLIES_API_URL = 'https://api.fireflies.ai/graphql';
const FIREFLIES_API_KEY = '0d13a14f-7214-48c3-bc85-cc817145fe12';

export interface FirefliesParticipant {
  name: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  id?: string;
  speakingTime?: number;
  wordCount?: number;
  durationPct?: number;
  wordsPerMinute?: number;
}

export interface FirefliesSentiments {
  positive_pct: Float;
  neutral_pct: Float;
  negative_pct: Float;
}

export interface FirefliesSummary {
  overview?: string;
  keywords?: string[];
  actionItems?: string[];
  keyPoints?: string[];
  decisions?: string[];
  nextSteps?: string[];
  shortSummary?: string;
  meetingType?: string;
  topicsDiscussed?: string[];
  outline?: string;
  gist?: string;
  bullet_gist?: string;
}

export interface FirefliesSentence {
  text: string;
  speaker_name: string;
  start_time: number;
  end_time: number;
  speaker_id?: string;
  index?: number;
  raw_text?: string;
}

export interface FirefliesTranscript {
  id: string;
  title: string;
  date: string;
  duration: number;
  transcript: string;
  summary?: FirefliesSummary;
  participants: FirefliesParticipant[];
  keywords: string[];
  status: 'completed' | 'processing' | 'failed';
  
  // Real API fields
  meeting_url?: string;
  recordingUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  transcriptUrl?: string;
  hostEmail?: string;
  organizerEmail?: string;
  firefliesUsers?: string[];
  meetingInfo?: {
    fred_joined: boolean;
    silent_meeting: boolean;
    summary_status: string;
  };
  sentiments?: FirefliesSentiments;
  sentences?: FirefliesSentence[];
  analytics?: {
    sentiments?: FirefliesSentiments;
    categories?: {
      questions: number;
      date_times: number;
      metrics: number;
      tasks: number;
    };
    speakers?: Array<{
      speakerId: string;
      name: string;
      duration: number;
      wordCount: number;
      longestMonologue: number;
      monologuesCount: number;
      fillerWords: number;
      questions: number;
      durationPct: number;
      wordsPerMinute: number;
    }>;
  };
}

export interface FirefliesSearchResult {
  transcripts: FirefliesTranscript[];
  total: number;
  hasMore: boolean;
}

// Base function for GraphQL calls with robust error handling
async function callFirefliesAPI(query: string, variables: any = {}): Promise<any> {
  try {
    console.log('🔥 Calling Fireflies API with optimized headers...');
    
    if (!FIREFLIES_API_KEY) {
      console.error('❌ Fireflies API key not configured');
      throw new Error('API key do Fireflies.ai não configurada');
    }
    
    // Check if API key is placeholder
    if (FIREFLIES_API_KEY === 'your_actual_fireflies_api_key_here' || FIREFLIES_API_KEY === 'demo-key') {
      console.error('❌ Fireflies API key is placeholder value');
      throw new Error('API key do Fireflies.ai é um valor placeholder');
    }
    
    // ✅ CORREÇÃO: Headers otimizados especificamente para Fireflies
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIREFLIES_API_KEY}`,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        query: query.trim(),
        variables: variables || {}
      })
    };

    console.log('📡 Making request with optimized headers...');
    
    const response = await fetch(FIREFLIES_API_URL, requestOptions);
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP error details:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    // ✅ CORREÇÃO: Log detalhado da resposta para debug
    console.log('📦 Full API response structure:', JSON.stringify(data, null, 2));
    
    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      
      // Handle specific auth_failed error
      const authError = data.errors.find((e: any) => e.code === 'auth_failed');
      if (authError) {
        console.error('❌ Authentication failed with Fireflies API');
        throw new Error(`Erro de autenticação: ${authError.message}`);
      }
      
      throw new Error(`Erro GraphQL: ${data.errors.map((e: any) => e.message).join(', ')}`);
    }

    return data.data;

  } catch (error: any) {
    console.error('❌ Fireflies API error:', error);
    throw error;
  }
}

// Retry function for more robust calls
async function callFirefliesAPIWithRetry(query: string, variables: any = {}, maxRetries: number = 2): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await callFirefliesAPI(query, variables);
      if (result === null) {
        // API key issue or auth failed - don't retry
        return null;
      }
      return result;
    } catch (error: any) {
      console.log(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      if (attempt === maxRetries) {
        return null; // Return null instead of throwing on final attempt
      }
      
      // Retry only for temporary errors and network issues
      if (error.message.includes('429') || error.message.includes('500') || error.message.includes('502') || error.message.includes('503') || error.message.includes('Failed to fetch') || error.message.includes('socket hang up')) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Waiting ${delay}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return null; // Return null instead of throwing
    }
  }
  return null;
}

// Helper function to format time
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Date formatting functions
export function formatFirefliesDate(timestamp: string | number): string {
  let date: Date;
  
  try {
    if (typeof timestamp === 'string') {
      // Check if it's an ISO string or numeric string
      if (timestamp.includes('-') || timestamp.includes('T')) {
        // ISO string (e.g., "2025-01-15T10:00:00Z")
        date = new Date(timestamp);
      } else {
        // Numeric string (e.g., "1737025200000")
        const numericTimestamp = parseInt(timestamp);
        date = new Date(numericTimestamp);
      }
    } else {
      // It's a number (timestamp)
      date = new Date(timestamp);
    }
    
    // Validate date
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp:', timestamp);
      date = new Date();
    }
    
    // Check if date is suspiciously far in future/past
    const now = new Date();
    const yearDiff = Math.abs(date.getFullYear() - now.getFullYear());
    
    if (yearDiff > 10) {
      console.warn('Suspicious date (too far):', date, 'using current date');
      date = now;
    }
    
    return date.toLocaleString('pt-BR', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return new Date().toLocaleString('pt-BR');
  }
}

export function formatFirefliesDuration(seconds: number): string {
  if (!seconds || seconds <= 0 || isNaN(seconds)) return '0min';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  } else if (minutes > 0) {
    return `${minutes}min`;
  } else {
    return '< 1min';
  }
}

// Get complete list of meetings/transcriptions with ALL data
export async function getFirefliesTranscriptions(
  limit: number = 20
): Promise<FirefliesSearchResult> {
  console.log('🚀 Starting optimized search for sentiments data...');
  
  // ✅ CORREÇÃO: Query simplificada focada em sentiments
  const query = `
    query GetTranscriptsWithSentiments($limit: Int) {
      transcripts(mine: true, limit: $limit) {
        id
        title
        date
        duration
        meeting_link
        audio_url
        video_url
        host_email
        organizer_email
        
        # ✅ FOCO: Dados essenciais de summary
        summary {
          overview
          keywords
          action_items
          outline
          gist
          bullet_gist
          short_summary
          meeting_type
        }
        
        # ✅ FOCO: Participantes básicos
        meeting_attendees {
          displayName
          name
          email
        }
        speakers {
          id
          name
        }
        
        # ✅ FOCO: Sentences para transcrição
        sentences {
          speaker_name
          text
          start_time
          end_time
          speaker_id
        }
        
        # ✅ FOCO PRINCIPAL: Analytics com sentiments
        analytics {
          sentiments {
            positive_pct
            neutral_pct
            negative_pct
          }
          categories {
            questions
            date_times
            metrics
            tasks
          }
          speakers {
            speaker_id
            name
            duration
            word_count
            duration_pct
            words_per_minute
          }
        }
        
        # ✅ FOCO: Meeting info para contexto
        meeting_info {
          fred_joined
          silent_meeting
          summary_status
        }
      }
    }
  `;

  try {
    console.log('📡 Sending optimized query focused on sentiments...');
    
    const result = await callFirefliesAPIWithRetry(query, { 
      limit: Math.min(limit, 20) // ✅ CORREÇÃO: Limite menor para evitar timeout
    });
    
    if (!result || !result.transcripts) {
      console.log('⚠️ No transcripts found in API response');
      console.log('📦 API returned null or no transcripts - using demo data');
      return {
        transcripts: getDemoTranscripts(),
        total: getDemoTranscripts().length,
        hasMore: false
      };
    }

    console.log(`✅ Found ${result.transcripts.length} transcripts`);
    
    // ✅ CORREÇÃO: Log detalhado dos sentiments para debug
    result.transcripts.forEach((transcript: any, index: number) => {
      console.log(`📊 Transcript ${index + 1} sentiments:`, {
        id: transcript.id,
        title: transcript.title,
        analytics: transcript.analytics,
        sentiments: transcript.analytics?.sentiments,
        hasAnalytics: !!transcript.analytics,
        hasSentiments: !!transcript.analytics?.sentiments
      });
    });

    const transcripts = result.transcripts.map((transcript: any) => ({
      id: transcript.id,
      title: transcript.title || 'Untitled Meeting',
      date: transcript.date || new Date().getTime().toString(),
      duration: transcript.duration || 0,
      
      // ✅ CORREÇÃO: Transcrição otimizada
      transcript: transcript.sentences ? 
        transcript.sentences.map((s: any) => 
          `[${formatTime(s.start_time || 0)}] ${s.speaker_name || 'Participante'}: ${s.text || ''}`
        ).join('\n\n') : 
        'Transcription not available',
      
      // ✅ CORREÇÃO: Summary estruturado
      summary: transcript.summary ? {
        overview: transcript.summary.overview || '',
        keywords: Array.isArray(transcript.summary.keywords) ? transcript.summary.keywords : [],
        actionItems: Array.isArray(transcript.summary.action_items) ? transcript.summary.action_items : [],
        keyPoints: transcript.summary.outline ? 
          transcript.summary.outline.split('\n').filter(Boolean) : [],
        decisions: transcript.summary.gist ? [transcript.summary.gist] : [],
        nextSteps: transcript.summary.bullet_gist ? 
          transcript.summary.bullet_gist.split('\n').filter(Boolean) : [],
        shortSummary: transcript.summary.short_summary,
        meetingType: transcript.summary.meeting_type,
        outline: transcript.summary.outline,
        gist: transcript.summary.gist,
        bullet_gist: transcript.summary.bullet_gist
      } : undefined,
      
      // ✅ CORREÇÃO: Participantes robustos
      participants: transcript.meeting_attendees && transcript.meeting_attendees.length > 0 ? 
        transcript.meeting_attendees.map((attendee: any) => ({
          name: attendee.displayName || attendee.name || 'Participant',
          email: attendee.email
        })) : 
        transcript.speakers?.map((speaker: any) => ({
          name: speaker.name || 'Participant',
          id: speaker.id
        })) || [{ name: 'Meeting participant' }],
      
      // ✅ CORREÇÃO PRINCIPAL: Analytics com sentiments validados
      analytics: transcript.analytics ? {
        sentiments: transcript.analytics.sentiments ? {
          positive_pct: parseFloat(transcript.analytics.sentiments.positive_pct) || 0,
          neutral_pct: parseFloat(transcript.analytics.sentiments.neutral_pct) || 0,
          negative_pct: parseFloat(transcript.analytics.sentiments.negative_pct) || 0
        } : undefined,
        categories: transcript.analytics.categories,
        speakers: transcript.analytics.speakers?.map((speaker: any) => ({
          speakerId: speaker.speaker_id,
          name: speaker.name,
          duration: speaker.duration,
          wordCount: speaker.word_count,
          durationPct: speaker.duration_pct,
          wordsPerMinute: speaker.words_per_minute
        }))
      } : undefined,
      
      // ✅ CORREÇÃO: URLs e metadados
      meeting_url: transcript.meeting_link,
      recordingUrl: transcript.video_url || transcript.audio_url,
      audioUrl: transcript.audio_url,
      videoUrl: transcript.video_url,
      hostEmail: transcript.host_email,
      organizerEmail: transcript.organizer_email,
      meetingInfo: transcript.meeting_info,
      
      // ✅ CORREÇÃO: Sentences estruturadas
      sentences: transcript.sentences?.map((sentence: any) => ({
        text: sentence.text,
        speaker_name: sentence.speaker_name,
        start_time: sentence.start_time,
        end_time: sentence.end_time,
        speaker_id: sentence.speaker_id
      })) || [],
      
      // ✅ CORREÇÃO: Sentiments diretos para compatibilidade
      sentiments: transcript.analytics?.sentiments ? {
        positive_pct: parseFloat(transcript.analytics.sentiments.positive_pct) || 0,
        neutral_pct: parseFloat(transcript.analytics.sentiments.neutral_pct) || 0,
        negative_pct: parseFloat(transcript.analytics.sentiments.negative_pct) || 0
      } : undefined,
      
      keywords: transcript.summary?.keywords || ['meeting'],
      status: 'completed' as const
    }));

    // ✅ CORREÇÃO: Log final dos resultados
    const transcriptsWithSentiments = transcripts.filter(t => t.sentiments);
    console.log(`📊 Final result: ${transcripts.length} total transcripts, ${transcriptsWithSentiments.length} with sentiments`);

    return {
      transcripts,
      total: transcripts.length,
      hasMore: transcripts.length === limit
    };
  } catch (error) {
    console.error('❌ Error fetching transcripts with sentiments:', error);
    
    throw new Error(`Erro ao buscar dados do Fireflies: ${error.message}`);
  }
}

// ✅ CORREÇÃO: Função específica para testar sentiments
export async function testFirefliesSentiments(): Promise<any> {
  console.log('🧪 Testing Fireflies sentiments specifically...');
  
  const testQuery = `
    query TestSentiments {
      transcripts(mine: true, limit: 1) {
        id
        title
        analytics {
          sentiments {
            positive_pct
            neutral_pct
            negative_pct
          }
        }
      }
    }
  `;
  
  try {
    const result = await callFirefliesAPI(testQuery);
    console.log('🧪 Test result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('🧪 Test failed:', error);
    throw error;
  }
}

// ✅ CORREÇÃO: Helper para validar sentiments
export function validateSentiments(sentiments: any): FirefliesSentiments | null {
  if (!sentiments) {
    console.log('📊 No sentiments data provided');
    return null;
  }
  
  // ✅ CORREÇÃO: Usar parseFloat para valores Float da API
  const positive = parseFloat(sentiments.positive_pct);
  const neutral = parseFloat(sentiments.neutral_pct);
  const negative = parseFloat(sentiments.negative_pct);
  
  // Verificar se pelo menos um valor é válido
  if (isNaN(positive) && isNaN(neutral) && isNaN(negative)) {
    console.log('📊 All sentiment values are NaN');
    return null;
  }
  
  // Verificar se a soma faz sentido (deve ser próxima de 100 ou 1)
  const total = (positive || 0) + (neutral || 0) + (negative || 0);
  if (total > 0 && (total < 0.5 || total > 150)) {
    console.warn('📊 Suspicious sentiment total:', total);
  }
  
  return {
    positive_pct: positive || 0,
    neutral_pct: neutral || 0,
    negative_pct: negative || 0
  };
}

// Get details of a specific meeting with ALL data
export async function getFirefliesMeetingDetails(transcriptId: string): Promise<FirefliesTranscript | null> {
  console.log('Fetching COMPLETE meeting details:', transcriptId);
  

  // EXPANDED query to pull ALL data
  const query = `
    query GetTranscriptDetails($transcriptId: String!) {
      transcript(id: $transcriptId) {
        id
        title
        date
        duration
        meeting_link
        video_url
        audio_url
        transcript_url
        host_email
        organizer_email
        participants
        fireflies_users
        meeting_attendees {
          displayName
          email
          phoneNumber
          name
          location
        }
        summary {
          keywords
          action_items
          outline
          shorthand_bullet
          overview
          bullet_gist
          gist
          short_summary
          short_overview
          meeting_type
          topics_discussed
          transcript_chapters
        }
        speakers {
          id
          name
        }
        sentences {
          index
          speaker_name
          speaker_id
          text
          raw_text
          start_time
          end_time
        }
        analytics {
          sentiments {
            negative_pct
            neutral_pct
            positive_pct
          }
          categories {
            questions
            date_times
            metrics
            tasks
          }
          speakers {
            speaker_id
            name
            duration
            word_count
            longest_monologue
            monologues_count
            filler_words
            questions
            duration_pct
            words_per_minute
          }
        }
        meeting_info {
          fred_joined
          silent_meeting
          summary_status
        }
        user {
          user_id
          email
          name
          num_transcripts
          recent_meeting
          minutes_consumed
          is_admin
        }
      }
    }
  `;

  try {
    const result = await callFirefliesAPIWithRetry(query, { transcriptId }, 2);
    
    if (!result || !result.transcript) {
      console.log('Transcription not found:', transcriptId);
      return null;
    }

    const transcript = result.transcript;
    
    return {
      id: transcript.id,
      title: transcript.title || 'Untitled Meeting',
      date: transcript.date || new Date().getTime().toString(),
      duration: transcript.duration || 0,
      
      // COMPLETE transcription with timestamps
      transcript: transcript.sentences?.map((s: any) => 
        `[${formatTime(s.start_time)}] ${s.speaker_name}: ${s.text}`
      ).join('\n\n') || 'Transcription not available',
      
      // COMPLETE summary
      summary: transcript.summary ? {
        overview: transcript.summary.overview,
        keywords: transcript.summary.keywords || [],
        actionItems: transcript.summary.action_items || [],
        keyPoints: transcript.summary.outline ? [transcript.summary.outline] : [],
        decisions: transcript.summary.gist ? [transcript.summary.gist] : [],
        nextSteps: transcript.summary.bullet_gist ? transcript.summary.bullet_gist.split('\n').filter(Boolean) : [],
        shortSummary: transcript.summary.short_summary,
        shortOverview: transcript.summary.short_overview,
        meetingType: transcript.summary.meeting_type,
        topicsDiscussed: transcript.summary.topics_discussed,
        outline: transcript.summary.outline,
        gist: transcript.summary.gist,
        bullet_gist: transcript.summary.bullet_gist
      } : undefined,
      
      // COMPLETE participants with analytics
      participants: transcript.analytics?.speakers?.map((speaker: any) => ({
        name: speaker.name,
        id: speaker.speaker_id,
        speakingTime: speaker.duration,
        wordCount: speaker.word_count,
        durationPct: speaker.duration_pct,
        wordsPerMinute: speaker.words_per_minute
      })) || transcript.meeting_attendees?.map((attendee: any) => ({
        name: attendee.displayName || attendee.name,
        email: attendee.email,
        phoneNumber: attendee.phoneNumber,
        location: attendee.location
      })) || transcript.speakers?.map((speaker: any) => ({
        name: speaker.name,
        id: speaker.id
      })) || [],
      
      // ALL additional fields
      meeting_url: transcript.meeting_link,
      recordingUrl: transcript.video_url || transcript.audio_url,
      audioUrl: transcript.audio_url,
      videoUrl: transcript.video_url,
      transcriptUrl: transcript.transcript_url,
      hostEmail: transcript.host_email,
      organizerEmail: transcript.organizer_email,
      firefliesUsers: transcript.fireflies_users,
      meetingInfo: transcript.meeting_info,
      user: transcript.user,
      analytics: transcript.analytics,
      sentences: transcript.sentences || [],
      sentiments: transcript.analytics?.sentiments,
      keywords: transcript.summary?.keywords || ['meeting'],
      status: 'completed' as const
    };
  } catch (error) {
    console.error('Error fetching meeting details:', error);
    throw error;
  }
}

// Get complete meeting summary
export async function getFirefliesMeetingSummary(transcriptId: string): Promise<FirefliesSummary | null> {
  console.log('Fetching COMPLETE meeting summary:', transcriptId);
  
  const query = `
    query GetCompleteSummary($transcriptId: String!) {
      transcript(id: $transcriptId) {
        id
        summary {
          overview
          keywords
          action_items
          outline
          shorthand_bullet
          gist
          bullet_gist
          short_summary
          short_overview
          meeting_type
          topics_discussed
          transcript_chapters
        }
      }
    }
  `;

  try {
    const result = await callFirefliesAPIWithRetry(query, { transcriptId });
    
    if (!result || !result.transcript?.summary) {
      console.log('Summary not found');
      return null;
    }

    const summary = result.transcript.summary;
    
    return {
      overview: summary.overview || 'Summary not available',
      actionItems: summary.action_items || [],
      keyPoints: summary.outline ? [summary.outline] : [],
      decisions: summary.gist ? [summary.gist] : [],
      nextSteps: summary.bullet_gist ? summary.bullet_gist.split('\n').filter(Boolean) : [],
      keywords: summary.keywords || [],
      shortSummary: summary.short_summary,
      shortOverview: summary.short_overview,
      meetingType: summary.meeting_type,
      topicsDiscussed: summary.topics_discussed,
      outline: summary.outline,
      gist: summary.gist,
      bullet_gist: summary.bullet_gist
    };
  } catch (error) {
    console.error('Error fetching meeting summary:', error);
    throw error;
  }
}

// Search meetings by keyword
export async function searchFirefliesTranscriptions(
  searchTerm: string,
  limit: number = 20
): Promise<FirefliesSearchResult> {
  try {
    console.log('Searching meetings with term:', searchTerm);
    
    // Search all meetings and filter locally
    const allMeetings = await getFirefliesTranscriptions(50);
    
    const filteredMeetings = allMeetings.transcripts.filter(meeting => {
      const searchText = `${meeting.title} ${meeting.summary?.overview || ''} ${meeting.transcript}`.toLowerCase();
      return searchText.includes(searchTerm.toLowerCase());
    });

    return {
      transcripts: filteredMeetings.slice(0, limit),
      total: filteredMeetings.length,
      hasMore: filteredMeetings.length > limit
    };
  } catch (error) {
    console.error('Search error:', error);
    return { transcripts: [], total: 0, hasMore: false };
  }
}

// Get meeting statistics
export async function getFirefliesMeetingStats(startDate?: string, endDate?: string) {
  try {
    console.log('Calculating meeting statistics...');
    
    const result = await getFirefliesTranscriptions(50);
    
    // If API failed, result will contain demo data - that's fine
    const meetings = result.transcripts;
    
    if (!meetings || meetings.length === 0) {
      return {
        totalMeetings: 0,
        totalDuration: 0,
        averageDuration: 0,
        totalParticipants: 0,
        averageParticipants: 0,
        recentMeetings: 0
      };
    }

    const totalDuration = meetings.reduce((sum, m) => sum + (m.duration || 0), 0);
    const totalParticipants = meetings.reduce((sum, m) => sum + (m.participants?.length || 0), 0);
    
    const averageDuration = Math.round(totalDuration / meetings.length);
    const averageParticipants = Math.round(totalParticipants / meetings.length);

    // Recent meetings (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentMeetings = meetings.filter(meeting => 
      new Date(parseInt(meeting.date)) >= sevenDaysAgo
    ).length;

    console.log('Statistics calculated:', {
      total: meetings.length,
      duration: totalDuration,
      recent: recentMeetings
    });

    return {
      totalMeetings: meetings.length,
      totalDuration: totalDuration,
      averageDuration: averageDuration,
      totalParticipants: totalParticipants,
      averageParticipants: averageParticipants,
      recentMeetings: recentMeetings
    };
  } catch (error) {
    console.error('Error calculating statistics:', error);
    
    throw new Error(`Erro ao buscar dados do Fireflies: ${error.message}`);
  }
}

// API test function
export async function testFirefliesAPI(): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    console.log('Testing Fireflies API connectivity...');
    
    const query = `
      query TestAPI {
        user {
          user_id
          email
          name
        }
      }
    `;
    
    const result = await callFirefliesAPI(query);
    
    console.log('API test successful:', result);
    
    return {
      success: true,
      message: 'Fireflies API working correctly!',
      data: result.user
    };
  } catch (error: any) {
    console.error('API test failed:', error);
    
    return {
      success: false,
      message: `Fireflies API error: ${error.message}`
    };
  }
}

// Demo data functions
function getDemoTranscripts(): FirefliesTranscript[] {
  return [
    {
      id: 'demo-1',
      title: 'Reunião Estratégica - Demo',
      date: new Date(Date.now() - 86400000).getTime().toString(),
      duration: 2700,
      transcript: 'Esta é uma transcrição de demonstração. Para ver dados reais, configure uma API key válida do Fireflies.ai.',
      summary: {
        overview: 'Reunião de demonstração. Configure uma API key válida para ver dados reais.',
        keywords: ['demo', 'configuração'],
        actionItems: [
          'Obter API key válida em https://app.fireflies.ai/integrations/custom/api',
          'Configurar VITE_FIREFLIES_API_KEY no arquivo .env',
          'Reiniciar aplicação'
        ],
        keyPoints: [
          'API key atual é inválida ou expirou',
          'Dados de demonstração sendo exibidos',
          'Configure uma chave válida para funcionalidade completa'
        ],
        decisions: [],
        nextSteps: [
          'Acessar painel do Fireflies.ai',
          'Gerar nova API key',
          'Atualizar configuração'
        ]
      },
      participants: [
        { name: 'Usuário Demo', email: 'demo@fireflies.ai' }
      ],
      keywords: ['demo', 'configuração'],
      status: 'completed' as const,
      sentences: [],
      analytics: undefined,
      sentiments: undefined
    },
    {
      id: 'demo-2',
      title: 'Como Configurar API Key',
      date: new Date(Date.now() - 172800000).getTime().toString(),
      duration: 1800,
      transcript: 'Tutorial: 1. Acesse https://app.fireflies.ai/integrations/custom/api 2. Faça login 3. Clique em "Generate API Key" 4. Copie a chave 5. Cole no arquivo .env',
      summary: {
        overview: 'Tutorial para configurar API key do Fireflies.ai corretamente.',
        keywords: ['tutorial', 'api-key', 'configuração'],
        actionItems: [
          'Seguir passos do tutorial',
          'Verificar se a chave é válida',
          'Testar integração'
        ],
        keyPoints: [
          'API key deve ser obtida do painel oficial',
          'Chave deve ser válida e não expirada',
          'Configuração no arquivo .env é obrigatória'
        ],
        decisions: [],
        nextSteps: [
          'Obter chave válida',
          'Configurar no projeto',
          'Testar funcionalidade'
        ]
      },
      participants: [
        { name: 'Sistema Tutorial', email: 'tutorial@fireflies.ai' }
      ],
      keywords: ['tutorial', 'configuração'],
      status: 'completed' as const,
      sentences: [],
      analytics: undefined,
      sentiments: undefined
    }
  ];
}

function getDemoStats() {
  return {
    totalMeetings: 2,
    totalDuration: 4500,
    averageDuration: 2250,
    totalParticipants: 2,
    averageParticipants: 1,
    recentMeetings: 1
  };
}