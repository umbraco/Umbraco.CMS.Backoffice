import { UMB_MEDIA_MENU_ALIAS } from '../../menu/manifests.js';
import { UMB_MEDIA_RECYCLE_BIN_TREE_ALIAS } from '../tree/index.js';
import type { ManifestMenuItemTreeKind, ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const menuItem: ManifestMenuItemTreeKind = {
	type: 'menuItem',
	kind: 'tree',
	alias: 'Umb.MenuItem.Media.RecycleBin',
	name: 'Media Recycle Bin Menu Item',
	weight: 100,
	meta: {
		treeAlias: UMB_MEDIA_RECYCLE_BIN_TREE_ALIAS,
		label: 'Recycle Bin',
		icon: 'icon-trash',
		menus: [UMB_MEDIA_MENU_ALIAS],
	},
	conditions: [
		{
			alias: 'Umb.Condition.CurrentUser.AllowMediaRecycleBin',
		},
	],
};

export const manifests: Array<ManifestTypes> = [menuItem];
