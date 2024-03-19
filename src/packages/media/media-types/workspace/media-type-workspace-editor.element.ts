import type { UmbMediaTypeWorkspaceContext } from './media-type-workspace.context.js';
import type { UUIInputElement } from '@umbraco-cms/backoffice/external/uui';
import { UUIInputEvent } from '@umbraco-cms/backoffice/external/uui';
import { css, html, customElement, state, ifDefined } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UMB_ICON_PICKER_MODAL, UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { UMB_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import { generateAlias } from '@umbraco-cms/backoffice/utils';

@customElement('umb-media-type-workspace-editor')
export class UmbMediaTypeWorkspaceEditorElement extends UmbLitElement {
	@state()
	private _name?: string;

	@state()
	private _alias?: string;

	@state()
	private _aliasLocked = true;

	@state()
	private _icon?: string;

	#workspaceContext?: UmbMediaTypeWorkspaceContext;

	constructor() {
		super();

		this.consumeContext(UMB_WORKSPACE_CONTEXT, (instance) => {
			this.#workspaceContext = instance as UmbMediaTypeWorkspaceContext;
			this.#observeMediaType();
		});
	}

	#observeMediaType() {
		if (!this.#workspaceContext) return;
		this.observe(this.#workspaceContext.name, (name) => (this._name = name), '_observeName');
		this.observe(this.#workspaceContext.alias, (alias) => (this._alias = alias), '_observeAlias');
		this.observe(this.#workspaceContext.icon, (icon) => (this._icon = icon), '_observeIcon');

		this.observe(
			this.#workspaceContext.isNew,
			(isNew) => {
				if (isNew) {
					// TODO: Would be good with a more general way to bring focus to the name input.
					(this.shadowRoot?.querySelector('#name') as HTMLElement)?.focus();
				}
				this.removeControllerByAlias('isNewRedirectController');
			},
			'_observeIsNew',
		);
	}

	// TODO: find a way where we don't have to do this for all workspaces.
	#onNameChange(event: UUIInputEvent) {
		if (event instanceof UUIInputEvent) {
			const target = event.composedPath()[0] as UUIInputElement;

			if (typeof target?.value === 'string') {
				const oldName = this._name;
				const oldAlias = this._alias;
				const newName = event.target.value.toString();
				if (this._aliasLocked) {
					const expectedOldAlias = generateAlias(oldName ?? '');
					// Only update the alias if the alias matches a generated alias of the old name (otherwise the alias is considered one written by the user.)
					if (expectedOldAlias === oldAlias) {
						this.#workspaceContext?.setAlias(generateAlias(newName));
					}
				}
				this.#workspaceContext?.setName(target.value);
			}
		}
	}

	// TODO: find a way where we don't have to do this for all workspaces.
	#onAliasChange(event: UUIInputEvent) {
		if (event instanceof UUIInputEvent) {
			const target = event.composedPath()[0] as UUIInputElement;

			if (typeof target?.value === 'string') {
				this.#workspaceContext?.setAlias(target.value);
			}
		}
		event.stopPropagation();
	}

	#onToggleAliasLock() {
		this._aliasLocked = !this._aliasLocked;
	}

	private async _handleIconClick() {
		const [alias, color] = this._icon?.replace('color-', '')?.split(' ') ?? [];

		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		const modalContext = modalManager.open(this, UMB_ICON_PICKER_MODAL, {
			value: {
				icon: alias,
				color: color,
			},
		});

		modalContext?.onSubmit().then((saved) => {
			if (saved.icon && saved.color) {
				this.#workspaceContext?.setIcon(`${saved.icon} color-${saved.color}`);
			} else if (saved.icon) {
				this.#workspaceContext?.setIcon(saved.icon);
			}
		});
	}

	render() {
		return html`<umb-workspace-editor alias="Umb.Workspace.MediaType">
			<div id="header" slot="header">
				<uui-button id="icon" @click=${this._handleIconClick} label="icon" compact>
					<umb-icon name=${ifDefined(this._icon)}></umb-icon>
				</uui-button>

				<uui-input id="name" .value=${this._name} @input="${this.#onNameChange}" label="name">
					<!-- TODO: should use UUI-LOCK-INPUT, but that does not fire an event when its locked/unlocked -->
					<uui-input
						name="alias"
						slot="append"
						label="alias"
						@input=${this.#onAliasChange}
						.value=${this._alias}
						placeholder="Enter alias..."
						?disabled=${this._aliasLocked}>
						<!-- TODO: validation for bad characters -->
						<div @click=${this.#onToggleAliasLock} @keydown=${() => ''} id="alias-lock" slot="prepend">
							<uui-icon name=${this._aliasLocked ? 'icon-lock' : 'icon-unlocked'}></uui-icon>
						</div>
					</uui-input>
				</uui-input>
			</div>

			<div slot="footer-info">
				<!-- TODO: Shortcuts Modal? -->
				<uui-button label="Show keyboard shortcuts">
					Keyboard Shortcuts
					<uui-keyboard-shortcut>
						<uui-key>ALT</uui-key>
						+
						<uui-key>shift</uui-key>
						+
						<uui-key>k</uui-key>
					</uui-keyboard-shortcut>
				</uui-button>
			</div>
		</umb-workspace-editor>`;
	}

	static styles = [
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}

			#header {
				display: flex;
				flex: 1 1 auto;
			}

			#name {
				width: 100%;
				flex: 1 1 auto;
				align-items: center;
			}

			#alias-lock {
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
			}
			#alias-lock uui-icon {
				margin-bottom: 2px;
			}

			#icon {
				font-size: calc(var(--uui-size-layout-3) / 2);
				margin-right: var(--uui-size-space-2);
				margin-left: calc(var(--uui-size-space-4) * -1);
			}
		`,
	];
}

export default UmbMediaTypeWorkspaceEditorElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-media-type-workspace-editor': UmbMediaTypeWorkspaceEditorElement;
	}
}
