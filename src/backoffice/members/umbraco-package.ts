export const name = 'Umbraco.Core.MemberManagement';
export const version = '0.0.1';
export const extensions = [
	{
		name: 'Member Management Entry Point',
		alias: 'Umb.EntryPoint.MemberManagement',
		type: 'entryPoint',
		loader: () => import('./index'),
	},
];
