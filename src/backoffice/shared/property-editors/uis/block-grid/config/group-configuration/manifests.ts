import type { ManifestPropertyEditorUI } from '@umbraco-cms/backoffice/models';

export const manifest: ManifestPropertyEditorUI = {
	type: 'propertyEditorUI',
	alias: 'Umb.PropertyEditorUI.BlockGrid.GroupConfiguration',
	name: 'Block Grid Group Configuration Property Editor UI',
	loader: () => import('./property-editor-ui-block-grid-group-configuration.element'),
	meta: {
		label: 'Block Grid Group Configuration',
		propertyEditorModel: 'Umbraco.BlockGrid.GroupConfiguration',
		icon: 'umb:autofill',
		group: 'blocks',
	},
};
