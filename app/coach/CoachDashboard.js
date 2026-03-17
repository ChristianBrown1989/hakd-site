'use client';

import { useState } from 'react';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getStatus(client, checkIns, thisWeek) {
  const thisWeekCI = checkIns.find(c => c.client_id === client.id && c.week_of === thisWeek);
  if (!thisWeekCI) return 'missing';
  if (thisWeekCI.commitment_answer === 'struggled' || thisWeekCI.energy_score <= 4) return 'red';
  if (thisWeekCI.commitment_answer === 'mostly' || thisWeekCI.energy_score <= 6) return 'yellow';
  return 'green';
}

const STATUS_STYLES = {
  green:   { dot: '#34d399', label: 'On track',     bg: 'rgba(52,211,153,0.06)',  border: 'rgba(52,211,153,0.15)' },
  yellow:  { dot: '#c9a84c', label: 'Watch',         bg: 'rgba(201,168,76,0.06)', border: 'rgba(201,168,76,0.2)' },
  red:     { dot: '#f87171', label: 'Needs attention', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.2)' },
  missing: { dot: '#555',    label: 'No check-in',   bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.06)' },
};

export default function CoachDashboard({ clients, allCheckIns, thisWeek }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const clientStatuses = clients.map(c => ({
    client: c,
    status: getStatus(c, allCheckIns, thisWeek),
    thisWeekCI: allCheckIns.find(ci => ci.client_id === c.id && ci.week_of === thisWeek),
    recentCIs: allCheckIns.filter(ci => ci.client_id === c.id).slice(0, 5),
  }));

  const filtered = filter === 'all' ? clientStatuses : clientStatuses.filter(cs => cs.status === filter);

  const counts = {
    red: clientStatuses.filter(cs => cs.status === 'red').length,
    yellow: clientStatuses.filter(cs => cs.status === 'yellow').length,
    green: clientStatuses.filter(cs => cs.status === 'green').length,
    missing: clientStatuses.filter(cs => cs.status === 'missing').length,
  };

  const selectedData = selected ? clientStatuses.find(cs => cs.client.id === selected) : null;
  const selectedAllCIs = selected ? allCheckIns.filter(ci => ci.client_id === selected) : [];

  return (
    <div className="coach-portal">
      <div className="coach-header">
        <div className="coach-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="cp-brand-badge">EMM</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>Coach Dashboard</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="/onboard" style={{ fontSize: '0.75rem', color: '#c9a84c', fontWeight: 600 }}>+ Add Client</a>
            <a href="/coach/personality" style={{ fontSize: '0.75rem', color: 'rgba(242,242,242,0.45)', fontWeight: 600 }}>Personality DB</a>
          </div>
        </div>
      </div>

      <div className="coach-body">

        {/* Summary row */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {[
            { key: 'all', label: 'All clients', count: clients.length, color: 'var(--text)' },
            { key: 'red', label: 'Needs attention', count: counts.red, color: '#f87171' },
            { key: 'yellow', label: 'Watch', count: counts.yellow, color: '#c9a84c' },
            { key: 'green', label: 'On track', count: counts.green, color: '#34d399' },
            { key: 'missing', label: 'No check-in', count: counts.missing, color: '#666' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              style={{
                background: filter === s.key ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: `1px solid ${filter === s.key ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '8px', padding: '0.5rem 0.85rem', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '1.3rem', fontWeight: 900, color: s.color }}>{s.count}</span>
              <span style={{ fontSize: '0.6rem', color: 'rgba(242,242,242,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1rem' }}>

          {/* Client list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(242,242,242,0.3)', marginBottom: '0.25rem' }}>
              Week of {formatDate(thisWeek)}
            </div>
            {filtered.length === 0 && (
              <div style={{ fontSize: '0.82rem', color: 'rgba(242,242,242,0.35)', padding: '1.5rem 0' }}>No clients in this category.</div>
            )}
            {filtered.map(({ client, status, thisWeekCI }) => {
              const st = STATUS_STYLES[status];
              const isSelected = selected === client.id;
              return (
                <div
                  key={client.id}
                  onClick={() => setSelected(isSelected ? null : client.id)}
                  style={{
                    background: isSelected ? 'rgba(201,168,76,0.05)' : st.bg,
                    border: `1px solid ${isSelected ? 'rgba(201,168,76,0.3)' : st.border}`,
                    borderRadius: '10px', padding: '0.9rem 1rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                  }}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>{client.name}</div>
                    {client.emm_archetype && (
                      <div style={{ fontSize: '0.68rem', color: 'rgba(242,242,242,0.4)', marginTop: '0.1rem' }}>{client.emm_archetype}</div>
                    )}
                  </div>
                  {thisWeekCI ? (
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: thisWeekCI.energy_score >= 7 ? '#34d399' : thisWeekCI.energy_score >= 5 ? '#c9a84c' : '#f87171' }}>
                        {thisWeekCI.energy_score}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'rgba(242,242,242,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>energy</div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.68rem', color: 'rgba(242,242,242,0.25)' }}>No check-in</div>
                  )}
                  {thisWeekCI?.flag_note && (
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c9a84c', flexShrink: 0 }} title="Has a flag note" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Client detail panel */}
          {selectedData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>{selectedData.client.name}</div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(242,242,242,0.35)', fontSize: '1.1rem', cursor: 'pointer' }}>✕</button>
              </div>

              {/* Archetype + score */}
              <div className="cp-card" style={{ padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(242,242,242,0.4)', marginBottom: '0.2rem' }}>Archetype</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c9a84c' }}>{selectedData.client.emm_archetype || '—'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#c9a84c' }}>{selectedData.client.emm_score || '—'}</div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(242,242,242,0.3)' }}>EMM score</div>
                  </div>
                </div>
                <div style={{ marginTop: '0.65rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a
                    href={`/clients/${selectedData.client.token}`}
                    target="_blank"
                    style={{ fontSize: '0.7rem', color: '#c9a84c', fontWeight: 600 }}
                  >
                    View client page →
                  </a>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(242,242,242,0.3)' }}>
                    hakd.app/clients/{selectedData.client.token}
                  </span>
                </div>
              </div>

              {/* This week's check-in */}
              {selectedData.thisWeekCI && (
                <div className="cp-card" style={{ padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(242,242,242,0.35)', marginBottom: '0.65rem' }}>This Week</div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.65rem' }}>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: selectedData.thisWeekCI.energy_score >= 7 ? '#34d399' : selectedData.thisWeekCI.energy_score >= 5 ? '#c9a84c' : '#f87171' }}>
                        {selectedData.thisWeekCI.energy_score}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'rgba(242,242,242,0.35)', textTransform: 'uppercase' }}>energy</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', textTransform: 'capitalize', marginTop: '0.25rem' }}>
                        {selectedData.thisWeekCI.commitment_answer}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'rgba(242,242,242,0.35)', textTransform: 'uppercase' }}>commitments</div>
                    </div>
                  </div>
                  {selectedData.thisWeekCI.struggle_reason && (
                    <div style={{ fontSize: '0.78rem', color: 'rgba(242,242,242,0.65)', marginBottom: '0.4rem' }}>
                      <span style={{ color: '#f87171', fontWeight: 600 }}>Got in the way: </span>{selectedData.thisWeekCI.struggle_reason}
                    </div>
                  )}
                  {selectedData.thisWeekCI.flag_note && (
                    <div style={{ fontSize: '0.78rem', color: 'rgba(242,242,242,0.65)', marginBottom: '0.4rem' }}>
                      <span style={{ color: '#c9a84c', fontWeight: 600 }}>Flagged: </span>{selectedData.thisWeekCI.flag_note}
                    </div>
                  )}
                  {selectedData.thisWeekCI.coach_response && (
                    <div style={{ marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.78rem', color: 'rgba(242,242,242,0.55)', fontStyle: 'italic' }}>
                      <span style={{ color: '#c9a84c', fontStyle: 'normal', fontWeight: 600 }}>Your response: </span>{selectedData.thisWeekCI.coach_response}
                    </div>
                  )}
                </div>
              )}

              {/* Commitments */}
              <div className="cp-card" style={{ padding: '0.85rem' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(242,242,242,0.35)', marginBottom: '0.65rem' }}>Commitments</div>
                {[selectedData.client.habit_1, selectedData.client.habit_2, selectedData.client.habit_3].filter(Boolean).map((h, i) => (
                  <div key={i} style={{ fontSize: '0.78rem', color: 'rgba(242,242,242,0.75)', marginBottom: '0.3rem' }}>→ {h}</div>
                ))}
                {selectedData.client.behavior_to_stop && (
                  <div style={{ fontSize: '0.78rem', color: 'rgba(248,113,113,0.7)', marginTop: '0.3rem' }}>✕ {selectedData.client.behavior_to_stop}</div>
                )}
              </div>

              {/* Recent history */}
              {selectedAllCIs.length > 0 && (
                <div className="cp-card" style={{ padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(242,242,242,0.35)', marginBottom: '0.65rem' }}>Recent History</div>
                  {selectedAllCIs.slice(0, 6).map(ci => (
                    <div key={ci.id} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem' }}>
                      <span style={{ fontSize: '0.68rem', color: 'rgba(242,242,242,0.35)', minWidth: '3.5rem' }}>{formatDate(ci.submitted_at)}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: ci.energy_score >= 7 ? '#34d399' : ci.energy_score >= 5 ? '#c9a84c' : '#f87171' }}>{ci.energy_score}</span>
                      <span style={{ fontSize: '0.68rem', color: 'rgba(242,242,242,0.4)', textTransform: 'capitalize' }}>{ci.commitment_answer}</span>
                      {ci.flag_note && <span style={{ fontSize: '0.65rem', color: '#c9a84c' }}>⚑</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
