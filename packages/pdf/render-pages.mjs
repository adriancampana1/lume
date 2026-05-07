import { pdf } from 'pdf-to-img';
import { writeFileSync } from 'node:fs';

const doc = await pdf('./preview.pdf', { scale: 2 });
let i = 1;
for await (const img of doc) {
  const name = `fresh-page-${String(i).padStart(2,'0')}.png`;
  writeFileSync(name, img);
  console.log('wrote', name);
  i++;
}
