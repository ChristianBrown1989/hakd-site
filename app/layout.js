import './globals.css';

export const metadata = {
  title: 'HAKD — Performance Intelligence for High Achievers',
  description: 'Evidence-based protocols for high-performing professionals. HRV optimization, adaptive training, recovery architecture, and nervous system science — built for people who run at full capacity.',
  metadataBase: new URL('https://hakd.app'),
  alternates: { canonical: 'https://hakd.app' },
  openGraph: {
    title: 'HAKD — Performance Intelligence',
    description: 'Evidence-based performance optimization for high achievers.',
    type: 'website',
    url: 'https://hakd.app',
    siteName: 'HAKD',
  },
  twitter: { card: 'summary_large_image', title: 'HAKD — Performance Intelligence', description: 'Evidence-based performance optimization for high achievers.' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

// JSON-LD: tells Google AND AI systems (Perplexity, ChatGPT, Claude) exactly what this site is
const schemaWebSite = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'HAKD',
  url: 'https://hakd.app',
  description: 'Evidence-based performance intelligence for high-achieving professionals — HRV, recovery, nervous system science, adaptive training, and longevity protocols.',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://hakd.app/articles?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
});

const schemaPerson = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Christian Brown',
  url: 'https://hakd.app',
  jobTitle: 'Performance Coach',
  description: 'Performance coach specializing in nervous system optimization, HRV-based training, and adaptive programming for high-achieving professionals.',
  knowsAbout: [
    'HRV Training', 'Nervous System Optimization', 'Recovery Protocols',
    'Biohacking', 'Longevity', 'Strength Training', 'Breathwork',
    'Sleep Optimization', 'Mental Performance',
  ],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaWebSite }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaPerson }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </head>
      <body>
        <div className="announce-bar">
          Free: Find your specific performance gap →{' '}
          <a href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">
            Take the EMM Assessment
          </a>
        </div>
        <nav>
          <div className="nav-inner">
            <a href="/" className="nav-logo">
              <span className="nav-logo-badge">HAKD</span>
              <span className="nav-logo-text">Performance Intelligence</span>
            </a>
            <div className="nav-center">
              <a href="/articles">Articles</a>
              <a href="/directory">Directory</a>
              <a href="#newsletter">Newsletter</a>
              <a href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">Assessment</a>
            </div>
            <div className="nav-right">
              <a className="nav-cta" href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">
                Free Assessment →
              </a>
            </div>
          </div>
        </nav>
        {children}
        <footer>
          <div className="footer-inner">
            <div>
              <div className="footer-brand-badge">HAKD</div>
              <p className="footer-brand-desc">
                Performance intelligence for high-achieving professionals. Evidence-based protocols across training, recovery, nervous system optimization, and longevity.
              </p>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Content</div>
              <a href="/articles">All Articles</a>
              <a href="/articles/category/nervous-system">Nervous System</a>
              <a href="/articles/category/recovery">Recovery</a>
              <a href="/articles/category/training-science">Training Science</a>
              <a href="/articles/category/longevity">Longevity</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Tools</div>
              <a href="/directory">Directory</a>
              <a href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener">EMM Assessment</a>
              <a href="#newsletter">Newsletter</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">EMM Coaching</div>
              <a href="https://coach.everfit.io/package/GL583637" target="_blank" rel="noopener">Monthly Coaching</a>
              <a href="https://coach.everfit.io/package/KX912574" target="_blank" rel="noopener">Monthly Training</a>
              <a href="https://calendly.com/christianb3/15-minute-discovery-call" target="_blank" rel="noopener">Discovery Call</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} HAKD · Performance Intelligence</span>
            <span>Built for high achievers who run at full capacity</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
