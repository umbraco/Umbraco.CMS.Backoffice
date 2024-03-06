import { UmbMediaItemRepository } from '../../repository/index.js';
import type {
	UmbMediaCreateOptionsModalData,
	UmbMediaCreateOptionsModalValue,
} from './media-create-options-modal.token.js';
import { html, nothing, customElement, state, ifDefined } from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { UmbMediaTypeStructureRepository, type UmbAllowedMediaTypeModel } from '@umbraco-cms/backoffice/media-type';

@customElement('umb-media-create-options-modal')
export class UmbMediaCreateOptionsModalElement extends UmbModalBaseElement<
	UmbMediaCreateOptionsModalData,
	UmbMediaCreateOptionsModalValue
> {
	#mediaTypeStructureRepository = new UmbMediaTypeStructureRepository(this);
	#mediaItemRepository = new UmbMediaItemRepository(this);

	@state()
	private _allowedMediaTypes: UmbAllowedMediaTypeModel[] = [];

	@state()
	private _headline: string = this.localize.term('general_create');

	async firstUpdated() {
		const mediaUnique = this.data?.parent.unique;
		const mediaTypeUnique = this.data?.mediaType?.unique || null;

		this.#retrieveAllowedMediaTypesOf(mediaTypeUnique);

		if (mediaUnique) {
			this.#retrieveHeadline(mediaUnique);
		}
	}

	async #retrieveAllowedMediaTypesOf(unique: string | null) {
		const { data } = await this.#mediaTypeStructureRepository.requestAllowedChildrenOf(unique);

		if (data) {
			// TODO: implement pagination, or get 1000?
			this._allowedMediaTypes = data.items;
		}
	}

	async #retrieveHeadline(unique: string) {
		if (!unique) return;
		const { data } = await this.#mediaItemRepository.requestItems([unique]);
		if (data) {
			// TODO: we need to get the correct variant context here
			this._headline = this.localize.term('create_createUnder') + ' ' + data[0].variants?.[0].name;
		}
	}

	// close the modal when navigating to data type
	#onNavigate() {
		this._submitModal();
	}

	render() {
		return html`
			<umb-body-layout headline=${this._headline ?? ''}>
				<uui-box>
					${this._allowedMediaTypes.length === 0
						? html`<umb-localize key="create_noMediaTypes"></umb-localize>`
						: nothing}
					${this._allowedMediaTypes.map(
						(mediaType) => html`
							<uui-menu-item
								data-id=${ifDefined(mediaType.unique)}
								href="${`section/media/workspace/media/create/parent/${this.data?.parent.entityType}/${
									this.data?.parent.unique ?? 'null'
								}/${mediaType.unique}`}"
								label="${mediaType.name}"
								@click=${this.#onNavigate}>
								> ${mediaType.icon ? html`<umb-icon slot="icon" name=${mediaType.icon}></umb-icon>` : nothing}
							</uui-menu-item>
						`,
					)}
				</uui-box>
				<uui-button
					slot="actions"
					id="cancel"
					label=${this.localize.term('general_cancel')}
					@click="${this._rejectModal}"></uui-button>
			</umb-body-layout>
		`;
	}
}

export default UmbMediaCreateOptionsModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-media-create-options-modal': UmbMediaCreateOptionsModalElement;
	}
}
