/**
 * Configuration interface for the Umbraco App Element.
 * @export
 * @interface UmbAppConfig
 */
export interface UmbAppConfig {
	/**
	 * The base URL of the configured Umbraco server.
	 * @type {string}
	 * @memberof UmbAppConfig
	 */
	serverUrl: string;

	/**
	 * The base path of the backoffice.
	 * @type {string}
	 * @memberof UmbAppConfig
	 */
	backofficePath: string;

	/**
	 * Bypass authentication.
	 * @type {boolean}
	 * @memberof UmbAppConfig
	 */
	bypassAuth: boolean;
}
