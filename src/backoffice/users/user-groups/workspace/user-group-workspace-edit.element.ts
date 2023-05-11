import { UUIInputElement, UUIInputEvent } from '@umbraco-ui/uui';
import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbUserGroupWorkspaceContext } from './user-group-workspace.context';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

import '../../../shared/components/input-section/input-section.element';
import { UMB_ENTITY_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/context-api';
import { UserGroupResponseModel } from '@umbraco-cms/backoffice/backend-api';
import { UMB_CONFIRM_MODAL, UMB_MODAL_CONTEXT_TOKEN, UmbModalContext } from '@umbraco-cms/backoffice/modal';

@customElement('umb-user-group-workspace-edit')
export class UmbUserGroupWorkspaceEditElement extends UmbLitElement {
	@state()
	private _userGroup?: UserGroupResponseModel;

	@state()
	private _userKeys?: Array<string>;

	#workspaceContext?: UmbUserGroupWorkspaceContext;
	#modalContext?: UmbModalContext;

	constructor() {
		super();

		this.consumeContext(UMB_ENTITY_WORKSPACE_CONTEXT, (instance) => {
			this.#workspaceContext = instance as UmbUserGroupWorkspaceContext;
			this.observe(this.#workspaceContext.data, (userGroup) => (this._userGroup = userGroup as any));
		});

		this.consumeContext(UMB_MODAL_CONTEXT_TOKEN, (instance) => {
			this.#modalContext = instance;
		});
	}

	#onUsersChange(userKeys: Array<string>) {
		this._userKeys = userKeys;
		// TODO: make a method on the UmbWorkspaceUserGroupContext:
		//this._workspaceContext.setUsers();
	}

	#onSectionsChange(value: string[]) {
		console.log('va', value);

		this.#workspaceContext?.updateProperty('sections', value);
	}

	async #onDelete() {
		if (!this.#modalContext || !this.#workspaceContext) return;

		const modalHandler = this.#modalContext.open(UMB_CONFIRM_MODAL, {
			color: 'danger',
			headline: `Delete user group ${this._userGroup?.name}?`,
			content: html`Are you sure you want to delete <b>${this._userGroup?.name}</b> user group?`,
			confirmLabel: 'Delete',
		});

		await modalHandler.onSubmit();

		if (!this._userGroup || !this._userGroup.id) return;

		await this.#workspaceContext.delete(this._userGroup?.id);
		//TODO: should we check if it actually succeeded in deleting the user group?

		history.pushState(null, '', 'section/users/view/user-groups');
	}

	#onNameChange(event: UUIInputEvent) {
		if (event instanceof UUIInputEvent) {
			const target = event.composedPath()[0] as UUIInputElement;

			if (typeof target?.value === 'string') {
				this.#workspaceContext?.updateProperty('name', target.value);
			}
		}
	}

	render() {
		if (!this._userGroup) return nothing;

		return html`
			<umb-workspace-editor alias="Umb.Workspace.UserGroup">
				${this.#renderHeader()}
				<div id="main">
					<div id="left-column">${this.#renderLeftColumn()}</div>
					<div id="right-column">${this.#renderRightColumn()}</div>
				</div>
			</umb-workspace-editor>
		`;
	}

	#renderHeader() {
		return html`
			<div id="header" slot="header">
				<a href="/section/users/view/user-groups">
					<uui-icon name="umb:arrow-left"></uui-icon>
				</a>
				<uui-input
					id="name"
					label="name"
					.value=${this._userGroup?.name ?? ''}
					@input="${this.#onNameChange}"></uui-input>
			</div>
		`;
	}

	#renderLeftColumn() {
		if (!this._userGroup) return nothing;

		return html` <uui-box>
				<div slot="headline">Assign access</div>
				<umb-workspace-property-layout label="Sections" description="Add sections to give users access">
					<umb-input-section
						slot="editor"
						.value=${this._userGroup.sections ?? []}
						@change=${(e: any) => this.#onSectionsChange(e.target.value)}></umb-input-section>
				</umb-workspace-property-layout>
				<umb-workspace-property-layout
					label="Content start node"
					description="Limit the content tree to a specific start node">
					<uui-ref-node slot="editor" name="Content Root" border>
						<uui-icon slot="icon" name="folder"></uui-icon>
						<uui-button slot="actions" label="change"></uui-button>
						<uui-button slot="actions" label="remove" color="danger"></uui-button>
					</uui-ref-node>
				</umb-workspace-property-layout>
				<umb-workspace-property-layout
					label="Media start node"
					description="Limit the media library to a specific start node">
					<uui-ref-node slot="editor" name="Media Root" border>
						<uui-icon slot="icon" name="folder"></uui-icon>
						<uui-button slot="actions" label="change"></uui-button>
						<uui-button slot="actions" label="remove" color="danger"></uui-button>
					</uui-ref-node>
				</umb-workspace-property-layout>
			</uui-box>

			<uui-box>
				<div slot="headline">Default Permissions</div>
				<b>PERMISSIONS NOT IMPLEMENTED YET</b>
			</uui-box>

			<uui-box>
				<div slot="headline">Granular permissions</div>
				<b>PERMISSIONS NOT IMPLEMENTED YET</b>
			</uui-box>`;
	}

	#renderRightColumn() {
		return html`<uui-box>
				<div slot="headline">Users</div>
				<umb-user-input @change=${(e: Event) => this.#onUsersChange((e.target as any).value)}></umb-user-input>
			</uui-box>
			<uui-box>
				<div slot="headline">Delete user group</div>
				<uui-button
					@click=${this.#onDelete}
					style="width: 100%"
					color="danger"
					look="secondary"
					label="Delete"></uui-button>
			</uui-box>`;
	}

	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				height: 100%;
			}
			#header {
				width: 100%;
				display: grid;
				grid-template-columns: var(--uui-size-layout-1) 1fr;
				padding: var(--uui-size-layout-1);
			}
			#main {
				display: grid;
				grid-template-columns: 1fr 350px;
				gap: var(--uui-size-layout-1);
				padding: var(--uui-size-layout-1);
			}
			#left-column,
			#right-column {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-space-4);
			}
			#right-column > uui-box > div {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-space-2);
			}
			hr {
				border: none;
				border-bottom: 1px solid var(--uui-color-divider);
				width: 100%;
			}
			uui-input {
				width: 100%;
			}
		`,
	];
}

export default UmbUserGroupWorkspaceEditElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-user-group-workspace-edit': UmbUserGroupWorkspaceEditElement;
	}
}
