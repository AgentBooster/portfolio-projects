import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

// Inicializar cliente Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// reCAPTCHA configuration
const RECAPTCHA_SECRET_KEY = Deno.env.get('RECAPTCHA_SECRET_KEY')!;

// Lista de dominios de email desechables comunes
const disposableEmailDomains = [
  'tempmail', 'throwaway', '10minutemail', 'guerrillamail', 'mailinator',
  'trashmail', 'temp-mail', 'fakeinbox', 'yopmail', 'discard.email'
];

// Validar si es un email sospechoso
function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  return disposableEmailDomains.some(d => domain.includes(d));
}

// Validar patrones sospechosos en teléfonos
function isSuspiciousPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Detectar patrones repetitivos
  if (/^(\d)\1+$/.test(cleaned)) return true; // 111111, 222222
  if (/^(123456|111111|000000|999999)/.test(cleaned)) return true;
  return false;
}

// Validar contenido sospechoso
function hasSuspiciousContent(text: string): boolean {
  const lower = text.toLowerCase();
  // URLs sospechosas
  if (/(http|www\.|\.com|\.net|\.org)/i.test(text)) return true;
  // Contenido muy corto o genérico
  if (text.length < 5) return true;
  return false;
}

// Verificar y actualizar rate limiting
async function checkRateLimit(ip: string): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    // Buscar registro existente
    const { data: existing, error: fetchError } = await supabase
      .from('form_submissions_rate_limit')
      .select('*')
      .eq('ip_address', ip)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching rate limit:', fetchError);
      return { allowed: true }; // En caso de error, permitir (fail open)
    }

    if (!existing) {
      // Primera solicitud de esta IP
      await supabase.from('form_submissions_rate_limit').insert({
        ip_address: ip,
        submission_count: 1,
        is_blocked: false
      });
      return { allowed: true };
    }

    // Verificar si está bloqueado
    if (existing.is_blocked) {
      return { allowed: false, reason: 'IP bloqueada por múltiples intentos sospechosos' };
    }

    const lastAttempt = new Date(existing.last_attempt_at);
    const hoursSinceLastAttempt = (Date.now() - lastAttempt.getTime()) / (1000 * 60 * 60);

    // Si pasó más de 1 hora, resetear contador
    if (hoursSinceLastAttempt > 1) {
      await supabase
        .from('form_submissions_rate_limit')
        .update({ submission_count: 1, last_attempt_at: new Date().toISOString() })
        .eq('ip_address', ip);
      return { allowed: true };
    }

    // Si ya tiene 3 o más intentos en la última hora, bloquear
    if (existing.submission_count >= 3) {
      await supabase
        .from('form_submissions_rate_limit')
        .update({ is_blocked: true })
        .eq('ip_address', ip);
      return { allowed: false, reason: 'Demasiados intentos. Intente nuevamente en 1 hora.' };
    }

    // Incrementar contador
    await supabase
      .from('form_submissions_rate_limit')
      .update({ 
        submission_count: existing.submission_count + 1,
        last_attempt_at: new Date().toISOString()
      })
      .eq('ip_address', ip);

    return { allowed: true };
  } catch (e) {
    console.error('Error in rate limiting:', e);
    return { allowed: true }; // Fail open en caso de error
  }
}

Deno.serve(async (req) => {
  const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization, x-client-info, apikey",
    "Vary": "Origin",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return new Response(null, { status: 405, headers: CORS });

  const N8N_WEBHOOK_URL = "https://n8n.agentbooster.ai/webhook/risolvia-supabase-to-airtable";

  // Parseo mínimo
  let payload: any = {};
  const ct = req.headers.get("content-type") || "";
  try {
    if (ct.includes("json")) payload = await req.json();
    else if (ct.includes("form")) payload = Object.fromEntries((await req.formData()).entries());
  } catch {}

  console.log("🚀 N8N Proxy - Datos recibidos:", JSON.stringify(payload, null, 2));

  // Obtener IP del cliente
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
             req.headers.get('x-real-ip') || 
             'unknown';

  // 1. Verificar reCAPTCHA token
  const recaptchaToken = payload.recaptcha_token;
  if (!recaptchaToken) {
    console.warn('🚫 No reCAPTCHA token provided');
    return new Response(
      JSON.stringify({ error: 'Verificación de seguridad requerida' }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  try {
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    });

    const recaptchaResult = await recaptchaResponse.json();
    console.log('🔐 reCAPTCHA verification result:', recaptchaResult);

    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      console.warn(`🚫 reCAPTCHA failed: score=${recaptchaResult.score}`);
      return new Response(
        JSON.stringify({ error: 'Verificación de seguridad fallida. Por favor intenta de nuevo.' }),
        { status: 403, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    console.log(`✅ reCAPTCHA passed with score: ${recaptchaResult.score}`);
  } catch (e) {
    console.error('❌ Error verifying reCAPTCHA:', e);
    return new Response(
      JSON.stringify({ error: 'Error en la verificación de seguridad' }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  // Remover el token de reCAPTCHA antes de enviar a N8N
  delete payload.recaptcha_token;

  // 2. Verificar rate limiting
  const rateLimitCheck = await checkRateLimit(ip);
  if (!rateLimitCheck.allowed) {
    console.warn(`🚫 Rate limit exceeded for IP: ${ip}`);
    return new Response(
      JSON.stringify({ error: rateLimitCheck.reason || 'Too many requests' }),
      { status: 429, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  // 3. Validar contenido del formulario
  const email = payload.email || '';
  const telefono = payload.telefono || '';
  const descripcion = payload.descripcion_situacion || payload.descripcion || '';

  if (isDisposableEmail(email)) {
    console.warn(`🚫 Disposable email detected: ${email}`);
    return new Response(
      JSON.stringify({ error: 'Por favor use un email válido' }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  if (isSuspiciousPhone(telefono)) {
    console.warn(`🚫 Suspicious phone pattern: ${telefono}`);
    return new Response(
      JSON.stringify({ error: 'Por favor verifique el número de teléfono' }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  if (hasSuspiciousContent(descripcion)) {
    console.warn(`🚫 Suspicious content detected in description`);
    return new Response(
      JSON.stringify({ error: 'Por favor proporcione una descripción válida' }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  console.log("✅ Validaciones pasadas, enviando a N8N...");

  // 4. Enviar a N8N (N8N se encarga de guardar en Supabase)
  try {
    console.log("📤 Enviando a N8N...");
    const r = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload ?? {}),
    });
    
    const text = await r.text();
    
    console.log("📥 Respuesta de N8N:");
    console.log("  - Status:", r.status);
    console.log("  - Status Text:", r.statusText);
    console.log("  - Response Body:", text);
    
    return new Response(
      JSON.stringify({ success: true, sent: true, n8nStatus: r.status, n8nText: text }),
      { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("❌ Error enviando a N8N:", e);
    return new Response(
      JSON.stringify({ error: 'Error al enviar al webhook', details: String(e) }),
      { status: 502, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});