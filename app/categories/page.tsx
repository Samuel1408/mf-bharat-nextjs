import type { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import ClientPage from '@/components/ClientPage';
import ClientInit from '@/components/ClientInit';

export const metadata: Metadata = {
  title: 'Mutual Fund Categories — Equity, Debt, Hybrid & SIFs',
  description: 'Explore mutual fund categories — Equity, Debt, Hybrid, ELSS, and Specialised Investment Funds (SIFs). Find the right fund type for your investment goal.',
  alternates: { canonical: 'https://mfbharat.in/categories' },
  openGraph: { url: 'https://mfbharat.in/categories', title: 'Mutual Fund Categories' },
};

export default function Page() {
  const html   = readFileSync(join(process.cwd(), 'html-content',       'categories.html'), 'utf-8');
  const script = readFileSync(join(process.cwd(), 'public', 'scripts', 'categories.js'),   'utf-8');
  return (
    <>
      <ClientPage html={html} script={script} />
      <ClientInit />
    </>
  );
}
