import type { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import ClientPage from '@/components/ClientPage';
import ClientInit from '@/components/ClientInit';

export const metadata: Metadata = {
  title: 'Compare Mutual Funds — Side-by-Side Fund Comparison',
  description: 'Compare mutual funds side by side — returns, expense ratio, risk rating, and AUM. Find the best fund for your portfolio.',
  alternates: { canonical: 'https://mfbharat.in/compare' },
  openGraph: { url: 'https://mfbharat.in/compare', title: 'Compare Mutual Funds' },
};

export default function Page() {
  const html   = readFileSync(join(process.cwd(), 'html-content',       'compare.html'), 'utf-8');
  const script = readFileSync(join(process.cwd(), 'public', 'scripts', 'compare.js'),   'utf-8');
  return (
    <>
      <ClientPage html={html} script={script} />
      <ClientInit />
    </>
  );
}
