import { writeFileSync } from 'fs';
import { createImportMap } from '../importmap/index.js';

const tsPath = './dist-cms/global.d.ts';

const importmap = createImportMap({
	rootDir: './src',
	replaceModuleExtensions: true,
});

const paths = Object.keys(importmap.imports);

const content = `
${paths.map((path) => `import '${path}';`).join('\n')}
`;

writeFileSync(tsPath, content);
