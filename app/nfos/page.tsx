import type { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import ClientPage from '@/components/ClientPage';
import ClientInit from '@/components/ClientInit';

export const metadata: Metadata = {
  title: 'New Fund Offers (NFOs) — Latest Mutual Fund Launches',
  description: 'Invest in the latest New Fund Offers (NFOs) in India. Discover new mutual fund schemes from top AMCs before they close. Early access at ₹10 NAV.',
  alternates: { canonical: 'https://mfbharat.in/nfos' },
  openGraph: { url: 'https://mfbharat.in/nfos', title: 'Latest NFOs in India' },
};

export default function Page() {
  const html   = readFileSync(join(process.cwd(), 'html-content',       'nfos.html'), 'utf-8');
  const script = readFileSync(join(process.cwd(), 'public', 'scripts', 'nfos.js'),   'utf-8');
  return (
    <>
      <ClientPage html={html} script={script} />
      <ClientInit />
    </>
  );
}
