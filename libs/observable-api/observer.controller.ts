import { Observable } from 'rxjs';
import { UmbObserver } from './observer';
import { UmbControllerInterface, UmbControllerHostInterface } from '@umbraco-cms/controller';

export class UmbObserverController<T = unknown> extends UmbObserver<T> implements UmbControllerInterface {
	_alias?: string;
	public get unique() {
		return this._alias;
	}

	constructor(host: UmbControllerHostInterface, source: Observable<T>, callback: (_value: T) => void, alias?: string) {
		super(source, callback);
		this._alias = alias;

		// Lets check if controller is already here:
		/*
		if (this._subscriptions.has(source)) {
			const subscription = this._subscriptions.get(source);
			subscription?.unsubscribe();
		}
		*/

		host.addController(this);
	}

	hostConnected() {
		return;
	}
}
