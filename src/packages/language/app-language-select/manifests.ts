export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'sectionSidebarApp',
		alias: 'Umb.SectionSidebarItem.LanguageSelect',
		name: 'App Language Select Section Sidebar Item',
		js: () => import('./app-language-select.element.js'),
		weight: 900,
		conditions: [
			{
				alias: 'Umb.Condition.SectionAlias',
				match: 'Umb.Section.Content',
			},
			{
				alias: 'Umb.Condition.MultipleAppLanguages',
			},
		],
	},
];
