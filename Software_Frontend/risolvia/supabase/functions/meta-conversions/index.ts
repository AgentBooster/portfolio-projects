
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://risolvia.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the request is from an authenticated Supabase client
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { event_name, page_url, user_data = {} } = await req.json();
    
    const accessToken = Deno.env.get('META_CONVERSIONS_TOKEN');
    const pixelId = Deno.env.get('META_PIXEL_ID') || '2370691976659941';
    
    if (!accessToken) {
      console.error('Meta Conversions API token not found');
      return new Response(JSON.stringify({ error: 'Configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare event data for Meta Conversions API
    const eventData = {
      data: [{
        event_name: event_name || 'PageView',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: page_url || 'https://risolvia.com',
        user_data: {
          client_ip_address: req.headers.get('x-forwarded-for') || 
                            req.headers.get('x-real-ip') || 
                            '127.0.0.1',
          client_user_agent: req.headers.get('user-agent') || '',
          ...user_data
        }
      }]
    };

    console.log('Sending event to Meta Conversions API:', {
      pixel_id: pixelId,
      event_name: event_name || 'PageView',
      page_url: page_url
    });

    // Send to Meta Conversions API
    const response = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(eventData),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Meta Conversions API error:', result);
      return new Response(JSON.stringify({ error: 'Meta API error', details: result }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Meta Conversions API success:', result);

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in meta-conversions function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
