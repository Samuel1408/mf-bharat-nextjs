import type { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import ClientPage from '@/components/ClientPage';
import ClientInit from '@/components/ClientInit';

export const metadata: Metadata = {
  title: 'Top AMCs in India — SBI, HDFC, ICICI, Axis & More',
  description: 'Explore top Asset Management Companies (AMCs) in India. Compare funds from SBI, HDFC, ICICI Prudential, Axis, Mirae, Nippon, Kotak, Quant, Tata & Parag Parikh.',
  alternates: { canonical: 'https://mfbharat.in/amcs' },
  openGraph: { url: 'https://mfbharat.in/amcs', title: 'Top AMCs in India' },
};

export default function Page() {
  const html   = readFileSync(join(process.cwd(), 'html-content',       'amcs.html'), 'utf-8');
  const script = readFileSync(join(process.cwd(), 'public', 'scripts', 'amcs.js'),   'utf-8');
  return (
    <>
      <ClientPage html={html} script={script} />
      <ClientInit />
    </>
  );
}
