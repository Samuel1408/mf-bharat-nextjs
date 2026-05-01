'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientInit() {
  const ran     = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    // KYC page has its own self-contained JS — skip main site init
    if (pathname === '/kyc') return;

    let attempts = 0;
    const tryInit = () => {
      if (typeof (window as any).mfbInit === 'function') {
        (window as any).mfbInit();
      } else if (attempts < 30) {
        attempts++;
        setTimeout(tryInit, 100);
      }
    };
    tryInit();

    return () => { ran.current = false; };
  }, [pathname]);

  return null;
}
