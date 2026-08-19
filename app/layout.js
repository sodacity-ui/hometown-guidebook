import './globals.css';

export const metadata = {
  title: { default: 'Hometown Guidebook', template: '%s | Hometown Guidebook' },
  description: 'A relocation and local-discovery guide beginning with South Carolina.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="siteHeader">
          <div className="container navBar">
            <a className="brand" href="/"><span className="mark" />Hometown Guidebook</a>
            <nav className="navLinks">
              <a href="/quiz">Find Your Hometown</a>
              <a href="/explore">Explore</a>
              <a href="/compare">Compare</a>
              <a href="/guides">Guides</a>
              <a href="/local">Local Guide</a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="footer"><div className="container footerRow"><strong>Hometown Guidebook</strong><span>Helping you choose where to live — and how to live there.</span></div></footer>
      </body>
    </html>
  );
}
