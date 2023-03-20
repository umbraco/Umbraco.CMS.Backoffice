import type { ManifestPropertyEditorUI } from '@umbraco-cms/backoffice/models';

export const manifest: ManifestPropertyEditorUI = {
	type: 'propertyEditorUI',
	alias: 'Umb.PropertyEditorUI.BlockGrid.BlockConfiguration',
	name: 'Block Grid Block Configuration Property Editor UI',
	loader: () => import('./property-editor-ui-block-grid-block-configuration.element'),
	meta: {
		label: 'Block Grid Block Configuration',
		propertyEditorModel: 'Umbraco.BlockGrid.BlockConfiguration',
		icon: 'umb:autofill',
		group: 'blocks',
	},
};
