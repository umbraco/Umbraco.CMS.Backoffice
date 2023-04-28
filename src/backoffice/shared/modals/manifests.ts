import type { ManifestModal } from '@umbraco-cms/backoffice/extensions-registry';

const modals: Array<ManifestModal> = [
	{
		type: 'modal',
		alias: 'Umb.Modal.Confirm',
		name: 'Confirm Modal',
		loader: () => import('./confirm/confirm-modal.element'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.Folder',
		name: 'Folder Modal',
		loader: () => import('./folder/folder-modal.element'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.IconPicker',
		name: 'Icon Picker Modal',
		loader: () => import('./icon-picker/icon-picker-modal.element'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.LinkPicker',
		name: 'Link Picker Modal',
		loader: () => import('./link-picker/link-picker-modal.element'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.PropertySettings',
		name: 'Property Settings Modal',
		loader: () => import('./property-settings/property-settings-modal.element'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.SectionPicker',
		name: 'Section Picker Modal',
		loader: () => import('./section-picker/section-picker-modal.element'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.TemplatePicker',
		name: 'Template Picker Modal',
		loader: () => import('./template-picker/template-picker-modal.element'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.Template',
		name: 'Template Modal',
		loader: () => import('./template/template-modal.element'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.EmbeddedMedia',
		name: 'Embedded Media Modal',
		loader: () => import('./embedded-media/embedded-media-modal.element'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.PropertyEditorUIPicker',
		name: 'Property Editor UI Picker Modal',
		loader: () => import('./property-editor-ui-picker/property-editor-ui-picker-modal.element'),
	},
];

export const manifests = [...modals];
