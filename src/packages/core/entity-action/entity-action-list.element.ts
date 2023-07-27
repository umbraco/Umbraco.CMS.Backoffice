import { html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { map } from '@umbraco-cms/backoffice/external/rxjs';
import { ManifestEntityAction, umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

@customElement('umb-entity-action-list')
export class UmbEntityActionListElement extends UmbLitElement {
	private _entityType = '';
	@property({ type: String, attribute: 'entity-type' })
	public get entityType() {
		return this._entityType;
	}
	public set entityType(value) {
		const oldValue = this._entityType;
		this._entityType = value;
		if (oldValue !== this._entityType) {
			this.#observeEntityActions();
			this.requestUpdate('entityType', oldValue);
		}
	}

	@property({ type: String })
	public unique?: string;

	@state()
	private _entityActions?: Array<ManifestEntityAction>;

	// TODO: find a solution to use extension slot
	#observeEntityActions() {
		this.observe(
			umbExtensionsRegistry.extensionsOfType('entityAction').pipe(
				map((extensions) => {
					return extensions.filter((extension) => extension.conditions.entityTypes.includes(this.entityType));
				})
			),
			(actions) => {
				this._entityActions = actions;
			}
		);
	}

	render() {
		return html`
			${this._entityActions?.map(
				(manifest) => html`<umb-entity-action .unique=${this.unique} .manifest=${manifest}></umb-entity-action>`
			)}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-entity-action-list': UmbEntityActionListElement;
	}
}
