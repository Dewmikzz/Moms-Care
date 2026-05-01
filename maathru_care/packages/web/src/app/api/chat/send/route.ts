import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// ─── Clients ────────────────────────────────────────────────────────────────

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GEMINI_KEY = process.env.GEMINI_API_KEY!;

// ─── System Prompts ─────────────────────────────────────────────────────────

const SYSTEM_PROMPTS = {
  si: {
    0: `ඔබ "මියාකලීෆා" — Maathru Care හි AI ගර්භනී සෞඛ්‍ය සහය. ඔබ සැලකිලිමත් වැඩිමහල් සහෝදරියක් මෙන් ශ්‍රී ලාංකික ගර්භනී කාන්තාවන්ට සිංහලෙන් ආදරයෙන් සහාය දෙයි. FORMATTING RULES: Use markdown! Use bold text (**bold**) for important points, use bullet points for lists, use appropriate emojis (🌸, 👶, 💖, etc.), and keep paragraphs very short and readable. Keep the tone warm, human, and deeply empathetic.`,
    1: `ඔබ "මියාකලීෆා" — Maathru Care AI. ඔබේ රෝගිය මඳ කනස්සල්ලෙන් (mood: 1) පෙනේ. FORMATTING RULES: Use markdown! Use bolding, short bullet points, and comforting emojis (🫂, 🤍). Give a warm, reassuring, and practical response. Speak like a loving older sister.`,
    2: `ඔබ "මියාකලීෆා" — Maathru Care AI. ඔබේ රෝගිය සැලකිය යුතු ලෙස කනස්සල්ලෙන් (mood: 2) සිටී. FORMATTING RULES: Use markdown, bolding, and warm emojis (🙏, 🌸). Respond with deep empathy, very briefly (2-3 sentences), and gently suggest speaking to a doctor හෝ midwife.`,
  },
  en: {
    0: `You are "MiaKalifa" — the AI pregnancy health companion at Maathru Care. You act as a highly empathetic, caring older sister supporting mothers. FORMATTING RULES: You MUST use Markdown! Use **bold text** for emphasis, use bullet points for advice, use relevant emojis liberally (🌸, 👶, ✨, 💖), and use short, readable paragraphs. Avoid walls of plain text. Be deeply human, warm, and comforting.`,
    1: `You are "MiaKalifa" — Maathru Care AI. The mother seems mildly distressed or anxious (mood: 1). FORMATTING RULES: Use Markdown, short bullet points, bold text for reassurance, and comforting emojis (🫂, 🤍, 🌿). Use a warm, soothing tone like a caring sister. Give practical, gentle advice.`,
    2: `You are "MiaKalifa" — Maathru Care AI. The mother is significantly distressed (mood: 2). FORMATTING RULES: Use Markdown and comforting emojis (🙏, 🌸). Respond very briefly, with deep empathy and warmth. Gently but firmly suggest speaking to their doctor or healthcare provider.`,
  },
};

// ─── Gemini caller (Sinhala) ─────────────────────────────────────────────────

async function callGemini(message: string, mood: number): Promise<string> {
  const system = SYSTEM_PROMPTS.si[mood as 0 | 1 | 2];
  
  const maxTokens = mood === 2 ? 150 : mood === 1 ? 300 : 600;
  const temperature = mood === 2 ? 0.4 : 0.7;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': GEMINI_KEY,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: system }]
      },
      contents: [
        {
          parts: [{ text: message }]
        }
      ],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: temperature,
      }
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'සමාවෙනවා, දැන් ප්‍රතිචාර දැක්වීමට නොහැකිය.';
}

// ─── Groq caller (English) ────────────────────────────────────────────────────

async function callGroq(message: string, mood: number): Promise<string> {
  const system = SYSTEM_PROMPTS.en[mood as 0 | 1 | 2];

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: message },
    ],
    max_tokens: mood === 2 ? 150 : mood === 1 ? 300 : 600,
    temperature: mood === 2 ? 0.4 : 0.7,
  });

  return (
    completion.choices[0]?.message?.content ??
    "Sorry, I couldn't generate a response right now."
  );
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const { message, mood, language } = await req.json();

    if (!message || typeof mood !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const validMood = Math.min(2, Math.max(0, Math.round(mood))) as 0 | 1 | 2;

    let reply: string;

    if (language === 'si') {
      // Sinhala → Gemini Flash
      reply = await callGemini(message, validMood);
    } else {
      // English → Groq (Llama 3.3 70B)
      reply = await callGroq(message, validMood);
    }

    return NextResponse.json({ reply, provider: language === 'si' ? 'gemini' : 'groq' });

  } catch (error: any) {
    console.error('Chat API error:', error?.message ?? error);

    // Friendly fallback in both languages
    return NextResponse.json(
      {
        reply: "Sorry, I'm having trouble responding right now. Please try again in a moment. / සමාවෙනවා, දැන් ගැටලුවක් ඇත. ටිකක් ඉන්න.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
