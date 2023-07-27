import { Observable, Subscription, lastValueFrom } from '@umbraco-cms/backoffice/external/rxjs';

export class UmbObserver<T> {
	#source!: Observable<T>;
	#callback!: (_value: T) => void;
	#subscription!: Subscription;

	constructor(source: Observable<T>, callback: (_value: T) => void) {
		this.#source = source;
		this.#subscription = source.subscribe(callback);
	}

	public async asPromise() {
		return await lastValueFrom(this.#source);
	}

	hostConnected() {
		if (this.#subscription.closed) {
			this.#subscription = this.#source.subscribe(this.#callback);
		}
	}

	hostDisconnected() {
		// No cause then it cant re-connect, if the same element just was moved in DOM.
		//this.#subscription.unsubscribe();
	}

	destroy(): void {
		this.#subscription.unsubscribe();
	}
}
