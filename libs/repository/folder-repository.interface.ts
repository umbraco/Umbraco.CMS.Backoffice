import type {
	CreateFolderRequestModel,
	FolderReponseModel,
	ProblemDetailsModel,
	UpdateFolderReponseModel,
} from '@umbraco-cms/backoffice/backend-api';

export interface UmbFolderRepository {
	createFolder(folderRequest: CreateFolderRequestModel): Promise<{
		data?: string;
		error?: ProblemDetailsModel;
	}>;

	requestFolder?(unique: string): Promise<{
		data?: FolderReponseModel;
		error?: ProblemDetailsModel;
	}>;

	updateFolder(unique: string): Promise<{
		data?: UpdateFolderReponseModel;
		error?: ProblemDetailsModel;
	}>;

	deleteFolder(key: string): Promise<{
		error?: ProblemDetailsModel;
	}>;
}
