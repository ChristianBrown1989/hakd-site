import { supabaseAdmin } from '../../../lib/supabase-server';

export async function POST(req) {
  const body = await req.json();
  const {
    client_id, week_of,
    energy_score, commitment_answer, flag_note,
    struggle_reason, support_needed,
    client_profile,
  } = body;

  const db = supabaseAdmin();

  // Save check-in
  const { data: checkIn, error } = await db
    .from('check_ins')
    .insert({
      client_id,
      week_of,
      energy_score,
      commitment_answer,
      flag_note: flag_note || null,
      struggle_reason: struggle_reason || null,
      support_needed: support_needed || null,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Get personality document
  const { data: personalityRow } = await db
    .from('coach_personality')
    .select('personality_document')
    .eq('active', true)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  const personalityDoc = personalityRow?.personality_document || '';

  // Generate Gemini response
  const coachResponse = await generateCoachResponse({
    client: client_profile,
    checkIn: { energy_score, commitment_answer, flag_note, struggle_reason, support_needed },
    personalityDoc,
  });

  // Save response back to check-in
  if (coachResponse) {
    await db
      .from('check_ins')
      .update({ coach_response: coachResponse, response_sent_at: new Date().toISOString() })
      .eq('id', checkIn.id);
  }

  return Response.json({ success: true, coach_response: coachResponse });
}

async function generateCoachResponse({ client, checkIn, personalityDoc }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const habits = [client.habit_1, client.habit_2, client.habit_3].filter(Boolean);
  const commitmentMap = { yes: 'honored all commitments', mostly: 'mostly honored commitments', struggled: 'struggled with commitments' };

  const systemPrompt = personalityDoc
    ? `You are a coaching response system. Write exactly as the coach described below.\n\n${personalityDoc}`
    : `You are a high-performance coach named Christian Brown. You coach high-achieving professionals using the EMM (Exercise Meditation Mastery) framework. Your style is direct, specific, and encouraging without being generic. You never use phrases like "great job" or "keep it up". You respond to exactly what the client said — no fluff, no corporate speak. Messages are short: 3-5 sentences max unless they flagged something serious.`;

  const userPrompt = `Write a brief coaching response to this client's weekly check-in.

CLIENT PROFILE:
- Name: ${client.name}
- EMM Archetype: ${client.emm_archetype || 'unknown'}
- Primary gap: ${client.emm_primary_gap || 'unknown'}
- Habits they're building: ${habits.join(', ') || 'not set'}
- Behavior stopping: ${client.behavior_to_stop || 'not set'}
- Communication preference: ${client.communication_style || 'mixed'}
- Accountability style: ${client.accountability_preference || 'gentle'}
- 90-day goal: ${client.primary_goal || 'not set'}

THIS WEEK'S CHECK-IN:
- Energy score: ${checkIn.energy_score}/10
- Commitments: ${commitmentMap[checkIn.commitment_answer] || 'unknown'}
${checkIn.struggle_reason ? `- What got in the way: ${checkIn.struggle_reason}` : ''}
${checkIn.support_needed ? `- Support needed: ${checkIn.support_needed}` : ''}
${checkIn.flag_note ? `- Flagged for coach: ${checkIn.flag_note}` : ''}

Write a 2-4 sentence response as Christian. Respond to exactly what they said. If they struggled, address the struggle directly — don't paper over it. If they crushed it, acknowledge what's working specifically. If they flagged something, respond to that first.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
        }),
      }
    );
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch {
    return null;
  }
}
