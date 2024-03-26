import type { ManifestSection, ManifestSectionView } from '@umbraco-cms/backoffice/extension-registry';

const sectionAlias = 'Umb.Section.Packages';

const section: ManifestSection = {
	type: 'section',
	alias: sectionAlias,
	name: 'Packages Section',
	weight: 200,
	meta: {
		label: 'Packages',
		pathname: 'packages',
	},
	conditions: [
		{
			alias: 'Umb.Condition.SectionUserPermission',
			match: sectionAlias,
		},
	],
};

const sectionsViews: Array<ManifestSectionView> = [
	{
		type: 'sectionView',
		alias: 'Umb.SectionView.Packages.Repo',
		name: 'Packages Repo Section View',
		js: () => import('./views/market-place/packages-market-place-section-view.element.js'),
		weight: 300,
		meta: {
			label: 'Packages',
			pathname: 'packages',
			icon: 'icon-cloud',
		},
		conditions: [
			{
				alias: 'Umb.Condition.SectionAlias',
				match: sectionAlias,
			},
		],
	},
	{
		type: 'sectionView',
		alias: 'Umb.SectionView.Packages.Installed',
		name: 'Installed Packages Section View',
		js: () => import('./views/installed/installed-packages-section-view.element.js'),
		weight: 200,
		meta: {
			label: 'Installed',
			pathname: 'installed',
			icon: 'icon-box',
		},
		conditions: [
			{
				alias: 'Umb.Condition.SectionAlias',
				match: sectionAlias,
			},
		],
	},
	/* // Temp removed until is is finished
	{
		type: 'sectionView',
		alias: 'Umb.SectionView.Packages.Builder',
		name: 'Packages Builder Section View',
		js: () => import('./views/created/created-packages-section-view.element.js'),
		weight: 100,
		meta: {
			label: 'Created',
			pathname: 'created',
			icon: 'icon-files',
		},
		conditions: [
			{
				alias: 'Umb.Condition.SectionAlias',
				match: sectionAlias,
			},
		],
	},
	*/
];

export const manifests = [section, ...sectionsViews];
