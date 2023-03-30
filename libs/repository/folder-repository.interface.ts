import type {
	CreateFolderRequestModel,
	FolderReponseModel,
	ProblemDetailsModel,
} from '@umbraco-cms/backoffice/backend-api';

export interface UmbFolderRepository<
	RequestType extends CreateFolderRequestModel,
	ResponseType extends FolderReponseModel
> {
	createFolder(folderRequest: RequestType): Promise<{
		data?: string;
		error?: ProblemDetailsModel;
	}>;

	requestFolder?(unique: string): Promise<{
		data?: ResponseType;
		error?: ProblemDetailsModel;
	}>;

	deleteFolder?(key: string): Promise<{
		error?: ProblemDetailsModel;
	}>;
}
