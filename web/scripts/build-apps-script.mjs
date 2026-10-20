// Bundles src/vitals/logic.ts into backend/apps-script/Logic.gs as one global, CyvoVitals,
// so the backend scores answers with exactly the same code as the page. Run after changing logic.ts.
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, '../backend/apps-script/Logic.gs');
await build({ entryPoints: [resolve(root, 'src/vitals/logic.ts')], bundle: true, format: 'iife', globalName: 'CyvoVitals', target: 'es2019', outfile: out, logLevel: 'warning' });
const code = readFileSync(out, 'utf8');
writeFileSync(out, '// GENERATED from web/src/vitals/logic.ts by `npm run build:backend`. Do not edit here.\n' + code);
console.log('wrote backend/apps-script/Logic.gs');
