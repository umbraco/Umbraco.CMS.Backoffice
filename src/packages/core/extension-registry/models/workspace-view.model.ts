import type { ConditionTypes } from '../conditions/types.js';
import type { UmbWorkspaceViewElement } from '../interfaces/workspace-view-element.interface.js';
import type {
	ManifestWithDynamicConditions,
	ManifestWithView,
	MetaManifestWithView,
} from '@umbraco-cms/backoffice/extension-api';

export interface ManifestWorkspaceView<MetaType extends MetaWorkspaceView = MetaWorkspaceView>
	extends ManifestWithView<UmbWorkspaceViewElement>,
		ManifestWithDynamicConditions<ConditionTypes> {
	type: 'workspaceView';
	meta: MetaType;
}

export interface MetaWorkspaceView extends MetaManifestWithView {}

export interface ManifestWorkspaceViewContentTypeDesignEditorKind extends ManifestWorkspaceView {
	type: 'workspaceView';
	kind: 'contentTypeDesignEditor';
	meta: MetaWorkspaceViewContentTypeDesignEditorKind;
}

export interface MetaWorkspaceViewContentTypeDesignEditorKind extends MetaWorkspaceView {
	compositionRepositoryAlias?: string;
}
