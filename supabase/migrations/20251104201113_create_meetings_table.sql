/*
  # Create Meetings Table for CaaS Platform

  1. New Table: meetings
    - Full meeting lifecycle tracking
    - Bot integration support
    - AI transcription and analysis
    - Multi-platform support (Google Meet, Zoom, Teams)

  2. Security
    - Enable RLS
    - Policies for authenticated users

  3. Indexes
    - Performance optimization for common queries
*/

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  status text DEFAULT 'scheduled',
  platform text DEFAULT 'google_meet',
  meeting_url text,
  scheduled_at timestamptz NOT NULL,
  start_time timestamptz,
  end_time timestamptz,
  duration integer DEFAULT 0,
  
  -- Bot tracking
  bot_enabled boolean DEFAULT true,
  bot_joined_at timestamptz,
  bot_left_at timestamptz,
  recording_started_at timestamptz,
  
  -- Media URLs
  recording_url text,
  video_url text,
  audio_url text,
  
  -- AI Processing
  transcription text,
  transcription_segments jsonb DEFAULT '[]'::jsonb,
  analysis jsonb DEFAULT '{}'::jsonb,
  
  -- Relationships
  client_id uuid,
  created_by uuid,
  
  -- Metadata
  participants jsonb DEFAULT '[]'::jsonb,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_platform ON meetings(platform);
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_at ON meetings(scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_client_id ON meetings(client_id);
CREATE INDEX IF NOT EXISTS idx_meetings_created_by ON meetings(created_by);

-- Enable RLS
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own meetings
CREATE POLICY "Users can view own meetings"
  ON meetings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

-- Policy: Users can insert meetings
CREATE POLICY "Users can insert meetings"
  ON meetings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Policy: Users can update own meetings
CREATE POLICY "Users can update own meetings"
  ON meetings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Policy: Users can delete own meetings
CREATE POLICY "Users can delete own meetings"
  ON meetings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_meetings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_meetings_updated_at();

-- Comments
COMMENT ON TABLE meetings IS 'CaaS meetings with bot integration, transcription, and AI analysis';
COMMENT ON COLUMN meetings.status IS 'scheduled, in_progress, recording, processing, completed, failed';
COMMENT ON COLUMN meetings.platform IS 'google_meet, zoom, teams';
COMMENT ON COLUMN meetings.bot_enabled IS 'Whether CaaS bot joins automatically';
COMMENT ON COLUMN meetings.transcription_segments IS 'Whisper API segments with timestamps';
COMMENT ON COLUMN meetings.analysis IS 'GPT-4o-mini conversational analysis';