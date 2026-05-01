import type { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import ClientPage from '@/components/ClientPage';
import ClientInit from '@/components/ClientInit';

export const metadata: Metadata = {
  title: 'MF Bharat — Start SIP Mutual Fund Investment from ₹100 | SEBI Registered App',
  description: "MF Bharat is India's easiest mutual fund investment app. Start a SIP from just ₹100. SEBI registered, 100% paperless KYC, no lock-in. Available across 500+ cities.",
  alternates: { canonical: 'https://mfbharat.in' },
  openGraph: { url: 'https://mfbharat.in', title: 'MF Bharat — Start SIP from ₹100' },
};

export default function Page() {
  const html   = readFileSync(join(process.cwd(), 'html-content',       'index.html'), 'utf-8');
  const script = readFileSync(join(process.cwd(), 'public', 'scripts', 'index.js'),   'utf-8');
  return (
    <>
      <ClientPage html={html} script={script} />
      <ClientInit />
    </>
  );
}
