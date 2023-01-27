import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { importMapsPlugin } from '@web/dev-server-import-maps';

export default {
	nodeResolve: true,
	files: ['src/**/*.test.ts', 'apps/**/*.test.ts', 'libs/**/*.test.ts'],
	plugins: [
		esbuildPlugin({ ts: true, target: 'auto', json: true }),
		importMapsPlugin({
			inject: {
				importMap: {
					imports: {
						'src/': './src/',
						'@umbraco-cms/css': './libs/css/custom-properties.css',
						'@umbraco-cms/models': './libs/models/index.ts',
						'@umbraco-cms/backend-api': './libs/backend-api/index.ts',
						'@umbraco-cms/context-api': './libs/context-api/index.ts',
						'@umbraco-cms/controller': './libs/controller/index.ts',
						'@umbraco-cms/element': './libs/element/index.ts',
						'@umbraco-cms/extensions-api': './libs/extensions-api/index.ts',
						'@umbraco-cms/extensions-registry': './libs/extensions-registry/index.ts',
						'@umbraco-cms/notification': './libs/notification/index.ts',
						'@umbraco-cms/observable-api': './libs/observable-api/index.ts',
						'@umbraco-cms/store': './libs/store/index.ts',
						'@umbraco-cms/utils': './libs/utils/index.ts',
						'@umbraco-cms/test-utils': './libs/test-utils/index.ts',
						'@umbraco-cms/resources': './libs/resources/index.ts'
					},
				},
			},
		}),
	],
	browsers: [
		playwrightLauncher({ product: 'chromium' }),
		playwrightLauncher({ product: 'firefox' }),
		playwrightLauncher({ product: 'webkit' }),
	],
	coverageConfig: {
		reporters: ['lcovonly', 'text-summary'],
	},
	testRunnerHtml: (testFramework) =>
		`<html>
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" type="image/svg+xml" href="public/favicon.svg" />
				<title>Umbraco</title>
				<base href="/" />
				<link rel="stylesheet" href="node_modules/@umbraco-ui/uui-css/dist/uui-css.css">
				<link rel="stylesheet" href="libs/css/custom-properties.css">
			</head>
      <body>
        <script type="module" src="${testFramework}"></script>
        <script type="module">
					import 'element-internals-polyfill';
					import '@umbraco-ui/uui';
					import 'router-slot';
        </script>
      </body>
    </html>`,
};
