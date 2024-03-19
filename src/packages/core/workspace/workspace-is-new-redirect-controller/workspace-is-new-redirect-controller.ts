import type { UmbEditableWorkspaceContextBase } from '../workspace-context/index.js';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';
import { createRoutePathBuilder, type UmbRouterSlotElement } from '@umbraco-cms/backoffice/router';
import { ensurePathEndsWithSlash } from '@umbraco-cms/backoffice/utils';

/**
 * Observe the workspace context to see if the entity is new or not.
 * If that changes redirect to the edit url.
 *
 * This requires that the edit URL, is edit/:id
 * @param host
 * @param workspaceContext
 * @param router
 */
export class UmbWorkspaceIsNewRedirectController extends UmbControllerBase {
	constructor(
		host: UmbControllerHost,
		workspaceContext: UmbEditableWorkspaceContextBase<unknown>,
		router: UmbRouterSlotElement,
	) {
		super(host, 'isNewRedirectController');

		// Navigate to edit route when language is created:
		this.observe(workspaceContext.isNew, (isNew) => {
			if (isNew === false) {
				const unique = workspaceContext.getUnique();
				if (router && unique) {
					const routerPath = router.absoluteRouterPath;
					if (routerPath) {
						const newPath: string = createRoutePathBuilder(ensurePathEndsWithSlash(routerPath) + 'edit/:id')({
							id: unique,
						});
						this.destroy();
						window.history.pushState({}, '', newPath);
					}
				}
			}
		});
	}
}
