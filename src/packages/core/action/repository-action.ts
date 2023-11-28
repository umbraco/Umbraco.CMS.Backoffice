import { type UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import { UmbBaseController } from '@umbraco-cms/backoffice/class-api';
import { type UmbApi, UmbExtensionApiInitializer } from '@umbraco-cms/backoffice/extension-api';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';

export class UmbActionBase<RepositoryType> extends UmbBaseController implements UmbApi {
	repository?: RepositoryType;

	constructor(host: UmbControllerHostElement, repositoryAlias: string) {
		super(host);

		new UmbExtensionApiInitializer(this, umbExtensionsRegistry, repositoryAlias, [this._host], (permitted, ctrl) => {
			this.repository = permitted ? (ctrl.api as RepositoryType) : undefined;
		});
		/*this.observe(
			umbExtensionsRegistry.getByTypeAndAlias('repository', repositoryAlias),
			async (repositoryManifest) => {
				if (!repositoryManifest) return;

				try {
					const result = await createExtensionApi(repositoryManifest, [this._host]);
					this.repository = result as RepositoryType;
				} catch (error) {
					throw new Error('Could not create repository with alias: ' + repositoryAlias + '');
				}
			}
		);*/
	}
}
