import type { UmbWorkspaceEditorViewExtensionElement } from '../interfaces/workspace-editor-view-extension-element.interface';
import type { ManifestWithView } from '.';

export interface ManifestWorkspaceEditorView extends ManifestWithView<UmbWorkspaceEditorViewExtensionElement> {
	type: 'workspaceEditorView';
	conditions: ConditionsWorkspaceView;
}

export interface ConditionsWorkspaceView {
	workspaces: string[];
}
