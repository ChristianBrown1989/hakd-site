'use client';

import { useState } from 'react';

const SCENARIO_TEMPLATES = [
  { scenario: 'Client crushed the week — energy 9/10, honored all commitments', response: '' },
  { scenario: 'Client struggled — energy 4/10, missed most commitments, work got crazy', response: '' },
  { scenario: 'Client mostly on track but flagged feeling burned out', response: '' },
  { scenario: 'Client had a physical setback — knee pain flared up', response: '' },
  { scenario: 'Client is making excuses — good week on paper but clearly coasting', response: '' },
  { scenario: 'Client hit a personal record in training', response: '' },
  { scenario: 'Client is travelling this week and worried about staying on track', response: '' },
  { scenario: 'Client hasn\'t checked in for 2 weeks', response: '' },
];

const inputStyle = {
  width: '100%', background: 'var(--s2)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px', padding: '0.7rem 0.85rem', fontSize: '0.82rem', color: 'var(--text)',
  outline: 'none', fontFamily: 'inherit', resize: 'vertical',
};

export default function PersonalityBuilder({ existing }) {
  const [examples, setExamples] = useState(
    existing?.example_messages || SCENARIO_TEMPLATES
  );
  const [personalityDoc, setPersonalityDoc] = useState(existing?.personality_document || '');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateResponse(i, val) {
    setExamples(ex => ex.map((e, idx) => idx === i ? { ...e, response: val } : e));
  }

  async function generatePersonality() {
    setGenerating(true);
    const res = await fetch('/api/coach/personality/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examples }),
    });
    const data = await res.json();
    if (data.personality_document) {
      setPersonalityDoc(data.personality_document);
    }
    setGenerating(false);
  }

  async function savePersonality() {
    setSaving(true);
    await fetch('/api/coach/personality/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examples, personality_document: personalityDoc }),
    });
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  const filledCount = examples.filter(e => e.response.trim().length > 20).length;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <a href="/coach" style={{ fontSize: '0.75rem', color: 'rgba(242,242,242,0.4)' }}>← Dashboard</a>
        <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text)', marginTop: '0.5rem' }}>Coaching Personality Database</div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(242,242,242,0.4)', marginTop: '0.25rem' }}>
          Write how you'd actually respond to each scenario. Gemini reads these to sound like you.
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>
            {filledCount} of {examples.length} scenarios written
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(242,242,242,0.4)', marginTop: '0.15rem' }}>Write at least 5 for a good baseline</div>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            onClick={generatePersonality}
            disabled={generating || filledCount < 3}
            style={{ background: filledCount >= 3 ? 'rgba(201,168,76,0.15)' : 'transparent', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#c9a84c', cursor: filledCount >= 3 ? 'pointer' : 'not-allowed', opacity: filledCount >= 3 ? 1 : 0.4 }}
          >
            {generating ? 'Analyzing...' : '⚡ Generate Profile'}
          </button>
          {personalityDoc && (
            <button
              onClick={savePersonality}
              disabled={saving}
              style={{ background: '#c9a84c', border: 'none', borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#0a0a0a', cursor: 'pointer' }}
            >
              {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save & Activate'}
            </button>
          )}
        </div>
      </div>

      {/* Example scenarios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {examples.map((ex, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(242,242,242,0.35)', marginBottom: '0.4rem' }}>
              Scenario {i + 1}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(242,242,242,0.75)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
              "{ex.scenario}"
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgba(242,242,242,0.4)', marginBottom: '0.35rem' }}>
              Your response (write exactly as you would text/message them):
            </div>
            <textarea
              style={inputStyle}
              rows={3}
              placeholder="Write your actual response here — your real voice, no filters..."
              value={ex.response}
              onChange={e => updateResponse(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Generated personality doc */}
      {personalityDoc && (
        <div style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1rem' }}>Generated Personality Profile</div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(242,242,242,0.4)', marginBottom: '0.75rem' }}>
            This is what Gemini reads before writing your coaching responses. Edit it if anything is off.
          </div>
          <textarea
            style={{ ...inputStyle, fontSize: '0.78rem', lineHeight: 1.65 }}
            rows={20}
            value={personalityDoc}
            onChange={e => setPersonalityDoc(e.target.value)}
          />
          <button
            onClick={savePersonality}
            disabled={saving}
            style={{ marginTop: '1rem', background: '#c9a84c', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontSize: '0.82rem', fontWeight: 700, color: '#0a0a0a', cursor: 'pointer' }}
          >
            {saved ? '✓ Saved & Active' : saving ? 'Saving...' : 'Save & Activate →'}
          </button>
        </div>
      )}
    </div>
  );
}
