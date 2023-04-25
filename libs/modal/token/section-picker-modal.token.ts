import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export interface UmbSectionPickerModalData {
	multiple: boolean;
	selection: string[];
}

export const UMB_SECTION_PICKER_MODAL = new UmbModalToken<UmbSectionPickerModalData, never>('Umb.Modal.SectionPicker', {
	type: 'sidebar',
	size: 'small',
});
