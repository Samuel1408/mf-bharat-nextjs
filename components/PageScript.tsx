'use client';

import Script from 'next/script';

interface PageScriptProps {
  src: string;
}

// Loads the inline script that was extracted from each HTML page.
// Using afterInteractive ensures the DOM (from dangerouslySetInnerHTML) is ready first.
export default function PageScript({ src }: PageScriptProps) {
  return (
    <Script
      src={src}
      strategy="afterInteractive"
      // Add a timestamp to force re-execution on navigation
      key={src}
    />
  );
}
