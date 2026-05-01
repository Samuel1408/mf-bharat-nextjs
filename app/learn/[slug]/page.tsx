import type { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import ClientPage from '@/components/ClientPage';
import ClientInit from '@/components/ClientInit';

const ARTICLES: Record<string, { title: string; description: string; file: string }> = {
  'what-is-a-mutual-fund': {
    title: 'What is a Mutual Fund? The Simplest Explanation',
    description: 'A mutual fund pools money from thousands of investors and a professional manages it. Learn the basics in plain English.',
    file: 'learn-what-is-mutual-fund',
  },
  'sip-vs-lumpsum': {
    title: 'SIP vs Lumpsum: Which Wins After 10 Years?',
    description: 'We ran the numbers across 20 years of Nifty data. The answer surprises most people during market crashes.',
    file: 'learn-sip-vs-lumpsum',
  },
  'elss-funds-tax-saving': {
    title: 'ELSS Funds: Save ₹46,800 in Tax With One Investment',
    description: 'Section 80C deductions are the easiest personal finance win. ELSS makes it better — your money grows too.',
    file: 'learn-elss-funds-tax-saving',
  },
  'market-crashes-sip': {
    title: 'Why Market Crashes Are Good for Your SIP',
    description: 'When markets fall 30%, your SIP buys more units. Rupee cost averaging is your silent compounding weapon.',
    file: 'learn-market-crashes-sip',
  },
  'expense-ratio': {
    title: 'Expense Ratio: The Silent Killer of Long-Term Wealth',
    description: 'A 1.5% fee on a 12% return sounds tiny. Over 30 years it eats 26% of your corpus. Here\'s how to fight it.',
    file: 'learn-expense-ratio',
  },
  'start-sip-100': {
    title: 'Start a SIP with ₹100 — Step-by-Step Guide',
    description: 'Download, KYC in 60 seconds, pick a fund. Your first SIP is live in under 3 minutes. No paperwork.',
    file: 'learn-start-sip-100',
  },
  'step-up-sip': {
    title: 'Step-Up SIP: Increase 10%/Year, Multiply Wealth by 2x',
    description: 'Start at ₹1,000 and raise 10% every year. In 20 years the difference vs flat SIP is ₹28 lakh+.',
    file: 'learn-step-up-sip',
  },
  'ltcg-vs-stcg': {
    title: 'LTCG vs STCG: When Should You Redeem?',
    description: 'Hold 12+ months = 10% tax. Sell before = 15%. On ₹5 lakh that difference is ₹25,000 in your pocket.',
    file: 'learn-ltcg-vs-stcg',
  },
  'portfolio-rebalancing': {
    title: 'Portfolio Rebalancing: Keep Asset Allocation on Track',
    description: 'Your 60/40 equity-debt split drifts as markets move. Rebalancing annually keeps you in full control.',
    file: 'learn-portfolio-rebalancing',
  },
  '500-sip-42-lakh': {
    title: 'The ₹500 SIP That Turned Into ₹42 Lakh — A True Story',
    description: 'Ramesh from Jaipur started a ₹500 SIP in 2001. 23 years later, he had ₹42 lakh. Here\'s the math.',
    file: 'learn-500-sip-42-lakh',
  },
};

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = ARTICLES[params.slug];
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `https://mfbharat.in/learn/${params.slug}` },
    openGraph: { url: `https://mfbharat.in/learn/${params.slug}`, title: article.title },
  };
}

export default function Page({ params }: Props) {
  const article = ARTICLES[params.slug];
  if (!article) notFound();

  const html = readFileSync(join(process.cwd(), 'html-content', `${article.file}.html`), 'utf-8');
  const script = readFileSync(join(process.cwd(), 'public', 'scripts', 'learn-article.js'), 'utf-8');

  return (
    <>
      <Script id="google-translate-init" strategy="afterInteractive">
        {`function googleTranslateElementInit() { new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'en,hi,mr', autoDisplay: false}, 'google_translate_element'); }`}
      </Script>
      <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
      <Script src="/scripts/article-audio.js" strategy="lazyOnload" />
      <ClientPage html={html} script={script} />
      <ClientInit />
    </>
  );
}
