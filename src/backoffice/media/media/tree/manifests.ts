import { UmbMediaRepository } from '../repository/media.repository';
import type { ManifestTree } from '@umbraco-cms/backoffice/models';

const treeAlias = 'Umb.Tree.Media';

const tree: ManifestTree = {
	type: 'tree',
	alias: treeAlias,
	name: 'Media Tree',
	meta: {
		repository: UmbMediaRepository, // TODO: use alias instead of class
	},
};

export const manifests = [tree];
