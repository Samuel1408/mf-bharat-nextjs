import { readFileSync } from 'fs';
import { join } from 'path';
import ClientPage from '@/components/ClientPage';
import ClientInit from '@/components/ClientInit';

export default function Page() {
  const html   = readFileSync(join(process.cwd(), 'html-content',       'scheme-sbi-small-cap.html'), 'utf-8');
  const script = readFileSync(join(process.cwd(), 'public', 'scripts', 'scheme-sbi-small-cap.js'),   'utf-8');
  return (
    <>
      <ClientPage html={html} script={script} />
      <ClientInit />
    </>
  );
}
