// Pages Function: POST /api/checkout
// Creates a Creem checkout session and returns the checkout URL

const CREEM_API_BASE = "https://test-api.creem.io/v1";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context: {
  request: Request;
  env: { CREEM_API_KEY: string };
}): Promise<Response> {
  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (context.request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { productId, email } = await context.request.json() as {
      productId: string;
      email?: string;
    };

    if (!productId) {
      return Response.json(
        { error: "productId is required" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const body: Record<string, unknown> = {
      product_id: productId,
      success_url: "https://voiceover.getfitai.io/dashboard",
    };

    if (email) {
      body.customer = { email };
    }

    const res = await fetch(`${CREEM_API_BASE}/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": context.env.CREEM_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json(
        { error: `Creem checkout failed: ${res.status} ${err}` },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const data = await res.json() as { checkout_url: string };
    return Response.json(
      { checkoutUrl: data.checkout_url },
      { headers: CORS_HEADERS }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return Response.json(
      { error: message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}