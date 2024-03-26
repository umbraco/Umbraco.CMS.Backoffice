import type { ManifestModal } from '@umbraco-cms/backoffice/extension-registry';

const modals: Array<ManifestModal> = [
	{
		type: 'modal',
		alias: 'Umb.Modal.Confirm',
		name: 'Confirm Modal',
		js: () => import('./confirm/confirm-modal.element.js'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.IconPicker',
		name: 'Icon Picker Modal',
		js: () => import('./icon-picker/icon-picker-modal.element.js'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.LinkPicker',
		name: 'Link Picker Modal',
		js: () => import('./link-picker/link-picker-modal.element.js'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.CodeEditor',
		name: 'Code Editor Modal',
		js: () => import('./code-editor/code-editor-modal.element.js'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.EmbeddedMedia',
		name: 'Embedded Media Modal',
		js: () => import('./embedded-media/embedded-media-modal.element.js'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.ItemPicker',
		name: 'Item Picker Modal',
		element: () => import('./item-picker/item-picker-modal.element.js'),
	},
];

export const manifests = [...modals];
