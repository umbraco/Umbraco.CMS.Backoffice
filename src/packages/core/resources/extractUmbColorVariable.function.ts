export const umbracoColors = [
	{ alias: 'black', varName: '--uui-palette-black' },
	{ alias: 'blue-grey', varName: '--uui-palette-space-cadet-dimmed' },
	{ alias: 'grey', varName: '--uui-palette-grey' },
	{ alias: 'brown', varName: '--uui-palette-chamoisee' },
	{ alias: 'blue', varName: '--uui-palette-malibu' },
	{ alias: 'light-blue', varName: '--uui-palette-malibu-light' },
	{ alias: 'indigo', varName: '--uui-palette-violet-blue' },
	{ alias: 'purple', varName: '--uui-palette-purple' }, // Missing UUI variable
	{ alias: 'deep-purple', varName: '--uui-palette-space-cadet' }, // Missing UUI variable
	{ alias: 'cyan', varName: '--uui-palette-cyan' }, // Missing UUI variable
	{ alias: 'green', varName: '--uui-palette-forest-green' },
	{ alias: 'light-green', varName: '--uui-palette-jungle-green' },
	{ alias: 'lime', varName: '--uui-palette-jungle-green-light' },
	{ alias: 'yellow', varName: '--uui-palette-sunglow' },
	{ alias: 'amber', varName: '--uui-palette-deep-saffron-light' },
	{ alias: 'orange', varName: '--uui-palette-deep-saffron' },
	{ alias: 'deep-orange', varName: '--uui-palette-deep-saffron-dark' },
	{ alias: 'red', varName: '--uui-palette-maroon-flush' },
	{ alias: 'pink', varName: '--uui-palette-spanish-pink' },

	{ alias: 'text', legacy: true, varName: '--uui-color-text' },
];

export function extractUmbColorVariable(colorAlias: string): string | undefined {
	const found = umbracoColors.find((umbColor) => umbColor.alias === colorAlias);
	return found?.varName;
}
