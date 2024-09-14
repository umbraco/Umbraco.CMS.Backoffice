import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [
	{
		type: 'dashboard',
		kind: 'default',
		alias: 'Umb.Dashboard.MemberManagement.Overview',
		name: 'Member Management Overview Dashboard',
		weight: 1000,
		meta: {
			label: 'Overview',
			pathname: 'overview',
		},
		conditions: [
			{
				alias: 'Umb.Condition.SectionAlias',
				match: 'Umb.Section.Members',
			},
		],
	},
];
