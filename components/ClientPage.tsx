'use client';

import { useEffect, useRef } from 'react';

interface Props {
  html: string;
  script: string;
}

export default function ClientPage({ html, script }: Props) {
  const ran = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode double-fire in dev
    if (ran.current) return;
    ran.current = true;

    if (!script) return;
    try {
      // eslint-disable-next-line no-new-func
      (new Function(script))();
    } catch (e) {
      console.warn('Page script error:', e);
    }

    return () => {
      if (typeof (window as any)._kycTeardown === 'function') {
        (window as any)._kycTeardown();
      }
      ran.current = false;
    };
  }, [script]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
