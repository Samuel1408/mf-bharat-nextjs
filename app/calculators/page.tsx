import type { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import ClientPage from '@/components/ClientPage';
import ClientInit from '@/components/ClientInit';

export const metadata: Metadata = {
  title: 'SIP Calculator — Calculate Mutual Fund Returns Online',
  description: 'Free SIP, Lumpsum, Step-up SIP, and SWP calculators. Calculate how much your mutual fund investment will grow. Plan your wealth creation journey.',
  alternates: { canonical: 'https://mfbharat.in/calculators' },
  openGraph: { url: 'https://mfbharat.in/calculators', title: 'SIP & Mutual Fund Calculator' },
};

export default function Page() {
  const html   = readFileSync(join(process.cwd(), 'html-content',       'calculators.html'), 'utf-8');
  const script = readFileSync(join(process.cwd(), 'public', 'scripts', 'calculators.js'),   'utf-8');
  return (
    <>
      <ClientPage html={html} script={script} />
      <ClientInit />
    </>
  );
}
