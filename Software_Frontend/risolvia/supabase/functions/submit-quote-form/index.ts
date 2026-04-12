import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FormSubmission {
  nombreCompleto: string;
  email: string;
  telefono: string;
  tipoConsulta: string;
  ubicacion: string;
  nivelUrgencia: string;
  descripcionSituacion: string;
  origen: string;
  userId: string;
  sessionId: string;
  recaptchaToken: string;
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone format (basic international format)
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{8,20}$/;
  return phoneRegex.test(phone);
}

// Sanitize string inputs
function sanitizeString(input: string, maxLength: number = 500): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Remove potential HTML tags
}

// Verify reCAPTCHA token server-side
async function verifyRecaptcha(token: string): Promise<boolean> {
  const recaptchaSecret = Deno.env.get('RECAPTCHA_SECRET_KEY');
  
  if (!recaptchaSecret) {
    console.error('RECAPTCHA_SECRET_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${recaptchaSecret}&response=${token}`,
    });

    const data = await response.json();
    return data.success === true && data.score >= 0.5;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}

// Check rate limiting
async function checkRateLimit(supabase: any, ipAddress: string): Promise<{ allowed: boolean; reason?: string }> {
  const { data: rateLimitRecord } = await supabase
    .from('form_submissions_rate_limit')
    .select('*')
    .eq('ip_address', ipAddress)
    .single();

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  if (!rateLimitRecord) {
    // First submission from this IP
    await supabase
      .from('form_submissions_rate_limit')
      .insert({
        ip_address: ipAddress,
        submission_count: 1,
        first_attempt_at: now.toISOString(),
        last_attempt_at: now.toISOString(),
      });
    return { allowed: true };
  }

  // Check if blocked
  if (rateLimitRecord.is_blocked) {
    return { allowed: false, reason: 'IP address is blocked due to suspicious activity' };
  }

  // Check if last attempt was within 24 hours
  const lastAttempt = new Date(rateLimitRecord.last_attempt_at);
  
  if (lastAttempt < twentyFourHoursAgo) {
    // Reset counter after 24 hours
    await supabase
      .from('form_submissions_rate_limit')
      .update({
        submission_count: 1,
        first_attempt_at: now.toISOString(),
        last_attempt_at: now.toISOString(),
      })
      .eq('ip_address', ipAddress);
    return { allowed: true };
  }

  // Check submission count
  if (rateLimitRecord.submission_count >= 5) {
    // Block after 5 submissions in 24 hours
    await supabase
      .from('form_submissions_rate_limit')
      .update({
        is_blocked: true,
        last_attempt_at: now.toISOString(),
      })
      .eq('ip_address', ipAddress);
    return { allowed: false, reason: 'Too many submissions. Please try again later.' };
  }

  // Increment counter
  await supabase
    .from('form_submissions_rate_limit')
    .update({
      submission_count: rateLimitRecord.submission_count + 1,
      last_attempt_at: now.toISOString(),
    })
    .eq('ip_address', ipAddress);

  return { allowed: true };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get client IP address
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    console.log('📨 New form submission from IP:', ipAddress);

    // Parse request body
    const body: FormSubmission = await req.json();

    // Validate required fields
    if (!body.nombreCompleto || !body.email || !body.telefono || 
        !body.tipoConsulta || !body.ubicacion || !body.nivelUrgencia || 
        !body.descripcionSituacion) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify reCAPTCHA
    if (!body.recaptchaToken) {
      return new Response(
        JSON.stringify({ error: 'reCAPTCHA verification required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isHuman = await verifyRecaptcha(body.recaptchaToken);
    if (!isHuman) {
      console.warn('⚠️ reCAPTCHA verification failed for IP:', ipAddress);
      return new Response(
        JSON.stringify({ error: 'reCAPTCHA verification failed' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limiting
    const rateLimitCheck = await checkRateLimit(supabaseAdmin, ipAddress);
    if (!rateLimitCheck.allowed) {
      console.warn('🚫 Rate limit exceeded for IP:', ipAddress);
      return new Response(
        JSON.stringify({ error: rateLimitCheck.reason }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and sanitize inputs
    const email = body.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidPhone(body.telefono)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize all string inputs
    const sanitizedData = {
      nombre_completo: sanitizeString(body.nombreCompleto, 200),
      email: email,
      telefono: sanitizeString(body.telefono, 50),
      tipo_consulta: sanitizeString(body.tipoConsulta, 100),
      ubicacion: sanitizeString(body.ubicacion, 200),
      nivel_urgencia: sanitizeString(body.nivelUrgencia, 50),
      descripcion_situacion: sanitizeString(body.descripcionSituacion, 2000),
      origen: sanitizeString(body.origen, 200),
      user_id: sanitizeString(body.userId, 100),
      session_id: sanitizeString(body.sessionId, 100),
    };

    // Insert into database (access_token will be auto-generated by trigger)
    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from('risolvia_form_submissions')
      .insert(sanitizedData)
      .select('access_token')
      .single();

    if (insertError) {
      console.error('❌ Error inserting submission:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to process submission' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Form submission processed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        access_token: insertedData.access_token,
        message: 'Form submitted successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error processing form submission:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});