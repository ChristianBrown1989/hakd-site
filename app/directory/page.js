export const metadata = {
  title: 'Human Optimization Directory — HAKD',
  description: 'A curated, vetted resource hub for high performers. Coaches, recovery tools, wearables, nutrition protocols, and longevity research — all reviewed for evidence quality.',
  alternates: { canonical: 'https://hakd.app/directory' },
  openGraph: {
    title: 'Human Optimization Directory — HAKD',
    description: 'Curated performance resources reviewed for evidence quality and real-world application.',
    url: 'https://hakd.app/directory',
    siteName: 'HAKD',
  },
};

export default function DirectoryPage() {
  const categories = [
    { name: 'Coaches & Practitioners', desc: 'Vetted performance coaches, sports medicine, and optimization specialists.', count: 'Coming soon' },
    { name: 'Recovery Tools', desc: 'Cold therapy, compression, breathwork devices, and recovery technology.', count: 'Coming soon' },
    { name: 'Wearables & Tracking', desc: 'HRV monitors, sleep trackers, glucose monitors, and performance wearables.', count: 'Coming soon' },
    { name: 'Nutrition Protocols', desc: 'Evidence-based nutrition frameworks, fasting protocols, and supplementation.', count: 'Coming soon' },
    { name: 'Mental Performance', desc: 'Cognitive enhancement, stress resilience, and psychological optimization.', count: 'Coming soon' },
    { name: 'Longevity Research', desc: 'Cutting-edge longevity science, biomarker testing, and healthspan protocols.', count: 'Coming soon' },
  ];

  return (
    <main>
      <section className="hero">
        <div className="hero-eyebrow">Resource Directory</div>
        <h1 className="hero-title">The Human <em>Optimization</em> Directory</h1>
        <p className="hero-sub">
          A curated, vetted resource hub for high performers. Every listing is reviewed for evidence quality and real-world application — no fluff, no affiliate noise.
        </p>
      </section>

      <section className="section">
        <div className="articles-grid">
          {categories.map((cat) => (
            <div className="article-card" key={cat.name} style={{ cursor: 'default' }}>
              <div className="article-card-tag">Directory</div>
              <div className="article-card-title">{cat.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--t3)', lineHeight: 1.6 }}>{cat.desc}</div>
              <div className="article-card-meta" style={{ color: 'var(--gold)', opacity: 0.7 }}>{cat.count}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="emm-banner">
        <div className="emm-banner-left">
          <div className="emm-banner-eyebrow">Before you explore the directory</div>
          <div className="emm-banner-title">Know exactly what you need to fix first.</div>
          <div className="emm-banner-sub">
            The EMM Assessment tells you your specific performance gap — so you know which part of the directory is most relevant to you right now.
          </div>
        </div>
        <a className="emm-banner-btn" href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">
          Take the Assessment →
        </a>
      </div>
    </main>
  );
}
