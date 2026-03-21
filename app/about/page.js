export const metadata = {
  title: 'Christian Brown — Performance Coach & Founder of HAKD',
  description: 'Christian Brown is a performance coach specializing in nervous system optimization, HRV-based training, and adaptive programming for high-achieving professionals.',
  alternates: { canonical: 'https://hakd.app/about' },
  openGraph: {
    title: 'Christian Brown — Performance Coach',
    description: 'Performance coach specializing in nervous system optimization, HRV-based training, and adaptive programming.',
    url: 'https://hakd.app/about',
    siteName: 'HAKD',
    type: 'profile',
  },
};

const personSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Christian Brown',
  url: 'https://hakd.app/about',
  jobTitle: 'Performance Coach',
  worksFor: { '@type': 'Organization', name: 'HAKD', url: 'https://hakd.app' },
  description: 'Performance coach specializing in nervous system optimization, HRV-based training, and adaptive programming for high-achieving professionals.',
  knowsAbout: [
    'Heart Rate Variability (HRV)',
    'Nervous System Optimization',
    'Recovery Protocols',
    'Adaptive Training Programming',
    'Breathwork',
    'Sleep Optimization',
    'Biohacking',
    'Longevity Science',
    'Mental Performance',
    'Cold Therapy',
    'RPE-Based Training',
  ],
  sameAs: [
    'https://hakd.app',
    'https://coach.everfit.io/package/GL583637',
  ],
});

const breadcrumb = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hakd.app' },
    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://hakd.app/about' },
  ],
});

export default function AboutPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />

      <section className="hero" style={{ paddingBottom: '3rem' }}>
        <div className="hero-left" style={{ maxWidth: '720px' }}>
          <div className="hero-eyebrow">About the Author</div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>Christian Brown</h1>
          <p className="hero-sub" style={{ fontSize: '1.1rem' }}>
            Performance coach. Founder of HAKD. Obsessed with the gap between how hard high achievers work and how little they recover.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, maxWidth: '760px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontSize: '1rem', lineHeight: 1.8, color: 'var(--t2)' }}>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>The Problem I Keep Seeing</h2>
            <p>
              High performers don't fail because they lack discipline. They fail because they push harder when the signal says recover, they grind through fatigue they've normalized, and they have no system for measuring whether the work is actually producing adaptation.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              I built HAKD to close that gap — not with motivation content, but with the actual physiological frameworks that determine whether effort translates into performance.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>What I Focus On</h2>
            <p>
              My coaching centers on the EMM framework — Executive Mind & Body Method — a 7-dimension system covering nervous system regulation, recovery architecture, adaptive training, nutrition, mental performance, identity, and accountability.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              Every protocol I write is grounded in mechanism. Not just what works, but <em>why</em> it works and how to apply it when your schedule, travel, and stress load fight back.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>Areas of Expertise</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1.25rem' }}>
              {[
                'HRV-based training and recovery decisions',
                'Nervous system regulation under chronic stress',
                'RPE-based adaptive programming',
                'Sleep architecture and restoration biology',
                'Breathwork protocols for performance and recovery',
                'Cold therapy and hormetic stress adaptation',
                'Biomarker-informed longevity training',
                'Mental performance and cognitive resilience',
              ].map((item) => (
                <li key={item} style={{ color: 'var(--t2)' }}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>Work With Me</h2>
            <p>
              I offer two coaching formats: full monthly coaching with custom programming and weekly check-ins, and a self-guided monthly training system built on the same EMM framework.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem' }}>
              <a
                href="https://coach.everfit.io/package/GL583637"
                target="_blank"
                rel="noopener"
                className="btn-primary"
                style={{ display: 'inline-flex' }}
              >
                Monthly Coaching — $250/mo →
              </a>
              <a
                href="https://calendly.com/christianb3/15-minute-discovery-call"
                target="_blank"
                rel="noopener"
                className="btn-ghost"
                style={{ display: 'inline-flex' }}
              >
                Book a Discovery Call
              </a>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>Start Here</h2>
            <p>
              Not sure if coaching is right for you? Take the free EMM Assessment first. 17 adaptive questions across 7 dimensions. You'll get your score, your archetype, and the exact gap in your system — in 10 minutes.
            </p>
            <a
              href="https://deluxe-moxie-d4016f.netlify.app"
              target="_blank"
              rel="noopener"
              className="btn-primary"
              style={{ display: 'inline-flex', marginTop: '1rem' }}
            >
              Take the Free EMM Assessment →
            </a>
          </div>

        </div>
      </section>
    </main>
  );
}
