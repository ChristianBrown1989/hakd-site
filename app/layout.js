import './globals.css';

export const metadata = {
  title: 'HAKD — Performance Intelligence for High Achievers',
  description: 'Evidence-based protocols for high-performing professionals. HRV optimization, adaptive training, recovery architecture, and nervous system science — built for people who run at full capacity.',
  openGraph: {
    title: 'HAKD — Performance Intelligence',
    description: 'Evidence-based performance optimization for high achievers.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
              <a href="/articles">Nervous System</a>
              <a href="/articles">Recovery</a>
              <a href="/articles">Training Science</a>
              <a href="/articles">Longevity</a>
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
