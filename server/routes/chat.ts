import type { RequestHandler } from "express";

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const { messages } = req.body as {
      messages: { role: "user" | "assistant" | "system"; content: string }[];
    };
    const apiKey =
      process.env.OPENAI_API_KEY ||
      process.env.ANTHROPIC_API_KEY ||
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        provider: "local",
        message: localReply(messages?.[messages.length - 1]?.content || ""),
      });
    }

    if (process.env.OPENAI_API_KEY) {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...(messages || []),
          ],
          temperature: 0.4,
        }),
      });
      if (!r.ok) {
        const text = await r.text();
        return res.status(502).json({ error: "upstream_error", detail: text });
      }
      const data = await r.json();
      const content =
        data.choices?.[0]?.message?.content ?? "Sorry, I couldn't respond.";
      return res.json({ provider: "openai", message: content });
    }

    return res.status(501).json({ error: "no_supported_provider" });
  } catch (e: any) {
    return res
      .status(500)
      .json({ error: "chat_failed", detail: String(e?.message || e) });
  }
};

const systemPrompt = `You are a helpful web assistant for a no-code website builder. Provide concise, practical answers and small code snippets when useful.`;

function localReply(text: string): string {
  const t = text.toLowerCase();
  if (!t) return "How can I help you build today?";
  if (t.includes("hero"))
    return "Add a Heading, Paragraph, and Button. Use H1 for the heading and strong contrast.";
  if (t.includes("nav"))
    return "Use a header with a logo at left and links at right. Keep it sticky and add a subtle border-bottom.";
  if (t.includes("grid"))
    return "Use a responsive grid: grid-cols-1 md:grid-cols-2 with gap-6 for balanced layout.";
  if (t.includes("form"))
    return "Use labels tied to inputs, add required and aria-invalid states, and group actions to the right.";
  return "Got it. Add blocks from the library, edit in the inspector, then export code. Ask for details and I’ll help.";
}
