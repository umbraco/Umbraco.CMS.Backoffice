import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

// import the element because it is referenced by elementName in the manifest
import './collection-menu-item.element.js';

const menuItemCollectionKindManifest: UmbBackofficeManifestKind = {
	type: 'kind',
	alias: 'Umb.Kind.MenuItem.Collection',
	matchKind: 'collection',
	matchType: 'menuItem',
	manifest: {
		type: 'menuItem',
		elementName: 'umb-collection-menu-item',
	},
};

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [menuItemCollectionKindManifest];
