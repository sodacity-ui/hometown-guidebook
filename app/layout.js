import './globals.css';

const siteUrl = 'https://hometownguidebook.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Hometown Guidebook | Find the Right Place to Live',
    template: '%s | Hometown Guidebook',
  },
  description:
    'Research where to live with practical city guides, side-by-side comparisons, sourced public data, and clear local tradeoffs. Starting with South Carolina.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Hometown Guidebook',
    title: 'Hometown Guidebook | Find the Right Place to Live',
    description:
      'Practical relocation guides, city comparisons, sourced public data, and clear local tradeoffs.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hometown Guidebook | Find the Right Place to Live',
    description:
      'Practical relocation guides, city comparisons, sourced public data, and clear local tradeoffs.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Hometown Guidebook',
    url: siteUrl,
    description:
      'A relocation and local-discovery publication helping people decide where to live and how to live there.',
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Hometown Guidebook',
    url: siteUrl,
  };

  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
        <header className="siteHeader">
          <div className="container navBar">
            <a className="brand" href="/"><span className="mark" />Hometown Guidebook</a>
            <nav className="navLinks" aria-label="Primary navigation">
              <a href="/quiz">Find Your Hometown</a>
              <a href="/explore">Explore</a>
              <a href="/compare">Compare</a>
              <a href="/guides">Guides</a>
              <a href="/local">Local Guide</a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="footer"><div className="container footerRow"><strong>Hometown Guidebook</strong><span>Helping you choose where to live — and how to live there.</span><a href="/methodology">Methodology & sourcing</a></div></footer>
      </body>
    </html>
  );
}
