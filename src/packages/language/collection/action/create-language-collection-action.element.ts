import { UMB_CREATE_LANGUAGE_WORKSPACE_PATH_PATTERN } from '../../paths.js';
import { UMB_LANGUAGE_ENTITY_TYPE, UMB_LANGUAGE_ROOT_ENTITY_TYPE } from '../../entity.js';
import { customElement, html, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UMB_WORKSPACE_MODAL } from '@umbraco-cms/backoffice/modal';
import { UmbModalRouteRegistrationController } from '@umbraco-cms/backoffice/router';
import type { ManifestCollectionAction } from '@umbraco-cms/backoffice/extension-registry';
import { UMB_COLLECTION_CONTEXT } from '@umbraco-cms/backoffice/collection';

const elementName = 'umb-create-language-collection-action';
@customElement(elementName)
export class UmbCreateLanguageCollectionActionElement extends UmbLitElement {
	@property({ attribute: false })
	manifest?: ManifestCollectionAction;

	@state()
	private _createPath = '';

	@state()
	private _currentView?: string;

	@state()
	private _rootPathName?: string;

	constructor() {
		super();

		new UmbModalRouteRegistrationController(this, UMB_WORKSPACE_MODAL)
			.addAdditionalPath(UMB_LANGUAGE_ENTITY_TYPE)
			.onSetup(() => {
				return { data: { entityType: UMB_LANGUAGE_ENTITY_TYPE, preset: {} } };
			})
			.observeRouteBuilder((routeBuilder) => {
				this._createPath = routeBuilder({});
			});

		this.consumeContext(UMB_COLLECTION_CONTEXT, (collectionContext) => {
			this.observe(collectionContext.view.currentView, (currentView) => {
				this._currentView = currentView?.meta.pathName;
			});

			this.observe(collectionContext.view.rootPathName, (rootPathName) => {
				this._rootPathName = rootPathName;
			});
		});
	}

	#getCreateUrl() {
		return (
			this._createPath.replace(`${this._rootPathName}`, `${this._rootPathName}/${this._currentView}`) +
			UMB_CREATE_LANGUAGE_WORKSPACE_PATH_PATTERN.generateLocal({
				parentEntityType: UMB_LANGUAGE_ROOT_ENTITY_TYPE,
				parentUnique: null,
			})
		);
	}

	override render() {
		return html`<uui-button
			color="default"
			href=${this.#getCreateUrl()}
			label=${this.localize.term('general_create')}
			look="outline"></uui-button>`;
	}
}

export { UmbCreateLanguageCollectionActionElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbCreateLanguageCollectionActionElement;
	}
}
