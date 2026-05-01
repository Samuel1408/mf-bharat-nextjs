import type { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import ClientPage from '@/components/ClientPage';
import ClientInit from '@/components/ClientInit';

export const metadata: Metadata = {
  title: 'Explore Mutual Funds — Best SIP Funds in India',
  description: 'Browse top-rated mutual funds by category, risk, and returns. Filter by AMC, fund type, and investment horizon. Start SIP from ₹100.',
  alternates: { canonical: 'https://mfbharat.in/explore' },
  openGraph: { url: 'https://mfbharat.in/explore', title: 'Explore Mutual Funds' },
};

export default function Page() {
  const html   = readFileSync(join(process.cwd(), 'html-content',       'explore.html'), 'utf-8');
  const script = readFileSync(join(process.cwd(), 'public', 'scripts', 'explore.js'),   'utf-8');
  return (
    <>
      <ClientPage html={html} script={script} />
      <ClientInit />
    </>
  );
}
