import type { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import ClientPage from '@/components/ClientPage';
import ClientInit from '@/components/ClientInit';

export const metadata: Metadata = {
  title: 'Learn Mutual Funds — Guides, Glossary & SIP Tips',
  description: 'Learn everything about mutual funds — SIP basics, NAV, expense ratio, fund types, and smart investing strategies. Free guides for beginners and experienced investors.',
  alternates: { canonical: 'https://mfbharat.in/learn' },
  openGraph: { url: 'https://mfbharat.in/learn', title: 'Learn Mutual Funds' },
};

export default function Page() {
  const html   = readFileSync(join(process.cwd(), 'html-content',       'learn.html'), 'utf-8');
  const script = readFileSync(join(process.cwd(), 'public', 'scripts', 'learn.js'),   'utf-8');
  return (
    <>
      <ClientPage html={html} script={script} />
      <ClientInit />
    </>
  );
}
