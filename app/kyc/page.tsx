import type { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import ClientPage from '@/components/ClientPage';
import ClientInit from '@/components/ClientInit';
import KycPageSetup from '@/components/KycPageSetup';

export const metadata: Metadata = {
  title: 'Complete KYC — 100% Paperless in 3 Minutes',
  description: 'Complete your mutual fund KYC online in 3 minutes. 100% paperless, SEBI registered process. Upload PAN and Aadhaar — no branch visit needed.',
  alternates: { canonical: 'https://mfbharat.in/kyc' },
  robots: { index: false, follow: false },
};

export default function Page() {
  const html   = readFileSync(join(process.cwd(), 'html-content',       'kyc.html'), 'utf-8');
  const script = readFileSync(join(process.cwd(), 'public', 'scripts', 'kyc.js'),   'utf-8');
  return (
    <>
      <KycPageSetup />
      <ClientPage html={html} script={script} />
      <ClientInit />
    </>
  );
}
