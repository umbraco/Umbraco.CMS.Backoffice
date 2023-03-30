import { UmbModalToken } from '@umbraco-cms/backoffice/modal';
import { FolderReponseModel } from 'libs/backend-api/src';

export interface UmbFolderModalData {
	repositoryAlias: string;
	unique?: string;
}

export interface UmbFolderModalResult {
	folder: FolderReponseModel;
}

export const UMB_FOLDER_MODAL = new UmbModalToken<UmbFolderModalData, UmbFolderModalResult>('Umb.Modal.Folder', {
	type: 'sidebar',
	size: 'small',
});
