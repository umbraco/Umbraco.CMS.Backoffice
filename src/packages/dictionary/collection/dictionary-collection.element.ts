import { css, customElement, html } from '@umbraco-cms/backoffice/external/lit';
import { UmbCollectionDefaultElement, UMB_COLLECTION_CONTEXT } from '@umbraco-cms/backoffice/collection';
import type { UmbDefaultCollectionContext } from '@umbraco-cms/backoffice/collection';

const elementName = 'umb-dictionary-collection';

@customElement(elementName)
export class UmbDictionaryCollectionElement extends UmbCollectionDefaultElement {
	#collectionContext?: UmbDefaultCollectionContext;

	#inputTimer?: NodeJS.Timeout;
	#inputTimerAmount = 500;

	constructor() {
		super();

		this.consumeContext(UMB_COLLECTION_CONTEXT, (context) => {
			this.#collectionContext = context;
		});
	}

	#onInput(event: InputEvent & { target: HTMLInputElement }) {
		const filter = event.target.value ?? '';
		clearTimeout(this.#inputTimer);
		this.#inputTimer = setTimeout(() => this.#collectionContext?.setFilter({ filter }), this.#inputTimerAmount);
	}

	protected override renderToolbar() {
		return html`
			<umb-collection-toolbar slot="header">
				<uui-input
					id="input-search"
					label=${this.localize.term('general_search')}
					placeholder=${this.localize.term('placeholders_search')}
					@input=${this.#onInput}></uui-input>
			</umb-collection-toolbar>
		`;
	}

	static override readonly styles = [
		css`
			#input-search {
				display: block;
			}
		`,
	];
}

export { UmbDictionaryCollectionElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbDictionaryCollectionElement;
	}
}
