import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { map } from 'rxjs';
import { UMB_CONFIRM_MODAL_TOKEN } from '../../../shared/modals/confirm';
import { isManifestElementNameType, umbExtensionsRegistry } from '@umbraco-cms/backoffice/extensions-api';
import type { ManifestTypes } from '@umbraco-cms/backoffice/models';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbModalContext, UMB_MODAL_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/modal';

@customElement('umb-extension-root-workspace')
export class UmbExtensionRootWorkspaceElement extends UmbLitElement {
	@state()
	private _extensions?: Array<ManifestTypes> = undefined;

	private _modalContext?: UmbModalContext;

	connectedCallback(): void {
		super.connectedCallback();
		this._observeExtensions();

		this.consumeContext(UMB_MODAL_CONTEXT_TOKEN, (instance) => {
			this._modalContext = instance;
		});
	}

	private _observeExtensions() {
		this.observe(
			umbExtensionsRegistry.extensions.pipe(
				map((exts) =>
					exts.sort((a, b) => {
						// If type is the same, sort by weight
						if (a.type === b.type) {
							return (b.weight || 0) - (a.weight || 0);
						}
						// Otherwise sort by type
						return a.type.localeCompare(b.type);
					})
				)
			),
			(extensions) => {
				this._extensions = extensions || undefined;
			}
		);
	}

	async #removeExtension(extension: ManifestTypes) {
		const modalHandler = this._modalContext?.open(UMB_CONFIRM_MODAL_TOKEN, {
			headline: 'Unload extension',
			confirmLabel: 'Unload',
			content: html`<p>Are you sure you want to unload the extension <strong>${extension.alias}</strong>?</p>`,
			color: 'danger',
		});

		await modalHandler?.onSubmit();
		umbExtensionsRegistry.unregister(extension.alias);
	}

	render() {
		return html`
			<umb-workspace-layout headline="Extensions" alias="Umb.Workspace.ExtensionRoot">
				<uui-box>
					<uui-table>
						<uui-table-head>
							<uui-table-head-cell>Type</uui-table-head-cell>
							<uui-table-head-cell>Weight</uui-table-head-cell>
							<uui-table-head-cell>Name</uui-table-head-cell>
							<uui-table-head-cell>Alias</uui-table-head-cell>
							<uui-table-head-cell>Actions</uui-table-head-cell>
						</uui-table-head>

						${this._extensions?.map(
							(extension) => html`
								<uui-table-row>
									<uui-table-cell>${extension.type}</uui-table-cell>
									<uui-table-cell>${extension.weight ? extension.weight : 'Not Set'} </uui-table-cell>
									<uui-table-cell>
										${isManifestElementNameType(extension) ? extension.name : `[Custom extension] ${extension.name}`}
									</uui-table-cell>
									<uui-table-cell>${extension.alias}</uui-table-cell>
									<uui-table-cell>
										<uui-button
											label="Unload"
											color="danger"
											look="primary"
											@click=${() => this.#removeExtension(extension)}>
											<uui-icon name="umb:trash"></uui-icon>
										</uui-button>
									</uui-table-cell>
								</uui-table-row>
							`
						)}
					</uui-table>
				</uui-box>
			</umb-workspace-layout>
		`;
	}
}

export default UmbExtensionRootWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-extension-root-workspace': UmbExtensionRootWorkspaceElement;
	}
}
