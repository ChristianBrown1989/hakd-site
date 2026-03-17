export async function POST(req) {
  const { examples } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  const filled = examples.filter(e => e.response?.trim().length > 10);
  if (!filled.length) {
    return Response.json({ error: 'No examples provided' }, { status: 400 });
  }

  const examplesText = filled.map((e, i) =>
    `Scenario: ${e.scenario}\nCoach's response: ${e.response}`
  ).join('\n\n---\n\n');

  const prompt = `You are analyzing the communication style and coaching personality of a performance coach named Christian Brown who uses the EMM (Exercise Meditation Mastery) framework.

Below are real examples of how Christian responds to his clients in different coaching situations. Analyze these examples and produce a detailed coaching personality profile that captures:

1. Tone and register (formal vs casual, warm vs clinical, etc.)
2. Sentence length and structure patterns
3. Vocabulary choices — specific words and phrases he uses or avoids
4. How he handles success (acknowledgment style)
5. How he handles struggle or failure (response pattern)
6. How he addresses excuses or avoidance
7. How he shows empathy vs directness
8. What he never says (generic phrases he avoids)
9. His coaching philosophy evident in the language
10. 5-7 example sentences that perfectly capture his voice

The profile will be injected as a system prompt so Gemini can write responses that sound exactly like Christian. Be specific and concrete — not "he is encouraging" but "he acknowledges wins by naming the specific behavior, never just saying 'great job'."

EXAMPLES:
${examplesText}

Write the personality profile now. No preamble. Start directly with the profile.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
        }),
      }
    );
    const data = await res.json();
    const personality_document = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return Response.json({ personality_document });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
