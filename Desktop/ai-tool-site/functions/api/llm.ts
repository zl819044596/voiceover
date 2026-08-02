const LLM_BASE = "https://maas.wing-ray.cn/api/open-apis/v1/chat/completions";

export async function onRequestPost(context: { request: Request; env: { FASTMODELS_API_KEY: string } }): Promise<Response> {
  const body = await context.request.json() as {
    model?: string;
    systemPrompt: string;
    userMessage: string;
    temperature?: number;
    maxTokens?: number;
  };

  const res = await fetch(LLM_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${context.env.FASTMODELS_API_KEY}`,
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
    return Response.json({ error: `LLM call failed: ${res.status}` }, { status: 500 });
  }

  const data = await res.json() as { choices: { message: { content: string } }[] };
  return Response.json({
    content: data.choices?.[0]?.message?.content ?? "",
  });
}
