import type { UmbWorkspaceElement } from '../workspace/workspace.element.js';
import type { UmbSectionMainViewElement } from './section-main-views/section-main-views.element.js';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, nothing, customElement, property, state, repeat } from '@umbraco-cms/backoffice/external/lit';
import type {
	ManifestSection,
	ManifestSectionSidebarApp,
	ManifestSectionSidebarAppMenuKind,
	UmbSectionElement,
} from '@umbraco-cms/backoffice/extension-registry';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import type { UmbRoute } from '@umbraco-cms/backoffice/router';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbExtensionElementInitializer } from '@umbraco-cms/backoffice/extension-api';
import { UmbExtensionsElementInitializer } from '@umbraco-cms/backoffice/extension-api';

/**
 * @export
 * @class UmbBaseSectionElement
 * @description - Element hosting sections and section navigation.
 */
@customElement('umb-section-default')
export class UmbSectionDefaultElement extends UmbLitElement implements UmbSectionElement {
	private _manifest?: ManifestSection | undefined;

	@property({ type: Object, attribute: false })
	public get manifest(): ManifestSection | undefined {
		return this._manifest;
	}
	public set manifest(value: ManifestSection | undefined) {
		const oldValue = this._manifest;
		if (oldValue === value) return;
		this._manifest = value;

		this.requestUpdate('manifest', oldValue);
	}

	@state()
	private _routes?: Array<UmbRoute>;

	@state()
	private _sidebarApps?: Array<
		UmbExtensionElementInitializer<ManifestSectionSidebarApp | ManifestSectionSidebarAppMenuKind>
	>;

	constructor() {
		super();

		new UmbExtensionsElementInitializer(this, umbExtensionsRegistry, 'sectionSidebarApp', null, (sidebarApps) => {
			const oldValue = this._sidebarApps;
			this._sidebarApps = sidebarApps;
			this.requestUpdate('_sidebarApps', oldValue);
		});

		this.#createRoutes();
	}

	#createRoutes() {
		this._routes = [
			{
				path: 'workspace/:entityType',
				component: () => import('../workspace/workspace.element.js'),
				setup: (element, info) => {
					(element as UmbWorkspaceElement).entityType = info.match.params.entityType;
				},
			},
			{
				path: '**',
				component: () => import('./section-main-views/section-main-views.element.js'),
				setup: (element) => {
					(element as UmbSectionMainViewElement).sectionAlias = this.manifest?.alias;
				},
			},
		];
	}

	render() {
		return html`
			${this._sidebarApps && this._sidebarApps.length > 0
				? html`
						<!-- TODO: these extensions should be combined into one type: sectionSidebarApp with a "subtype" -->
						<umb-section-sidebar>
							${repeat(
								this._sidebarApps,
								(app) => app.alias,
								(app) => app.component,
							)}
						</umb-section-sidebar>
					`
				: nothing}
			<umb-section-main>
				${this._routes && this._routes.length > 0
					? html`<umb-router-slot id="router-slot" .routes="${this._routes}"></umb-router-slot>`
					: nothing}
				<slot></slot>
			</umb-section-main>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				flex: 1 1 auto;
				height: 100%;
				display: flex;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-section-default': UmbSectionDefaultElement;
	}
}
