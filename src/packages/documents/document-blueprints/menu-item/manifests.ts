import type { ManifestMenuItem } from '@umbraco-cms/backoffice/extension-registry';

const menuItem: ManifestMenuItem = {
	type: 'menuItem',
	alias: 'Umb.MenuItem.DocumentBlueprints',
	name: 'Document Blueprints Menu Item',
	weight: 100,
	meta: {
		label: 'Document Blueprints',
		icon: 'icon-blueprint',
		entityType: 'document-blueprint-root',
		menus: ['Umb.Menu.Settings'],
	},
};

export const manifests = [menuItem];
