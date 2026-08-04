// Cloudflare Worker: API proxy for ai-tool-site
// Handles all AI API routes (TTS, LLM polish/translate, PDF analysis)
// + Google OAuth authentication
// + Creem payment integration (checkout + webhook + subscription check)
// Deploy with: npx wrangler deploy

import { SignJWT, jwtVerify } from "jose";

interface Env {
  FASTMODELS_API_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  JWT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  CREEM_API_KEY: string;
  CREEM_WEBHOOK_SECRET?: string;
  voiceover_kv: {
    get: (key: string, type: "json") => Promise<unknown>;
    put: (key: string, value: string) => Promise<void>;
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const LLM_BASE = "https://maas.wing-ray.cn/api/open-apis/v1/chat/completions";
const TTS_URL = "https://maas.wing-ray.cn/api/open-apis/projects/easyllms/voice/synthesize-audio";
const CLONE_URL = "https://maas.wing-ray.cn/api/open-apis/projects/easyllms/voice/upload";

// --- JWT helpers ---

async function signJwt(payload: Record<string, unknown>, secret: string): Promise<string> {
  const key = new TextEncoder().encode(secret);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(key);
}

async function verifyJwt(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key);
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

// --- Google OAuth ---

function googleAuthUrl(env: Env): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

interface GoogleTokenResponse {
  access_token: string;
  id_token?: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

async function exchangeCode(code: string, env: Env): Promise<GoogleTokenResponse> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  return res.json() as Promise<GoogleTokenResponse>;
}

async function getGoogleUser(accessToken: string): Promise<GoogleUserInfo> {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`UserInfo failed: ${res.status}`);
  return res.json() as Promise<GoogleUserInfo>;
}

// --- KV Subscription helpers ---

const SUB_KEY_PREFIX = "sub:";

interface Subscription {
  plan: string; // "pro_monthly" | "pro_yearly" | "lifetime" | "business"
  status: "active" | "canceled" | "expired";
  checkoutId: string;
  creemOrderId?: string;
  purchasedAt: string;
  expiresAt?: string;
}

// Product ID to plan name mapping
const PRODUCT_PLANS: Record<string, { plan: string; label: string }> = {
  prod_6gXyPkmTSZuwMgkYU2DPQd: { plan: "pro_monthly", label: "Pro Monthly" },
  prod_7NtvaKyjtGRU1SPDXDMGuw: { plan: "pro_yearly", label: "Pro Yearly" },
  prod_5VrKGtT4jWn3OJ4XPvoy1b: { plan: "lifetime", label: "Lifetime" },
  prod_72NSownOenMiIf4WdEnQat: { plan: "business", label: "Business" },
};

async function getSubscription(env: Env, email: string): Promise<Subscription | null> {
  const key = `${SUB_KEY_PREFIX}${email}`;
  const data = await env.voiceover_kv.get(key, "json");
  return data as Subscription | null;
}

async function setSubscription(env: Env, email: string, sub: Subscription): Promise<void> {
  const key = `${SUB_KEY_PREFIX}${email}`;
  await env.voiceover_kv.put(key, JSON.stringify(sub));
}

// --- Creem Checkout ---

const CREEM_API_BASE = "https://test-api.creem.io/v1";

async function creemCheckout(request: Request, env: Env): Promise<Response> {
  try {
    const { productId, email } = await request.json() as {
      productId: string;
      email?: string;
    };

    if (!productId) {
      return Response.json({ error: "productId is required" }, { status: 400, headers: corsHeaders });
    }

    // If user is logged in, check if they already have an active subscription
    if (email) {
      const existing = await getSubscription(env, email);
      if (existing && existing.status === "active") {
        return Response.json(
          {
            error: "You already have an active subscription",
            plan: PRODUCT_PLANS[productId]?.label || "",
            existingPlan: existing.plan,
          },
          { status: 409, headers: corsHeaders }
        );
      }
    }

    const body: Record<string, unknown> = {
      product_id: productId,
      success_url: "https://voiceover.getfitai.io/dashboard",
    };

    // If user is logged in, pass their email to Creem
    if (email) {
      body.customer = { email };
    }

    const res = await fetch(`${CREEM_API_BASE}/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.CREEM_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: `Creem checkout failed: ${res.status} ${err}` }, { status: 500, headers: corsHeaders });
    }

    const data = await res.json() as { checkout_url: string; id: string };
    return Response.json({ checkoutUrl: data.checkout_url, checkoutId: data.id }, { headers: corsHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return Response.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

// --- Creem Webhook ---

async function creemWebhook(request: Request, env: Env): Promise<Response> {
  try {
    // Verify webhook signature if secret is configured
    const signature = request.headers.get("x-creem-signature");
    if (env.CREEM_WEBHOOK_SECRET && !signature) {
      return Response.json({ error: "Missing signature" }, { status: 401, headers: corsHeaders });
    }

    const body = await request.json() as {
      event: string;
      data: {
        id: string;
        status: string;
        customer?: { email: string };
        product?: { id: string; name: string };
        checkout?: { id: string };
      };
    };

    console.log("Creem webhook received:", JSON.stringify({ event: body.event, dataId: body.data?.id }));

    // Only handle checkout.completed events
    if (body.event !== "checkout.completed" && body.event !== "checkout.paid") {
      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    const { data } = body;
    if (!data.customer?.email || !data.product?.id) {
      return Response.json({ error: "Missing customer email or product id" }, { status: 400, headers: corsHeaders });
    }

    const email = data.customer.email;
    const productId = data.product.id;
    const planInfo = PRODUCT_PLANS[productId];

    if (!planInfo) {
      console.log("Unknown product:", productId);
      return Response.json({ error: "Unknown product" }, { status: 400, headers: corsHeaders });
    }

    const subscription: Subscription = {
      plan: planInfo.plan,
      status: "active",
      checkoutId: data.checkout?.id || "",
      creemOrderId: data.id,
      purchasedAt: new Date().toISOString(),
    };

    // For monthly/yearly, set expiry
    if (planInfo.plan === "pro_monthly") {
      subscription.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (planInfo.plan === "pro_yearly") {
      subscription.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    }
    // lifetime and business don't expire

    await setSubscription(env, email, subscription);
    console.log("Subscription saved for:", email, planInfo.plan);

    return Response.json({ ok: true }, { headers: corsHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook failed";
    console.error("Webhook error:", message);
    return Response.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

// --- TTS / Clone / LLM (unchanged logic) ---

async function ttsGenerate(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as {
    text: string[];
    voice: string;
    speed?: number;
    volume?: number;
    pitch?: number;
    format?: string;
    enableSsml?: boolean;
  };

  if (!body.text || !Array.isArray(body.text) || body.text.length === 0) {
    return Response.json({ error: "Text array is required" }, { status: 400, headers: corsHeaders });
  }
  if (!body.voice) {
    return Response.json({ error: "Voice is required" }, { status: 400, headers: corsHeaders });
  }

  // Process text: if SSML enabled, wrap in <speak> tags
  let processedText = body.text;
  if (body.enableSsml) {
    processedText = body.text.map((t) => `<speak>${t}</speak>`);
  }

  const res = await fetch(TTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FASTMODELS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: processedText,
      synthesis_param: {
        model: "cosyvoice-v2",
        voice: body.voice,
        format: body.format || "MP3_24000HZ_MONO_128KBPS",
        volume: body.volume ?? 80,
        speechRate: body.speed ?? 1.0,
        pitchRate: body.pitch ?? 1.0,
      },
    }),
  });

  if (!res.ok) {
    return Response.json({ error: `TTS failed: ${res.status}` }, { status: 500, headers: corsHeaders });
  }

  const audioBuffer = await res.arrayBuffer();
  return new Response(audioBuffer, {
    headers: { ...corsHeaders, "Content-Type": "audio/mpeg" },
  });
}

async function ttsClone(request: Request, env: Env): Promise<Response> {
  const formData = await request.formData();
  const audioFile = formData.get("audio_file") as File | null;
  const promptText = formData.get("prompt_text") as string;
  const voiceName = formData.get("voice_name") as string;

  if (!audioFile || !promptText || !voiceName) {
    return Response.json(
      { error: "audio_file, prompt_text, and voice_name are required" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (audioFile.size > 10 * 1024 * 1024) {
    return Response.json(
      { error: "Audio file must be under 10MB" },
      { status: 400, headers: corsHeaders }
    );
  }

  const upstream = new FormData();
  upstream.append("audio_file", audioFile);
  upstream.append(
    "tts_speaker_voice_generate_req",
    JSON.stringify({
      model: "cosyvoice-v2",
      name: voiceName,
      prompt_text: promptText,
    })
  );

  const res = await fetch(CLONE_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.FASTMODELS_API_KEY}` },
    body: upstream,
  });

  if (!res.ok) {
    return Response.json({ error: `Voice clone failed: ${res.status}` }, { status: 500, headers: corsHeaders });
  }

  return Response.json({ voiceId: voiceName }, { headers: corsHeaders });
}

async function llmCall(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as {
    model?: string;
    systemPrompt: string;
    userMessage: string;
    temperature?: number;
    maxTokens?: number;
  };

  const res = await fetch(LLM_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FASTMODELS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: body.model || "DeepSeek-V4-Flash",
      messages: [
        { role: "system", content: body.systemPrompt },
        { role: "user", content: body.userMessage },
      ],
      temperature: body.temperature ?? 0.7,
      max_tokens: body.maxTokens ?? 4096,
    }),
  });

  if (!res.ok) {
    return Response.json({ error: `LLM call failed: ${res.status}` }, { status: 500, headers: corsHeaders });
  }

  const data = await res.json() as { choices: { message: { content: string } }[] };
  return Response.json(
    { content: data.choices?.[0]?.message?.content ?? "" },
    { headers: corsHeaders }
  );
}

// --- Main fetch ---

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (url.pathname === "/api/health") {
      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    // ── Auth routes ──

    // GET /api/auth/google — redirect to Google OAuth
    if (url.pathname === "/api/auth/google" && request.method === "GET") {
      return Response.redirect(googleAuthUrl(env), 302);
    }

    // GET /api/auth/callback — handle Google OAuth callback
    if (url.pathname === "/api/auth/callback" && request.method === "GET") {
      const code = url.searchParams.get("code");
      if (!code) {
        return Response.json({ error: "Missing code" }, { status: 400, headers: corsHeaders });
      }

      try {
        const tokens = await exchangeCode(code, env);
        const googleUser = await getGoogleUser(tokens.access_token);

        // Check if user has an active subscription
        const subscription = await getSubscription(env, googleUser.email);

        const jwtPayload = {
          sub: googleUser.sub,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          plan: subscription?.plan || "free",
          subscriptionStatus: subscription?.status || null,
        };

        const jwt = await signJwt(jwtPayload, env.JWT_SECRET);

        // Return HTML page that stores JWT in localStorage, then redirects to dashboard
        // This keeps JWT completely out of the URL (no query param, no hash fragment)
        // Solves WAF blocking and mobile browser URL issues
        const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Signing in…</title>
<style>body{font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f5f5f5}
.spinner{width:32px;height:32px;border:3px solid #e0e0e0;border-top-color:#7c3aed;border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}</style></head>
<body><div class="spinner"></div>
<script>
try{localStorage.setItem("authToken",${JSON.stringify(jwt)});
window.location.replace("/dashboard")}catch(e){window.location.replace("/dashboard")}
</script></body></html>`;
        return new Response(html, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "OAuth failed";
        return Response.json({ error: message }, { status: 500, headers: corsHeaders });
      }
    }

    // GET /api/auth/me — validate Bearer token, return user info + subscription
    if (url.pathname === "/api/auth/me" && request.method === "GET") {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({ error: "Missing token" }, { status: 401, headers: corsHeaders });
      }

      const token = authHeader.slice(7);
      const payload = await verifyJwt(token, env.JWT_SECRET);
      if (!payload) {
        return Response.json({ error: "Invalid or expired token" }, { status: 401, headers: corsHeaders });
      }

      // Get fresh subscription status from KV
      const email = payload.email as string;
      const subscription = await getSubscription(env, email);

      return Response.json(
        {
          user: {
            sub: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
          },
          subscription: subscription || null,
        },
        { headers: corsHeaders }
      );
    }

    // ── TTS / LLM routes ──

    // TTS generate
    if (url.pathname === "/api/tts/generate" && request.method === "POST") {
      return ttsGenerate(request, env);
    }

    // Voice clone
    if (url.pathname === "/api/tts/clone" && request.method === "POST") {
      return ttsClone(request, env);
    }

    // LLM calls (polish, translate, pdf analyze)
    if (url.pathname === "/api/llm" && request.method === "POST") {
      return llmCall(request, env);
    }

    // ── Creem Checkout ──

    if (url.pathname === "/api/checkout" && request.method === "POST") {
      return creemCheckout(request, env);
    }

    // ── Creem Webhook ──

    if (url.pathname === "/api/webhook" && request.method === "POST") {
      return creemWebhook(request, env);
    }

    // ── Subscription Status API ──

    if (url.pathname === "/api/subscription" && request.method === "GET") {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({ error: "Missing token" }, { status: 401, headers: corsHeaders });
      }

      const token = authHeader.slice(7);
      const payload = await verifyJwt(token, env.JWT_SECRET);
      if (!payload) {
        return Response.json({ error: "Invalid or expired token" }, { status: 401, headers: corsHeaders });
      }

      const email = payload.email as string;
      const subscription = await getSubscription(env, email);
      return Response.json({ subscription: subscription || null }, { headers: corsHeaders });
    }

    return Response.json({ error: "Not found" }, { status: 404, headers: corsHeaders });
  },
};