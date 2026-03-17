'use client';

import { useState } from 'react';

const ARCHETYPE_COLORS = {
  'The Self-Directed Optimizer': '#c9a84c',
  'The Discipline-Driven Performer': '#818cf8',
  'The Recovery-Deficit Athlete': '#34d399',
  'The High-Stress Underrecoverer': '#f87171',
  'The Inconsistent High-Potential': '#fb923c',
  'The Identity-Anchored Achiever': '#60a5fa',
};

function getArchetypeColor(archetype) {
  return ARCHETYPE_COLORS[archetype] || '#c9a84c';
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function EnergyBar({ score }) {
  const color = score >= 7 ? '#34d399' : score >= 5 ? '#c9a84c' : '#f87171';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${score * 10}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color, minWidth: '1.5rem' }}>{score}</span>
    </div>
  );
}

function CommitmentBadge({ answer }) {
  const map = {
    yes: { label: 'Honored', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    mostly: { label: 'Mostly', color: '#c9a84c', bg: 'rgba(201,168,76,0.1)' },
    struggled: { label: 'Struggled', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  };
  const s = map[answer] || map.mostly;
  return (
    <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.color, background: s.bg, padding: '0.2rem 0.55rem', borderRadius: '20px' }}>
      {s.label}
    </span>
  );
}

export default function ClientDashboard({ client, checkIns, alreadyCheckedIn, weekStart }) {
  const [view, setView] = useState(alreadyCheckedIn ? 'dashboard' : 'checkin');
  const [step, setStep] = useState(1); // 1, 2, 3
  const [form, setForm] = useState({ energy_score: 7, commitment_answer: '', flag_note: '', struggle_reason: '', support_needed: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [coachResponse, setCoachResponse] = useState('');

  const archetypeColor = getArchetypeColor(client.emm_archetype);
  const streak = calcStreak(checkIns);

  async function submitCheckIn() {
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id,
          week_of: weekStart,
          ...form,
          client_profile: client,
        }),
      });
      const data = await res.json();
      setCoachResponse(data.coach_response || '');
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
    setSubmitting(false);
  }

  const habits = [client.habit_1, client.habit_2, client.habit_3].filter(Boolean);

  return (
    <div className="client-portal">
      {/* Header */}
      <div className="cp-header">
        <div className="cp-header-inner">
          <div className="cp-brand">
            <span className="cp-brand-badge">EMM</span>
            <span className="cp-brand-name">Coaching Portal</span>
          </div>
          <div className="cp-client-name">{client.name}</div>
        </div>
      </div>

      <div className="cp-body">

        {/* Identity Card */}
        <div className="cp-identity-card" style={{ borderColor: archetypeColor }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(242,242,242,0.4)', marginBottom: '0.35rem' }}>
                EMM Archetype
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: archetypeColor, lineHeight: 1.2, marginBottom: '0.5rem' }}>
                {client.emm_archetype || 'Pending Assessment'}
              </div>
              {client.emm_primary_gap && (
                <div style={{ fontSize: '0.72rem', color: 'rgba(242,242,242,0.5)' }}>
                  Primary gap: <span style={{ color: 'rgba(242,242,242,0.8)' }}>{client.emm_primary_gap}</span>
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(242,242,242,0.4)', marginBottom: '0.3rem' }}>EMM Score</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: archetypeColor, lineHeight: 1 }}>{client.emm_score || '—'}</div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(242,242,242,0.35)' }}>/ 100</div>
            </div>
          </div>

          {/* Streak */}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text)' }}>{streak}</div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(242,242,242,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Week streak</div>
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text)' }}>{checkIns.length}</div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(242,242,242,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Total check-ins</div>
            </div>
            {checkIns[0] && (
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: checkIns[0].energy_score >= 7 ? '#34d399' : checkIns[0].energy_score >= 5 ? '#c9a84c' : '#f87171' }}>
                  {checkIns[0].energy_score}
                </div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(242,242,242,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Last energy</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav tabs */}
        <div className="cp-tabs">
          <button className={`cp-tab ${view === 'checkin' ? 'active' : ''}`} onClick={() => setView('checkin')}>
            {alreadyCheckedIn ? '✓ Checked In' : '⚡ Weekly Check-In'}
          </button>
          <button className={`cp-tab ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
            My Profile
          </button>
          <button className={`cp-tab ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>
            History
          </button>
        </div>

        {/* CHECK-IN FLOW */}
        {view === 'checkin' && !submitted && (
          <div className="cp-card">
            {alreadyCheckedIn ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✓</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#34d399', marginBottom: '0.5rem' }}>Already checked in this week</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(242,242,242,0.45)' }}>Next check-in opens Monday.</div>
                <button className="cp-btn-ghost" style={{ marginTop: '1.25rem' }} onClick={() => setView('history')}>View history →</button>
              </div>
            ) : (
              <>
                <div className="cp-card-label">Week of {formatDate(weekStart)}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Weekly Check-In</div>

                {step === 1 && (
                  <div>
                    <div className="cp-field-label">How was your energy this week?</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: form.energy_score >= 7 ? '#34d399' : form.energy_score >= 5 ? '#c9a84c' : '#f87171', textAlign: 'center', margin: '1rem 0 0.5rem' }}>
                      {form.energy_score}
                    </div>
                    <input
                      type="range" min="1" max="10" step="1"
                      value={form.energy_score}
                      onChange={(e) => setForm(f => ({ ...f, energy_score: parseInt(e.target.value) }))}
                      className="cp-slider"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'rgba(242,242,242,0.35)', marginBottom: '2rem' }}>
                      <span>Wrecked</span><span>Thriving</span>
                    </div>
                    <button className="cp-btn-primary" onClick={() => setStep(2)}>Next →</button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div className="cp-field-label">Did you honor your commitments this week?</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(242,242,242,0.4)', marginBottom: '1.25rem' }}>
                      {habits.length > 0 ? habits.join(' · ') : 'Your habits'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
                      {[
                        { val: 'yes', label: 'Yes — locked in', sub: 'Honored every commitment', color: '#34d399' },
                        { val: 'mostly', label: 'Mostly', sub: 'Hit most of them', color: '#c9a84c' },
                        { val: 'struggled', label: 'Struggled', sub: 'Fell short this week', color: '#f87171' },
                      ].map(opt => (
                        <button
                          key={opt.val}
                          className={`cp-choice ${form.commitment_answer === opt.val ? 'selected' : ''}`}
                          style={form.commitment_answer === opt.val ? { borderColor: opt.color, background: `${opt.color}10` } : {}}
                          onClick={() => setForm(f => ({ ...f, commitment_answer: opt.val }))}
                        >
                          <span style={{ fontWeight: 700, color: form.commitment_answer === opt.val ? opt.color : 'var(--text)' }}>{opt.label}</span>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(242,242,242,0.4)' }}>{opt.sub}</span>
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                      <button className="cp-btn-ghost" onClick={() => setStep(1)}>← Back</button>
                      <button className="cp-btn-primary" onClick={() => setStep(3)} disabled={!form.commitment_answer} style={{ flex: 1 }}>Next →</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    {form.commitment_answer === 'struggled' && (
                      <>
                        <div className="cp-field-label">What got in the way?</div>
                        <textarea
                          className="cp-textarea"
                          placeholder="Be honest — this is just for you and your coach..."
                          value={form.struggle_reason}
                          onChange={(e) => setForm(f => ({ ...f, struggle_reason: e.target.value }))}
                          rows={3}
                        />
                        <div className="cp-field-label" style={{ marginTop: '1rem' }}>What support do you need?</div>
                        <textarea
                          className="cp-textarea"
                          placeholder="What would help most right now?"
                          value={form.support_needed}
                          onChange={(e) => setForm(f => ({ ...f, support_needed: e.target.value }))}
                          rows={2}
                        />
                      </>
                    )}
                    <div className="cp-field-label" style={{ marginTop: form.commitment_answer === 'struggled' ? '1rem' : '0' }}>
                      Anything to flag for your coach? <span style={{ color: 'rgba(242,242,242,0.3)' }}>(optional)</span>
                    </div>
                    <textarea
                      className="cp-textarea"
                      placeholder="Injury, life update, question, win worth noting..."
                      value={form.flag_note}
                      onChange={(e) => setForm(f => ({ ...f, flag_note: e.target.value }))}
                      rows={3}
                    />
                    <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.5rem' }}>
                      <button className="cp-btn-ghost" onClick={() => setStep(2)}>← Back</button>
                      <button className="cp-btn-primary" onClick={submitCheckIn} disabled={submitting} style={{ flex: 1 }}>
                        {submitting ? 'Submitting...' : 'Submit Check-In'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* SUBMITTED STATE */}
        {view === 'checkin' && submitted && (
          <div className="cp-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✓</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#34d399', marginBottom: '0.5rem' }}>Check-in received</div>
            {coachResponse && (
              <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '10px', padding: '1rem 1.25rem', margin: '1.25rem 0', textAlign: 'left' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '0.5rem' }}>From Christian</div>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.65, color: 'rgba(242,242,242,0.85)', whiteSpace: 'pre-wrap' }}>{coachResponse}</div>
              </div>
            )}
            <div style={{ fontSize: '0.78rem', color: 'rgba(242,242,242,0.4)' }}>Next check-in opens Monday.</div>
          </div>
        )}

        {/* MY PROFILE VIEW */}
        {view === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

            {/* Commitments */}
            {habits.length > 0 && (
              <div className="cp-card">
                <div className="cp-card-label">Active Commitments</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {habits.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                      <span style={{ color: '#c9a84c', fontWeight: 900, flexShrink: 0, marginTop: '0.05rem' }}>→</span>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(242,242,242,0.85)' }}>{h}</span>
                    </div>
                  ))}
                  {client.behavior_to_stop && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', marginTop: '0.3rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: '#f87171', fontWeight: 900, flexShrink: 0, marginTop: '0.05rem' }}>✕</span>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(242,242,242,0.85)' }}>{client.behavior_to_stop}</span>
                    </div>
                  )}
                  {client.weekly_non_negotiable && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: '#818cf8', fontWeight: 900, flexShrink: 0, marginTop: '0.05rem' }}>★</span>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(242,242,242,0.85)' }}>{client.weekly_non_negotiable}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Goals */}
            {(client.primary_goal || client.success_vision) && (
              <div className="cp-card">
                <div className="cp-card-label">90-Day Focus</div>
                {client.primary_goal && (
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>{client.primary_goal}</div>
                )}
                {client.success_vision && (
                  <div style={{ fontSize: '0.8rem', color: 'rgba(242,242,242,0.5)', fontStyle: 'italic', lineHeight: 1.55 }}>"{client.success_vision}"</div>
                )}
              </div>
            )}

            {/* Physical Profile */}
            <div className="cp-card">
              <div className="cp-card-label">Training Profile</div>
              <div className="cp-grid-2">
                {client.years_training && <ProfileStat label="Years training" value={`${client.years_training} yrs`} />}
                {client.current_weekly_frequency && <ProfileStat label="Weekly sessions" value={client.current_weekly_frequency} />}
                {client.preferred_session_length && <ProfileStat label="Session length" value={`${client.preferred_session_length} min`} />}
                {client.equipment_access && <ProfileStat label="Equipment" value={client.equipment_access.replace('_', ' ')} />}
                {client.wearable_device && <ProfileStat label="Wearable" value={client.wearable_device} />}
                {client.hrv_baseline && <ProfileStat label="HRV baseline" value={client.hrv_baseline} />}
                {client.vo2max && <ProfileStat label="VO2 max" value={client.vo2max} />}
              </div>
              {client.training_background && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.78rem', color: 'rgba(242,242,242,0.5)' }}>
                  Background: {client.training_background}
                </div>
              )}
            </div>

            {/* Lifestyle */}
            <div className="cp-card">
              <div className="cp-card-label">Lifestyle Baseline</div>
              <div className="cp-grid-2">
                {client.avg_sleep_hours && <ProfileStat label="Avg sleep" value={`${client.avg_sleep_hours}h`} />}
                {client.sleep_quality && <ProfileStat label="Sleep quality" value={`${client.sleep_quality}/10`} />}
                {client.daily_stress_level && <ProfileStat label="Stress level" value={`${client.daily_stress_level}/10`} />}
                {client.nutrition_quality && <ProfileStat label="Nutrition quality" value={`${client.nutrition_quality}/10`} />}
                {client.travel_frequency && <ProfileStat label="Travel" value={client.travel_frequency} />}
                {client.occupation_type && <ProfileStat label="Work type" value={client.occupation_type} />}
              </div>
            </div>

            {/* Limitations */}
            {(client.current_injuries || client.movement_restrictions) && (
              <div className="cp-card">
                <div className="cp-card-label">Limitations & Injuries</div>
                {client.current_injuries && (
                  <div style={{ fontSize: '0.82rem', color: 'rgba(242,242,242,0.75)', marginBottom: '0.4rem' }}>{client.current_injuries}</div>
                )}
                {client.movement_restrictions && (
                  <div style={{ fontSize: '0.78rem', color: 'rgba(242,242,242,0.45)' }}>{client.movement_restrictions}</div>
                )}
              </div>
            )}

            {/* Coaching preferences */}
            <div className="cp-card">
              <div className="cp-card-label">Coaching Setup</div>
              <div className="cp-grid-2">
                {client.communication_style && <ProfileStat label="Comm style" value={client.communication_style} />}
                {client.accountability_preference && <ProfileStat label="Accountability" value={client.accountability_preference.replace('_', ' ')} />}
                {client.primary_motivator && <ProfileStat label="Motivator" value={client.primary_motivator} />}
              </div>
            </div>
          </div>
        )}

        {/* HISTORY VIEW */}
        {view === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {checkIns.length === 0 ? (
              <div className="cp-card" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'rgba(242,242,242,0.4)' }}>No check-ins yet. Submit your first one above.</div>
              </div>
            ) : (
              checkIns.map((ci) => (
                <div key={ci.id} className="cp-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(242,242,242,0.45)' }}>{formatDate(ci.submitted_at)}</div>
                    <CommitmentBadge answer={ci.commitment_answer} />
                  </div>
                  <EnergyBar score={ci.energy_score} />
                  {ci.flag_note && (
                    <div style={{ marginTop: '0.65rem', fontSize: '0.78rem', color: 'rgba(242,242,242,0.55)', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '0.65rem' }}>
                      {ci.flag_note}
                    </div>
                  )}
                  {ci.coach_response && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.78rem', color: 'rgba(242,242,242,0.6)', fontStyle: 'italic' }}>
                      <span style={{ color: '#c9a84c', fontStyle: 'normal', fontWeight: 600 }}>Christian: </span>{ci.coach_response}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function ProfileStat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(242,242,242,0.3)', marginBottom: '0.2rem' }}>{label}</div>
      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(242,242,242,0.85)', textTransform: 'capitalize' }}>{value}</div>
    </div>
  );
}

function calcStreak(checkIns) {
  if (!checkIns.length) return 0;
  // Each check-in has a week_of date. Count consecutive weeks.
  const weeks = checkIns.map(c => c.week_of).sort().reverse();
  let streak = 0;
  let current = getMonday(new Date());
  for (const w of weeks) {
    const wDate = new Date(w + 'T00:00:00');
    const expectedMonday = new Date(current);
    expectedMonday.setDate(current.getDate() - streak * 7);
    const diff = Math.round((expectedMonday - wDate) / (1000 * 60 * 60 * 24 * 7));
    if (diff === 0 || diff === 1) streak++;
    else break;
  }
  return streak;
}

function getMonday(d) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}
