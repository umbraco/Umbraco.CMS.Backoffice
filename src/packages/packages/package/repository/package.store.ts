import type { UmbPackage } from '../../types.js';
import { ReplaySubject } from '@umbraco-cms/backoffice/external/rxjs';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbStoreBase } from '@umbraco-cms/backoffice/store';
import type { PackageMigrationStatusResponseModel } from '@umbraco-cms/backoffice/external/backend-api';
import type { ManifestBase } from '@umbraco-cms/backoffice/extension-api';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';

export const UMB_PACKAGE_STORE_TOKEN = new UmbContextToken<UmbPackageStore>('UmbPackageStore');

/**
 * Store for Packages
 * @export
 * @extends {UmbStoreBase}
 */
export class UmbPackageStore extends UmbStoreBase {
	/**
	 * Array of packages with extensions
	 * @private
	 */
	// TODO: Revisit this code, to not use RxJS directly:
	#packages = new ReplaySubject<Array<UmbPackage>>(1);

	#extensions = new UmbArrayState<ManifestBase>([], (e) => e.alias);

	#migrations = new UmbArrayState<PackageMigrationStatusResponseModel>([], (e) => e.packageName);

	/**
	 * Observable of packages with extensions
	 */
	rootItems = this.#packages.asObservable();

	extensions = this.#extensions.asObservable();

	migrations = this.#migrations.asObservable();

	isPackagesLoaded = false;

	/**
	 * Creates an instance of PackageStore.
	 * @param {UmbControllerHost} host
	 * @memberof PackageStore
	 */
	constructor(host: UmbControllerHost) {
		// TODO: revisit this store. Is it ok to have multiple data sets?
		// temp hack to satisfy the base class
		super(host, UMB_PACKAGE_STORE_TOKEN.toString(), new UmbArrayState<UmbPackage>([], (x) => x.name));
	}

	/**
	 * Append items to the store
	 */
	appendItems(packages: Array<UmbPackage>) {
		this.#packages.next(packages);
		this.isPackagesLoaded = true;
	}

	appendExtensions(extensions: ManifestBase[]) {
		this.#extensions.append(extensions);
	}

	appendMigrations(migrations: PackageMigrationStatusResponseModel[]) {
		this.#migrations.append(migrations);
	}
}

export default UmbPackageStore;
