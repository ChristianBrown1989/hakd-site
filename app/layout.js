import './globals.css';

export const metadata = {
  title: 'HAKD — Performance Intelligence',
  description: 'Evidence-based performance optimization for high achievers. Training, recovery, nervous system, and biohacking protocols that actually work.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <div className="nav-logo">
            <span className="nav-logo-badge">HAKD</span>
            <span className="nav-logo-text">Performance Intelligence</span>
          </div>
          <div className="nav-links">
            <a href="/articles">Articles</a>
            <a href="/directory">Directory</a>
            <a href="https://deluxe-moxie-d4016f.netlify.app" target="_blank" rel="noopener" className="nav-cta">Free Assessment</a>
          </div>
        </nav>
        {children}
        <footer>
          <p>© {new Date().getFullYear()} HAKD · Performance Intelligence · <span>Built for high achievers</span></p>
        </footer>
      </body>
    </html>
  );
}
