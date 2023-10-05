import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { type UmbControllerHostElement, UmbBaseContext } from '@umbraco-cms/backoffice/controller-api';
import { UmbBooleanState } from '@umbraco-cms/backoffice/observable-api';

export class UmbPropertyActionMenuContext extends UmbBaseContext {
	#isOpen = new UmbBooleanState(false);
	public readonly isOpen = this.#isOpen.asObservable();

	constructor(host: UmbControllerHostElement) {
		super(host, UMB_PROPERTY_ACTION_MENU);
	}

	toggle() {
		this.#isOpen.next(!this.#isOpen.getValue());
	}
	open() {
		this.#isOpen.next(true);
	}
	close() {
		this.#isOpen.next(false);
	}
}

export const UMB_PROPERTY_ACTION_MENU = new UmbContextToken<UmbPropertyActionMenuContext>('umbPropertyActionMenu');
