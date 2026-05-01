import type { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import ClientPage from '@/components/ClientPage';
import ClientInit from '@/components/ClientInit';

export const metadata: Metadata = {
  title: 'About MF Bharat — India\'s Simplest Mutual Fund App',
  description: 'Learn about MF Bharat — our mission to make mutual fund investing accessible to every Indian household. SEBI registered, AMFI certified distributor.',
  alternates: { canonical: 'https://mfbharat.in/about' },
  openGraph: { url: 'https://mfbharat.in/about', title: 'About MF Bharat' },
};

export default function Page() {
  const html   = readFileSync(join(process.cwd(), 'html-content',       'about.html'), 'utf-8');
  const script = readFileSync(join(process.cwd(), 'public', 'scripts', 'about.js'),   'utf-8');
  return (
    <>
      <ClientPage html={html} script={script} />
      <ClientInit />
    </>
  );
}
