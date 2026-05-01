import { readFileSync } from 'fs';
import { join } from 'path';
import ClientPage from '@/components/ClientPage';
import ClientInit from '@/components/ClientInit';

export default function Page() {
  const html   = readFileSync(join(process.cwd(), 'html-content',       'category-sifs.html'), 'utf-8');
  const script = readFileSync(join(process.cwd(), 'public', 'scripts', 'category-sifs.js'),   'utf-8');
  return (
    <>
      <ClientPage html={html} script={script} />
      <ClientInit />
    </>
  );
}
