import type { MediaDetails } from '../';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';
import { UmbStoreBase } from '@umbraco-cms/backoffice/store';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';

/**
 * @export
 * @class UmbMediaStore
 * @extends {UmbStoreBase}
 * @description - Data Store for Template Details
 */
export class UmbMediaStore extends UmbStoreBase {
	/**
	 * Creates an instance of UmbMediaStore.
	 * @param {UmbControllerHostElement} host
	 * @memberof UmbMediaStore
	 */
	constructor(host: UmbControllerHostElement) {
		super(host, UMB_MEDIA_STORE_CONTEXT_TOKEN.toString(), new UmbArrayState<MediaDetails>([], (x) => x.id));
	}

	/**
	 * Append a media to the store
	 * @param {MediaDetails} media
	 * @memberof UmbMediaStore
	 */
	append(media: MediaDetails) {
		this._data.append([media]);
	}

	/**
	 * Removes media in the store with the given uniques
	 * @param {string[]} uniques
	 * @memberof UmbMediaStore
	 */
	remove(uniques: string[]) {
		this._data.remove(uniques);
	}
}

export const UMB_MEDIA_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbMediaStore>('UmbMediaStore');
