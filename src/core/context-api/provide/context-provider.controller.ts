import { UmbContextToken } from '../context-token';
import { UmbContextProvider } from './context-provider';
import type { UmbControllerHostInterface, UmbControllerInterface } from '@umbraco-cms/controller';

export class UmbContextProviderController<T = unknown>
	extends UmbContextProvider<UmbControllerHostInterface>
	implements UmbControllerInterface
{
	public get unique() {
		return this._contextAlias.toString();
	}

	constructor(host: UmbControllerHostInterface, contextAlias: string | UmbContextToken<T>, instance: T) {
		super(host, contextAlias, instance);

		// TODO: What if this API is already provided with this alias? maybe handle this in the controller:
		// TODO: Remove/destroy existing controller of same alias.

		host.addController(this);
	}

	public destroy() {
		if (this.host) {
			this.host.removeController(this);
		}
	}
}
