import { UmbAppContextConfig } from './app-context-config.interface.js';
import { UmbControllerHost, UmbBaseContext } from '@umbraco-cms/backoffice/controller-api';
import {  UmbContextToken } from '@umbraco-cms/backoffice/context-api';

export class UmbAppContext extends UmbBaseContext {
	#serverUrl: string;
	#backofficePath: string;

	constructor(host: UmbControllerHost, config: UmbAppContextConfig) {
		super(host, UMB_APP)
		this.#serverUrl = config.serverUrl;
		this.#backofficePath = config.backofficePath;
	}

	getBackofficePath() {
		return this.#backofficePath;
	}

	getServerUrl() {
		return this.#serverUrl;
	}
}

export const UMB_APP = new UmbContextToken<UmbAppContext>('UMB_APP');
