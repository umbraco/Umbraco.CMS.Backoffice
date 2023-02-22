import { UmbWorkspaceAction } from '../components/workspace/workspace-action';
import { UmbWorkspaceContextInterface } from '../components/workspace/workspace-context/workspace-context.interface';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';

// TODO: add interface for repo/partial repo/save-repo
export class UmbSaveWorkspaceAction extends UmbWorkspaceAction<any, UmbWorkspaceContextInterface> {
	constructor(host: UmbControllerHostInterface, repositoryAlias: string) {
		super(host, repositoryAlias);
	}

	async execute() {
		if (!this.workspaceContext) return;
		// TODO: it doesn't get the updated value
		const data = this.workspaceContext.getData();
		// TODO: handle errors
		if (!data) return;

		this.workspaceContext.getIsNew() ? this.#create(data) : this.#update(data);
	}

	async #create(data: any) {
		if (!this.workspaceContext) return;

		const { error } = await this.repository.create(data);

		// TODO: this is temp solution to bubble validation errors to the UI
		if (error) {
			if (error.type === 'validation') {
				this.workspaceContext.setValidationErrors?.(error.errors);
			}
		}

		if (!error) {
			this.workspaceContext.setIsNew(false);
		}
	}

	#update(data: any) {
		this.repository?.save(data);
	}
}
