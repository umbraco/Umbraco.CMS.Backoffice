import type { ManifestBase, ManifestWithConditions } from './models';

export interface ManifestWorkspaceViewCollection
	extends ManifestBase,
		ManifestWithConditions<ConditionsEditorViewCollection> {
	type: 'workspaceViewCollection';
	meta: MetaEditorViewCollection;
}
export interface MetaEditorViewCollection {
	pathname: string;
	label: string;
	icon: string;
	entityType: string;
	repositoryAlias: string;
}

export interface ConditionsEditorViewCollection {
	workspaces: string[];
}
