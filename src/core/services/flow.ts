/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
import {
  BaseTokenRequestHandler,
  BasicQueryStringUtils,
  FetchRequestor,
  LocalStorageBackend,
  RedirectRequestHandler,
} from '@openid/appauth';
import { AuthorizationRequest } from '@openid/appauth/built/authorization_request';
import { AuthorizationNotifier } from '@openid/appauth/built/authorization_request_handler';
import { AuthorizationServiceConfiguration } from '@openid/appauth/built/authorization_service_configuration';
import { GRANT_TYPE_AUTHORIZATION_CODE, GRANT_TYPE_REFRESH_TOKEN, TokenRequest } from '@openid/appauth/built/token_request';
import { TokenResponse } from '@openid/appauth/built/token_response';
import { LocationLike, StringMap } from '@openid/appauth/built/types';

const requestor = new FetchRequestor();

class NoHashQueryStringUtils extends BasicQueryStringUtils {
	parse(input: LocationLike) {
		return super.parse(input, false);
	}
}

export class AuthFlow {
	private notifier: AuthorizationNotifier;
	private authorizationHandler: RedirectRequestHandler;
	private tokenHandler: BaseTokenRequestHandler;

	// state
	private configuration: AuthorizationServiceConfiguration | undefined;
	private openIdConnectUrl: string;
	private redirectUri: string;
	private clientId: string;
	private scope: string;

	private refreshToken: string | undefined;
	private accessTokenResponse: TokenResponse | undefined;

	constructor(
		openIdConnectUrl: string,
		redirectUri: string,
		clientId = 'umbraco-back-office',
		scope = 'offline_access'
	) {
		this.openIdConnectUrl = openIdConnectUrl;
		this.redirectUri = redirectUri;
		this.clientId = clientId;
		this.scope = scope;

		this.notifier = new AuthorizationNotifier();
		this.tokenHandler = new BaseTokenRequestHandler(requestor);
		this.authorizationHandler = new RedirectRequestHandler(
			new LocalStorageBackend(),
			new NoHashQueryStringUtils(),
			window.location
		);
		// set notifier to deliver responses
		this.authorizationHandler.setAuthorizationNotifier(this.notifier);
		// set a listener to listen for authorization responses
		this.notifier.setAuthorizationListener((request, response, error) => {
			console.log('Authorization request complete ', request, response, error);
			if (response) {
				let codeVerifier: string | undefined;
				if (request.internal && request.internal.code_verifier) {
					codeVerifier = request.internal.code_verifier;
				}

				this.makeRefreshTokenRequest(response.code, codeVerifier)
					.then(() => this.performWithFreshTokens())
					.then(() => {
						window.dispatchEvent(new CustomEvent('auth-success'));
						console.log('All Done.');
						this.saveTokenState();
					});
			}
		});
	}

	/**
	 * Read the token response from local storage and use it to set the current token
	 */
	async setInitialState() {
		await this.fetchServiceConfiguration();
		const tokenResponseJson = localStorage.getItem('tokenResponse');
		if (tokenResponseJson) {
			console.log('found initial state', tokenResponseJson);
			const response = new TokenResponse(JSON.parse(tokenResponseJson));
			if (response.isValid()) {
				this.accessTokenResponse = response;
				this.refreshToken = this.accessTokenResponse.refreshToken;
				window.dispatchEvent(new CustomEvent('auth-success'));
				return;
			}
		}

		// If no token was found, or if it was invalid, check if there is a new authorization to be made
		this.completeAuthorizationIfPossible();
	}

	/**
	 * Save the current token response to local storage.
	 */
	private saveTokenState() {
		if (this.accessTokenResponse) {
			localStorage.setItem('tokenResponse', JSON.stringify(this.accessTokenResponse.toJson()));
		}
	}

	completeAuthorizationIfPossible() {
		return this.authorizationHandler.completeAuthorizationRequestIfPossible();
	}

	async fetchServiceConfiguration(): Promise<void> {
		const response = await AuthorizationServiceConfiguration.fetchFromIssuer(this.openIdConnectUrl, requestor);
		console.log('Fetched service configuration', response);
		this.configuration = response;
	}

	makeAuthorizationRequest(username?: string) {
		if (!this.configuration) {
			console.log('Unknown service configuration');
			return;
		}

		const extras: StringMap = { prompt: 'consent', access_type: 'offline' };
		if (username) {
			extras['login_hint'] = username;
		}

		// create a request
		const request = new AuthorizationRequest(
			{
				client_id: this.clientId,
				redirect_uri: this.redirectUri,
				scope: this.scope,
				response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
				state: undefined,
				extras: extras,
			},
			undefined,
			true
		);

		console.log('Making authorization request ', this.configuration, request);

		this.authorizationHandler.performAuthorizationRequest(this.configuration, request);
	}

	private async makeRefreshTokenRequest(code: string, codeVerifier: string | undefined): Promise<void> {
		if (!this.configuration) {
			console.log('Unknown service configuration');
			return Promise.resolve();
		}

		const extras: StringMap = {};

		if (codeVerifier) {
			extras.code_verifier = codeVerifier;
		}

		// use the code to make the token request.
		const request = new TokenRequest({
			client_id: this.clientId,
			redirect_uri: this.redirectUri,
			grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
			code: code,
			refresh_token: undefined,
			extras: extras,
		});

		const response = await this.tokenHandler.performTokenRequest(this.configuration, request);
		console.log(`Refresh Token is ${response.refreshToken}`);
		this.refreshToken = response.refreshToken;
		this.accessTokenResponse = response;
	}

	loggedIn(): boolean {
		return !!this.accessTokenResponse && this.accessTokenResponse.isValid();
	}

	signOut() {
		// forget all cached token state
		this.accessTokenResponse = undefined;
	}

	async performWithFreshTokens(): Promise<string> {
		if (!this.configuration) {
			console.log('Unknown service configuration');
			return Promise.reject('Unknown service configuration');
		}
		if (!this.refreshToken) {
			console.log('Missing refreshToken.');
			return Promise.resolve('Missing refreshToken.');
		}
		if (this.accessTokenResponse && this.accessTokenResponse.isValid()) {
			// do nothing
			return Promise.resolve(this.accessTokenResponse.accessToken);
		}
		const request = new TokenRequest({
			client_id: this.clientId,
			redirect_uri: this.redirectUri,
			grant_type: GRANT_TYPE_REFRESH_TOKEN,
			code: undefined,
			refresh_token: this.refreshToken,
			extras: undefined,
		});

		const response = await this.tokenHandler.performTokenRequest(this.configuration, request);
		this.accessTokenResponse = response;
		return response.accessToken;
	}
}
