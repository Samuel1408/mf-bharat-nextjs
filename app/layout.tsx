import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const SITE_URL = 'https://mfbharat.in';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MF Bharat — Start SIP Mutual Fund Investment from ₹100 | SEBI Registered App',
    template: '%s | MF Bharat',
  },
  description:
    "MF Bharat is India's easiest mutual fund investment app. Start a SIP from just ₹100. SEBI registered, 100% paperless KYC, no lock-in. Available across 500+ cities.",
  openGraph: {
    type: 'website',
    siteName: 'MF Bharat',
    title: 'MF Bharat — Start SIP from ₹100 | SEBI Registered App',
    description: "India's easiest mutual fund app. SEBI registered, 100% paperless KYC.",
    url: SITE_URL,
    images: [{ url: '/MF Bharat.png', width: 1200, height: 630, alt: 'MF Bharat' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MF Bharat — Start SIP from ₹100',
    description: "India's easiest mutual fund app. SEBI registered.",
    images: ['/MF Bharat.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Blocking script: set data-theme before first paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('kycTheme')||localStorage.getItem('mfb-theme')||(window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);})();` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Noto+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="cinematic-theme">
        {children}
        <Script src="/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
