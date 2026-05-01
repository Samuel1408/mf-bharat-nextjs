'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KycPageSetup() {
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add('kyc-page');
    (window as any)._kycNavigate = (path: string) => router.push(path);

    return () => {
      document.body.classList.remove('kyc-page');
      delete (window as any)._kycNavigate;
    };
  }, [router]);

  return null;
}
