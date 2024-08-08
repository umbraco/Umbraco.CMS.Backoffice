import { createExtensionElement, UmbExtensionsManifestInitializer } from '@umbraco-cms/backoffice/extension-api';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { ManifestWorkspaceView } from '@umbraco-cms/backoffice/extension-registry';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbRoute } from '@umbraco-cms/backoffice/router';

export type UmbWorkspaceEditorView = {
	alias: string;
	label: string;
	icon: string;
	pathName: string;
};

export class UmbWorkspaceEditorContext extends UmbContextBase<UmbWorkspaceEditorContext> {
	#routes = new UmbArrayState<UmbRoute>([], (x) => x.path);
	public readonly routes = this.#routes.asObservable();

	#views = new UmbArrayState<UmbWorkspaceEditorView>([], (x) => x.alias);
	public readonly views = this.#views.asObservable();

	constructor(host: UmbControllerHost) {
		super(host, UMB_WORKSPACE_EDITOR_CONTEXT);

		new UmbExtensionsManifestInitializer(this, umbExtensionsRegistry, 'workspaceView', null, (workspaceViews) => {
			const manifests = workspaceViews.map((view) => view.manifest);
			this.#createRoutes(manifests);
			this.#createViews(manifests);
		});
	}

	#createRoutes(manifests: Array<ManifestWorkspaceView> | null) {
		let routes: UmbRoute[] = [];

		if (manifests?.length) {
			routes = manifests.map((manifest) => {
				return {
					path: `view/${manifest.meta.pathname}`,
					component: () => createExtensionElement(manifest),
					setup: (component) => {
						if (component) {
							(component as any).manifest = manifest;
						}
					},
				} as UmbRoute;
			});

			// Duplicate first workspace and use it for the empty path scenario. [NL]
			routes.push({ ...routes[0], path: '' });

			routes.push({
				path: `**`,
				component: async () => (await import('@umbraco-cms/backoffice/router')).UmbRouteNotFoundElement,
			});
		}

		this.#routes.setValue(routes);
	}

	#createViews(manifests: Array<ManifestWorkspaceView> | null) {
		if (!manifests?.length) return;

		const views = manifests
			? manifests.map((manifest) => ({
					alias: manifest.alias,
					icon: manifest.meta.icon,
					label: manifest.meta.label ?? manifest.name,
					pathName: manifest.meta.pathname,
				}))
			: [];

		this.#views.setValue(views);
	}

	setWorkspaceViewMeta(alias: string, icon: string | undefined, label: string | undefined, showContentFirst: boolean) {
		if (!alias) return;

		// NOTE: Edge-case, as the server sets "icon-badge" as the default icon, but that particular icon doesn't exist in the backoffice. [LK]
		// https://github.com/umbraco/Umbraco-CMS/blob/release-14.0.0/src/Umbraco.Infrastructure/Migrations/Upgrade/V_14_0_0/MigrateDataTypeConfigurations.cs#L718
		if (icon === 'icon-badge color-black') {
			icon = 'icon-grid';
		}

		const views = [...this.#views.getValue()].map((view) =>
			view.alias === alias ? { ...view, ...(icon && { icon }), ...(label && { label }) } : view,
		);

		this.#views.setValue(views);

		// TODO: Review how `showContentFirst` is implemented, and how to re-route/redirect the path.
		// e.g. the "Content" tab shows the "Collection" view. [LK]
		if (showContentFirst) {
			// const views = [...this.#views.getValue()];
			// const idx = views.findIndex((view) => view === 'Umb.WorkspaceView.Document.Edit');
			// if (idx > -1) {
			// 	const [edit] = views.splice(idx, 1);
			// 	views.unshift(edit);
			// 	this.#views.setValue(views);
			// }
		}
	}
}

export default UmbWorkspaceEditorContext;

export const UMB_WORKSPACE_EDITOR_CONTEXT = new UmbContextToken<UmbWorkspaceEditorContext>('UmbWorkspaceEditorContext');
