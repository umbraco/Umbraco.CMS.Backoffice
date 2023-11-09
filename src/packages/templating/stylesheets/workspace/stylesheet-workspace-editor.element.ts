import { UmbStylesheetWorkspaceContext } from './stylesheet-workspace.context.js';
import { UUIInputElement, UUIInputEvent, UUITextStyles } from '@umbraco-cms/backoffice/external/uui';
import { css, html, customElement, state, PropertyValueMap } from '@umbraco-cms/backoffice/external/lit';
import { UMB_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { Subject, debounceTime } from '@umbraco-cms/backoffice/external/rxjs';

@customElement('umb-stylesheet-workspace-editor')
export class UmbStylesheetWorkspaceEditorElement extends UmbLitElement {
	#workspaceContext?: UmbStylesheetWorkspaceContext;

	#name: string | undefined = '';
	@state()
	private get _name() {
		return this.#name;
	}

	private set _name(value) {
		this.#name = value?.replace('.css', '');
		this.requestUpdate();
	}

	@state()
	private _path?: string;

	@state()
	private _dirName?: string;

	private inputQuery$ = new Subject<string>();

	constructor() {
		super();

		this.consumeContext(UMB_WORKSPACE_CONTEXT, (instance) => {
			this.#workspaceContext = instance as UmbStylesheetWorkspaceContext;

			this.#observeNameAndPath();

			this.inputQuery$.pipe(debounceTime(250)).subscribe((nameInputValue: string) => {
				this.#workspaceContext?.setName(`${nameInputValue}.css`);
			});
		});
	}

	#observeNameAndPath() {
		if (!this.#workspaceContext) return;
		this.observe(
			this.#workspaceContext.path,
			(path) => {
				this._path = path;
				this._dirName = this._path?.substring(0, this._path?.lastIndexOf('\\') + 1)?.replace(/\\/g, '/');
			},
			'_observeStylesheetPath',
		);
		this.observe(this.#workspaceContext.name, (name) => (this._name = name), '_observeStylesheetName');
	}

	#onNameChange(event: UUIInputEvent) {
		const target = event.target as UUIInputElement;
		const value = target.value as string;
		this.inputQuery$.next(value);
	}

	render() {
		return html`
			<umb-workspace-editor alias="Umb.Workspace.StyleSheet">
				<div id="header" slot="header">
					<uui-input
						placeholder="Enter stylesheet name..."
						label="stylesheet name"
						id="name"
						.value=${this._name}
						@input="${this.#onNameChange}">
					</uui-input>
					<small>/css/${this._dirName}${this._name}.css</small>
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
			</umb-workspace-editor>
		`;
	}

	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}

			#header {
				display: flex;
				flex: 1 1 auto;
				flex-direction: column;
			}

			#name {
				width: 100%;
				flex: 1 1 auto;
				align-items: center;
			}
		`,
	];
}

export default UmbStylesheetWorkspaceEditorElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-stylesheet-workspace-editor': UmbStylesheetWorkspaceEditorElement;
	}
}
