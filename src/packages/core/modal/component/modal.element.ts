import type { UmbModalContext } from '../context/modal.context.js';
import { UMB_MODAL_CONTEXT } from '../context/modal.context-token.js';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { ManifestModal } from '@umbraco-cms/backoffice/extension-registry';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { CSSResultGroup } from '@umbraco-cms/backoffice/external/lit';
import { html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbBasicState, type UmbObserverController } from '@umbraco-cms/backoffice/observable-api';
import {
	UUIModalCloseEvent,
	type UUIDialogElement,
	type UUIModalDialogElement,
	type UUIModalSidebarElement,
} from '@umbraco-cms/backoffice/external/uui';
import type { UmbRouterSlotElement } from '@umbraco-cms/backoffice/router';
import { createExtensionElement } from '@umbraco-cms/backoffice/extension-api';
import type { UmbContextRequestEvent } from '@umbraco-cms/backoffice/context-api';
import { UMB_CONTENT_REQUEST_EVENT_TYPE, UmbContextProvider } from '@umbraco-cms/backoffice/context-api';

@customElement('umb-modal')
export class UmbModalElement extends UmbLitElement {
	#modalContext?: UmbModalContext;
	public get modalContext(): UmbModalContext | undefined {
		return this.#modalContext;
	}
	public set modalContext(value: UmbModalContext | undefined) {
		if (this.#modalContext === value) return;
		this.#modalContext = value;

		if (!value) {
			this.destroy();
			return;
		}

		this.#createModalElement();
	}

	public element?: UUIModalDialogElement | UUIModalSidebarElement;

	#innerElement = new UmbBasicState<HTMLElement | undefined>(undefined);

	#modalExtensionObserver?: UmbObserverController<ManifestModal | undefined>;
	#modalRouterElement: UmbRouterSlotElement = document.createElement('umb-router-slot');

	#onClose = () => {
		this.element?.removeEventListener(UUIModalCloseEvent, this.#onClose);
		this.#modalContext?.reject({ type: 'close' });
	};

	#createModalElement() {
		if (!this.#modalContext) return;

		this.#modalContext.addEventListener('umb:destroy', this.#onContextDestroy);
		this.element = this.#createContainerElement();

		// Makes sure that the modal triggers the reject of the context promise when it is closed by pressing escape.
		this.element.addEventListener(UUIModalCloseEvent, this.#onClose);

		// The following code is the context api proxy.
		// It re-dispatches the context api request event to the origin target of this modal, in other words the element that initiated the modal. [NL]
		this.element.addEventListener(UMB_CONTENT_REQUEST_EVENT_TYPE, ((event: UmbContextRequestEvent) => {
			if (!this.#modalContext) return;
			// Note for this hack (The if-sentence):  [NL]
			// We do not currently have a good enough control to ensure that the proxy is last, meaning if another context is provided at this element, it might respond after the proxy event has been dispatched.
			// To avoid such this hack just prevents proxying the event if its a request for the Modal Context. [NL]
			if (event.contextAlias !== UMB_MODAL_CONTEXT.contextAlias) {
				event.stopImmediatePropagation();
				this.#modalContext.getHostElement().dispatchEvent(event.clone());
			}
		}) as EventListener);

		this.#modalContext.onSubmit().then(
			() => {
				this.element?.close();
			},
			() => {
				this.element?.close();
			},
		);

		/**
		 *
		 * Maybe we could just get a Modal Router Slot. But it needs to have the ability to actually inject via slot. so the modal inner element can be within.
		 *
		 */
		if (this.#modalContext.router) {
			this.#modalRouterElement.routes = [
				{
					path: '',
					component: document.createElement('slot'),
				},
			];
			this.#modalRouterElement.parent = this.#modalContext.router;
		}

		this.element.appendChild(this.#modalRouterElement);
		this.#observeModal(this.#modalContext.alias.toString());

		const provider = new UmbContextProvider(this.element, UMB_MODAL_CONTEXT, this.#modalContext);
		provider.hostConnected();
	}

	#createContainerElement() {
		return this.#modalContext!.type === 'sidebar' ? this.#createSidebarElement() : this.#createDialogElement();
	}

	#createSidebarElement() {
		const sidebarElement = document.createElement('uui-modal-sidebar');
		sidebarElement.size = this.#modalContext!.size;
		return sidebarElement;
	}

	#createDialogElement() {
		const modalDialogElement = document.createElement('uui-modal-dialog');
		const dialogElement: UUIDialogElement = document.createElement('uui-dialog');
		modalDialogElement.appendChild(dialogElement);
		return modalDialogElement;
	}

	#observeModal(alias: string) {
		this.#modalExtensionObserver?.destroy();

		this.observe(umbExtensionsRegistry.byTypeAndAlias('modal', alias), async (manifest) => {
			this.#removeInnerElement();

			if (manifest) {
				const innerElement = await this.#createInnerElement(manifest);
				if (innerElement) {
					this.#appendInnerElement(innerElement);
				}
			}
		});
	}

	async #createInnerElement(manifest: ManifestModal) {
		// TODO: add inner fallback element if no extension element is found
		const innerElement = await createExtensionElement(manifest);

		if (!this.#modalContext) {
			// If context does not exist any more, it means we have been destroyed. So we need to back out:
			return undefined;
		}
		if (innerElement) {
			innerElement.manifest = manifest;
			innerElement.data = this.#modalContext.data;
			innerElement.modalContext = this.#modalContext;
		}

		return innerElement;
	}

	#appendInnerElement(element: HTMLElement) {
		this.#modalRouterElement.appendChild(element);
		this.#innerElement.setValue(element);
	}

	#removeInnerElement() {
		const innerElement = this.#innerElement.getValue();
		if (innerElement) {
			this.#modalRouterElement.removeChild(innerElement);
			this.#innerElement.setValue(undefined);
		}
	}

	render() {
		return html`${this.element}`;
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this.destroy();
	}

	#onContextDestroy = () => {
		this.destroy();
	};

	destroy() {
		this.#innerElement.destroy();
		this.#modalExtensionObserver?.destroy();
		this.#modalExtensionObserver = undefined;
		if (this.#modalContext) {
			this.#modalContext.removeEventListener('umb:destroy', this.#onContextDestroy);
			this.#modalContext.destroy();
			this.#modalContext = undefined;
		}
		super.destroy();
	}

	static styles: CSSResultGroup = [UmbTextStyles];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-modal': UmbModalElement;
	}
}
