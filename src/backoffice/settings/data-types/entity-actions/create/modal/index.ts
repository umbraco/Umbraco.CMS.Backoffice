import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

// TODO: rename to UmbDataTypeCreateOptionsModal
export interface UmbCreateDataTypeModalData {
	parentKey: string | null;
}

export const UMB_CREATE_DATA_TYPE_MODAL = new UmbModalToken<UmbCreateDataTypeModalData>('Umb.Modal.CreateDataType', {
	type: 'sidebar',
	size: 'small',
});
