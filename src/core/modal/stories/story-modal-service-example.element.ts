import { html } from 'lit-html';
import { customElement, property, state } from 'lit/decorators.js';
import { UmbModalContext, UMB_MODAL_CONTEXT_TOKEN } from '..';
import { UmbLitElement } from '@umbraco-cms/element';

@customElement('story-modal-service-example')
export class StoryModalServiceExampleElement extends UmbLitElement {
	@property()
	modalLayout = 'confirm';

	@state()
	value = '';

	private _modalService?: UmbModalContext;

	constructor() {
		super();
		this.consumeContext(UMB_MODAL_CONTEXT_TOKEN, (modalService) => {
			this._modalService = modalService;
		});
	}

	private _open() {
		switch (this.modalLayout) {
			case 'Content Picker':
				this._modalService?.contentPicker();
				break;
			case 'Property Editor UI Picker':
				this._modalService?.propertyEditorUIPicker();
				break;
			case 'Icon Picker':
				this._modalService?.iconPicker();
				break;
			default:
				this._modalService?.confirm({
					headline: 'Headline',
					content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
				});
				break;
		}
	}

	render() {
		return html`
			<uui-button label="open-dialog" look="primary" @click=${() => this._open()} style="margin-right: 9px;"
				>Open modal</uui-button
			>
		`;
	}
}
