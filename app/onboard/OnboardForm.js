'use client';

import { useState } from 'react';

const ARCHETYPES = [
  'The Self-Directed Optimizer',
  'The Discipline-Driven Performer',
  'The Recovery-Deficit Athlete',
  'The High-Stress Underrecoverer',
  'The Inconsistent High-Potential',
  'The Identity-Anchored Achiever',
];

const COACHING_NEEDS = ['Training', 'Mindset', 'Habits', 'Recovery', 'Nutrition'];

function Section({ title, children }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1.25rem' }}>{title}</div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(242,242,242,0.65)', marginBottom: hint ? '0.2rem' : '0.4rem' }}>{label}</label>
      {hint && <div style={{ fontSize: '0.65rem', color: 'rgba(242,242,242,0.3)', marginBottom: '0.4rem' }}>{hint}</div>}
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', background: 'var(--s2)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px', padding: '0.7rem 0.85rem', fontSize: '0.85rem', color: 'var(--text)',
  outline: 'none', fontFamily: 'inherit',
};

const selectStyle = { ...inputStyle, cursor: 'pointer' };

export default function OnboardForm() {
  const [form, setForm] = useState({
    name: '', email: '', age: '',
    emm_archetype: '', emm_score: '', emm_primary_gap: '',
    height_cm: '', weight_kg: '', body_comp_goal: '',
    years_training: '', training_background: '',
    current_weekly_frequency: '', preferred_session_length: '',
    equipment_access: '', wearable_device: '', hrv_baseline: '', vo2max: '',
    current_injuries: '', movement_restrictions: '', past_surgeries: '', contraindications: '',
    occupation_type: '', daily_stress_level: '', travel_frequency: '',
    avg_sleep_hours: '', sleep_quality: '', alcohol_frequency: '', caffeine_habits: '',
    nutrition_approach: '', nutrition_quality: '',
    primary_goal: '', secondary_goal: '', success_vision: '', past_obstacles: '', non_negotiables: '',
    primary_motivator: '', communication_style: '', accountability_preference: '',
    coaching_needs: [],
    biggest_obstacle: '',
    habit_1: '', habit_2: '', habit_3: '',
    behavior_to_stop: '', weekly_non_negotiable: '',
  });
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function toggleNeed(need) {
    setForm(f => ({
      ...f,
      coaching_needs: f.coaching_needs.includes(need)
        ? f.coaching_needs.filter(n => n !== need)
        : [...f.coaching_needs, need],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/coach/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.token) {
      setResult(data);
    }
    setSaving(false);
  }

  if (result) {
    const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://hakd.app'}/clients/${result.token}`;
    return (
      <div style={{ maxWidth: '540px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#34d399', marginBottom: '0.5rem' }}>{result.name} is set up</div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(242,242,242,0.5)', marginBottom: '1.5rem' }}>Send them this link:</div>
        <div style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '10px', padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#c9a84c', fontWeight: 600, wordBreak: 'break-all', marginBottom: '1.25rem' }}>
          {url}
        </div>
        <button
          onClick={() => { navigator.clipboard.writeText(url); }}
          style={{ background: '#c9a84c', color: '#0a0a0a', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', marginBottom: '1rem' }}
        >
          Copy link
        </button>
        <div><a href="/coach" style={{ fontSize: '0.78rem', color: 'rgba(242,242,242,0.4)' }}>← Back to dashboard</a></div>
        <div><a href="/onboard" style={{ fontSize: '0.78rem', color: 'rgba(242,242,242,0.4)' }}>+ Add another client</a></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <a href="/coach" style={{ fontSize: '0.75rem', color: 'rgba(242,242,242,0.4)' }}>← Dashboard</a>
        <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text)', marginTop: '0.5rem' }}>New Client Onboarding</div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(242,242,242,0.4)' }}>Fill this in together on the first call.</div>
      </div>

      <form onSubmit={handleSubmit}>

        <Section title="Identity">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label="Full name *">
              <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Jane Smith" />
            </Field>
            <Field label="Age">
              <input style={inputStyle} type="number" value={form.age} onChange={e => set('age', e.target.value)} placeholder="34" />
            </Field>
            <Field label="Email">
              <input style={inputStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@email.com" />
            </Field>
            <Field label="EMM Score">
              <input style={inputStyle} type="number" min="0" max="100" value={form.emm_score} onChange={e => set('emm_score', e.target.value)} placeholder="72" />
            </Field>
          </div>
          <Field label="EMM Archetype">
            <select style={selectStyle} value={form.emm_archetype} onChange={e => set('emm_archetype', e.target.value)}>
              <option value="">Select archetype</option>
              {ARCHETYPES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
          <Field label="Primary Gap" hint="What the assessment identified as their biggest gap">
            <input style={inputStyle} value={form.emm_primary_gap} onChange={e => set('emm_primary_gap', e.target.value)} placeholder="e.g. Recovery consistency" />
          </Field>
        </Section>

        <Section title="Physical Baseline">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label="Height (cm)">
              <input style={inputStyle} type="number" value={form.height_cm} onChange={e => set('height_cm', e.target.value)} placeholder="178" />
            </Field>
            <Field label="Weight (kg)">
              <input style={inputStyle} type="number" step="0.1" value={form.weight_kg} onChange={e => set('weight_kg', e.target.value)} placeholder="82.5" />
            </Field>
            <Field label="Body composition goal">
              <input style={inputStyle} value={form.body_comp_goal} onChange={e => set('body_comp_goal', e.target.value)} placeholder="e.g. Build lean muscle" />
            </Field>
            <Field label="Years training">
              <input style={inputStyle} type="number" value={form.years_training} onChange={e => set('years_training', e.target.value)} placeholder="6" />
            </Field>
            <Field label="Sessions/week currently">
              <input style={inputStyle} type="number" value={form.current_weekly_frequency} onChange={e => set('current_weekly_frequency', e.target.value)} placeholder="4" />
            </Field>
            <Field label="Preferred session length (min)">
              <input style={inputStyle} type="number" value={form.preferred_session_length} onChange={e => set('preferred_session_length', e.target.value)} placeholder="60" />
            </Field>
            <Field label="Equipment access">
              <select style={selectStyle} value={form.equipment_access} onChange={e => set('equipment_access', e.target.value)}>
                <option value="">Select</option>
                <option value="full_gym">Full gym</option>
                <option value="home">Home gym</option>
                <option value="both">Both</option>
                <option value="minimal">Minimal equipment</option>
              </select>
            </Field>
            <Field label="Wearable device">
              <input style={inputStyle} value={form.wearable_device} onChange={e => set('wearable_device', e.target.value)} placeholder="e.g. Whoop 4.0, Apple Watch" />
            </Field>
            <Field label="HRV baseline">
              <input style={inputStyle} type="number" value={form.hrv_baseline} onChange={e => set('hrv_baseline', e.target.value)} placeholder="55" />
            </Field>
            <Field label="VO2 max (if known)">
              <input style={inputStyle} type="number" step="0.1" value={form.vo2max} onChange={e => set('vo2max', e.target.value)} placeholder="48.2" />
            </Field>
          </div>
          <Field label="Training background & sports history">
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={form.training_background} onChange={e => set('training_background', e.target.value)} placeholder="e.g. 10 years weightlifting, former rugby player, did a marathon in 2022" />
          </Field>
        </Section>

        <Section title="Injuries & Limitations">
          <Field label="Current injuries or pain">
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={form.current_injuries} onChange={e => set('current_injuries', e.target.value)} placeholder="e.g. Left shoulder impingement, lower back stiffness mornings" />
          </Field>
          <Field label="Movement restrictions">
            <input style={inputStyle} value={form.movement_restrictions} onChange={e => set('movement_restrictions', e.target.value)} placeholder="e.g. No overhead pressing, avoid deep knee flexion" />
          </Field>
          <Field label="Past surgeries or significant injuries">
            <input style={inputStyle} value={form.past_surgeries} onChange={e => set('past_surgeries', e.target.value)} placeholder="e.g. ACL reconstruction 2019" />
          </Field>
          <Field label="Contraindications (what they've been told not to do)">
            <input style={inputStyle} value={form.contraindications} onChange={e => set('contraindications', e.target.value)} placeholder="e.g. No spinal loading per physio" />
          </Field>
        </Section>

        <Section title="Lifestyle & Recovery">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label="Occupation type">
              <select style={selectStyle} value={form.occupation_type} onChange={e => set('occupation_type', e.target.value)}>
                <option value="">Select</option>
                <option value="desk">Desk / sedentary</option>
                <option value="physical">Physically active</option>
                <option value="variable">Variable</option>
              </select>
            </Field>
            <Field label="Daily stress level (1-10)">
              <input style={inputStyle} type="number" min="1" max="10" value={form.daily_stress_level} onChange={e => set('daily_stress_level', e.target.value)} placeholder="7" />
            </Field>
            <Field label="Travel frequency">
              <select style={selectStyle} value={form.travel_frequency} onChange={e => set('travel_frequency', e.target.value)}>
                <option value="">Select</option>
                <option value="none">None</option>
                <option value="occasional">Occasional (1-2x/month)</option>
                <option value="frequent">Frequent (weekly)</option>
              </select>
            </Field>
            <Field label="Avg sleep hours/night">
              <input style={inputStyle} type="number" step="0.5" value={form.avg_sleep_hours} onChange={e => set('avg_sleep_hours', e.target.value)} placeholder="7" />
            </Field>
            <Field label="Sleep quality (1-10)">
              <input style={inputStyle} type="number" min="1" max="10" value={form.sleep_quality} onChange={e => set('sleep_quality', e.target.value)} placeholder="6" />
            </Field>
            <Field label="Nutrition quality (1-10)">
              <input style={inputStyle} type="number" min="1" max="10" value={form.nutrition_quality} onChange={e => set('nutrition_quality', e.target.value)} placeholder="7" />
            </Field>
          </div>
          <Field label="Alcohol frequency">
            <input style={inputStyle} value={form.alcohol_frequency} onChange={e => set('alcohol_frequency', e.target.value)} placeholder="e.g. 1-2 drinks on weekends only" />
          </Field>
          <Field label="Caffeine habits">
            <input style={inputStyle} value={form.caffeine_habits} onChange={e => set('caffeine_habits', e.target.value)} placeholder="e.g. 2 coffees before noon" />
          </Field>
          <Field label="Nutrition approach / restrictions">
            <input style={inputStyle} value={form.nutrition_approach} onChange={e => set('nutrition_approach', e.target.value)} placeholder="e.g. High protein, no specific diet, lactose intolerant" />
          </Field>
        </Section>

        <Section title="Goals">
          <Field label="Primary 90-day goal *">
            <input style={inputStyle} value={form.primary_goal} onChange={e => set('primary_goal', e.target.value)} required placeholder="e.g. Build 5kg lean muscle while maintaining fitness" />
          </Field>
          <Field label="Secondary goal">
            <input style={inputStyle} value={form.secondary_goal} onChange={e => set('secondary_goal', e.target.value)} placeholder="e.g. Improve sleep quality" />
          </Field>
          <Field label="What does success look, feel, and sound like?" hint="Have them describe it in their own words">
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={form.success_vision} onChange={e => set('success_vision', e.target.value)} placeholder="e.g. I wake up with energy, my clothes fit better, I'm training consistently without burnout..." />
          </Field>
          <Field label="What has stopped them before?">
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={form.past_obstacles} onChange={e => set('past_obstacles', e.target.value)} placeholder="e.g. Travel, work stress, inconsistency when tired, starting too hard and burning out" />
          </Field>
          <Field label="What they won't compromise on">
            <input style={inputStyle} value={form.non_negotiables} onChange={e => set('non_negotiables', e.target.value)} placeholder="e.g. Family time Sunday, no early morning training" />
          </Field>
        </Section>

        <Section title="Coaching Preferences">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label="What motivates them most">
              <select style={selectStyle} value={form.primary_motivator} onChange={e => set('primary_motivator', e.target.value)}>
                <option value="">Select</option>
                <option value="achievement">Achievement / hitting goals</option>
                <option value="aesthetics">Aesthetics / how they look</option>
                <option value="health">Long-term health</option>
                <option value="performance">Athletic performance</option>
                <option value="identity">Identity / who they're becoming</option>
                <option value="energy">Daily energy & function</option>
              </select>
            </Field>
            <Field label="Communication style preference">
              <select style={selectStyle} value={form.communication_style} onChange={e => set('communication_style', e.target.value)}>
                <option value="">Select</option>
                <option value="direct">Direct / tough love</option>
                <option value="supportive">Supportive / encouraging</option>
                <option value="educational">Educational / explain the why</option>
                <option value="mixed">Mixed</option>
              </select>
            </Field>
            <Field label="Accountability style">
              <select style={selectStyle} value={form.accountability_preference} onChange={e => set('accountability_preference', e.target.value)}>
                <option value="">Select</option>
                <option value="hard_push">Hard push — call me out</option>
                <option value="gentle">Gentle check-in</option>
                <option value="aware">Just be aware</option>
              </select>
            </Field>
          </div>
          <Field label="What they need most from coaching" hint="Select all that apply">
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {COACHING_NEEDS.map(n => (
                <button
                  key={n} type="button"
                  onClick={() => toggleNeed(n)}
                  style={{
                    background: form.coaching_needs.includes(n) ? 'rgba(201,168,76,0.15)' : 'var(--s2)',
                    border: `1px solid ${form.coaching_needs.includes(n) ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '20px', padding: '0.35rem 0.85rem',
                    fontSize: '0.75rem', fontWeight: 600,
                    color: form.coaching_needs.includes(n) ? '#c9a84c' : 'rgba(242,242,242,0.55)',
                    cursor: 'pointer',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Their biggest current obstacle">
            <input style={inputStyle} value={form.biggest_obstacle} onChange={e => set('biggest_obstacle', e.target.value)} placeholder="e.g. Consistency when work gets busy" />
          </Field>
        </Section>

        <Section title="Commitments (co-create on the call)">
          <Field label="Habit 1 to build *">
            <input style={inputStyle} value={form.habit_1} onChange={e => set('habit_1', e.target.value)} required placeholder="e.g. 8 hours in bed by 10:30pm on work nights" />
          </Field>
          <Field label="Habit 2 to build">
            <input style={inputStyle} value={form.habit_2} onChange={e => set('habit_2', e.target.value)} placeholder="e.g. 5-min walk within 30 min of waking" />
          </Field>
          <Field label="Habit 3 to build">
            <input style={inputStyle} value={form.habit_3} onChange={e => set('habit_3', e.target.value)} placeholder="e.g. No screens after 9pm" />
          </Field>
          <Field label="Behavior to stop">
            <input style={inputStyle} value={form.behavior_to_stop} onChange={e => set('behavior_to_stop', e.target.value)} placeholder="e.g. Skipping training when tired without checking HRV first" />
          </Field>
          <Field label="Weekly non-negotiable (the one thing they commit to every week no matter what)">
            <input style={inputStyle} value={form.weekly_non_negotiable} onChange={e => set('weekly_non_negotiable', e.target.value)} placeholder="e.g. At least 3 training sessions, even if short" />
          </Field>
        </Section>

        <button
          type="submit"
          disabled={saving}
          style={{ width: '100%', background: '#c9a84c', color: '#0a0a0a', border: 'none', borderRadius: '10px', padding: '1rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit', marginTop: '0.5rem' }}
        >
          {saving ? 'Creating client...' : 'Create Client & Generate Link →'}
        </button>
      </form>
    </div>
  );
}
