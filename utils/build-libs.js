import * as fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const libs = fs.readdirSync('./libs');
for (let i = 0; i < libs.length; i++) {
	const lib = libs[i];
	const libFolder = './libs/' + lib;
	if (fs.statSync(libFolder).isDirectory()) {
		const libPackage = libFolder + '/rollup.config.js';
		if (!fs.existsSync(libPackage)) {
			continue;
		}

		console.log('Installing ' + lib + '...');
		exec('npx rollup -c rollup.config.js', { cwd: libFolder }, function (error, stdout, stderr) {
			if (error) {
				console.error('Error installing ' + lib + '!');
				console.error(error);
			} else {
				console.log('Installed ' + lib + '.');

				copyDistFromLib(lib, `${libFolder}/dist`);
			}
		});
	}
}

function copyDistFromLib(libName, distPath) {
	console.log(`Copying ${libName} to StaticAssets`);
	const targetFolder = `../Umbraco.Cms.StaticAssets/wwwroot/umbraco/backoffice/libs/${libName}`;

	fs.cp(distPath, targetFolder, { recursive: true }, function (err) {
		if (err) {
			console.error(`Error copying ${libName}`);
			console.error(err);
		} else {
			console.log(`Copied ${libName}`);
		}
	});
}
