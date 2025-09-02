// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop() // Pega apenas a última parte do path

    console.log('🔗 Edge Function chamada:', {
      method: req.method,
      path: path,
      fullUrl: req.url
    })

    // Endpoint para testar a API do Fireflies
    if (path === 'test' && req.method === 'GET') {
      return await handleTest()
    }

    // Endpoint para instruir bot a entrar na reunião
    if (path === 'join-meeting' && req.method === 'POST') {
      return await handleJoinMeeting(req)
    }

    // Webhook do Fireflies (endpoint raiz)
    if (req.method === 'POST' && (!path || path === 'fireflies-webhook')) {
      return await handleWebhook(req)
    }

    // Endpoint não encontrado
    return new Response(JSON.stringify({
      error: 'Endpoint não encontrado',
      availableEndpoints: [
        'GET /test - Testar API do Fireflies',
        'POST /join-meeting - Instruir bot a entrar na reunião',
        'POST / - Receber webhook do Fireflies'
      ]
    }), {
      status: 404,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('❌ Erro na Edge Function:', error)
    return new Response(JSON.stringify({
      error: 'Erro interno do servidor',
      message: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
})

// Função para testar a API do Fireflies
async function handleTest() {
  try {
    const firefliesApiKey = Deno.env.get('FIREFLIES_API_KEY')
    
    if (!firefliesApiKey) {
      return new Response(JSON.stringify({
        success: false,
        message: 'FIREFLIES_API_KEY não configurada. Use: aethersaas_IrJGOg7VCrE0CBfIIsF2dBwTWzA1khxBDNMW47Ql',
        instructions: [
          '1. Vá para o painel do Supabase',
          '2. Settings > Edge Functions',
          '3. Adicione FIREFLIES_API_KEY=aethersaas_IrJGOg7VCrE0CBfIIsF2dBwTWzA1khxBDNMW47Ql',
          '4. Redeploy a função'
        ]
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }

    // Teste simples da API do Fireflies
    const query = `
      query {
        user {
          user_id
          email
          name
        }
      }
    `

    const response = await fetch('https://api.fireflies.ai/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firefliesApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(JSON.stringify({
        success: false,
        message: `Erro na API do Fireflies: ${response.status}`,
        details: errorText
      }), {
        status: response.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }

    const result = await response.json()

    if (result.errors) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Erro de autenticação do Fireflies',
        details: result.errors[0].message,
        instructions: [
          'Verifique se sua API key é válida',
          'Obtenha uma nova em https://app.fireflies.ai/integrations/custom/api',
          'Configure FIREFLIES_API_KEY no Supabase'
        ]
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Conexão com Fireflies.ai funcionando!',
      user: result.data.user,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('❌ Erro no teste:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Erro interno no teste',
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
}

// Função para instruir bot a entrar na reunião
async function handleJoinMeeting(req: Request) {
  try {
    const body = await req.json()
    const { meetingUrl, title, language = 'pt-BR' } = body

    if (!meetingUrl) {
      return new Response(JSON.stringify({
        success: false,
        error: 'URL da reunião é obrigatória'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }

    const firefliesApiKey = Deno.env.get('FIREFLIES_API_KEY')
    
    if (!firefliesApiKey) {
      return new Response(JSON.stringify({
        success: false,
        message: 'API key não configurada',
        instructions: [
          '1. Configure FIREFLIES_API_KEY no Supabase',
          '2. Redeploy a Edge Function',
          '3. Tente novamente'
        ]
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }

    // Mutation para adicionar bot à reunião
    const mutation = `
      mutation AddToLiveMeeting($meetingLink: String!) {
        addToLiveMeeting(meeting_link: $meetingLink) {
          success
        }
      }
    `

    const variables = {
      meetingLink: meetingUrl
    }

    const response = await fetch('https://api.fireflies.ai/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firefliesApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: variables
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(JSON.stringify({
        success: false,
        message: 'Erro na API do Fireflies',
        details: errorText
      }), {
        status: response.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }

    const result = await response.json()

    if (result.errors) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Erro GraphQL do Fireflies',
        details: result.errors[0].message
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Bot instruído a entrar na reunião!',
      data: result.data.addToLiveMeeting,
      instructions: [
        'O bot Fireflies.ai foi instruído a entrar na reunião',
        'Aguarde 1-3 minutos para o bot aparecer',
        'Aceite o bot quando ele solicitar entrada'
      ]
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('❌ Erro ao processar join-meeting:', error)
    return new Response(JSON.stringify({
      success: false,
      error: 'Erro ao processar solicitação',
      message: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
}

// Função para receber webhook do Fireflies
async function handleWebhook(req: Request) {
  try {
    const body = await req.json()
    console.log('📝 Webhook recebido do Fireflies:', body)

    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook processado com sucesso',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error)
    return new Response(JSON.stringify({
      success: false,
      error: 'Erro ao processar webhook',
      message: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
}