import { UUIIconRegistry } from '@umbraco-ui/uui';
import icons from '../../../public-assets/icons/icons.json';
import { baseUrl } from '@umbraco-cms/utils';

interface UmbIconDescriptor {
	name: string;
	path: string;
}

/**
 * @export
 * @class UmbIconStore
 * @extends {UUIIconRegistry}
 * @description - Icon Store. Provides icons from the icon manifest. Icons are loaded on demand. All icons are prefixed with 'umb:'
 */
export class UmbIconStore extends UUIIconRegistry {
	#baseValue: string;

	constructor() {
		super();

		this.#baseValue = baseUrl();
	}

	/**
	 * @param {string} iconName
	 * @return {*}  {boolean}
	 * @memberof UmbIconStore
	 */
	acceptIcon(iconName: string): boolean {
		const iconManifest = icons.find((i: UmbIconDescriptor) => i.name === iconName);
		if (!iconManifest) return false;

		const icon = this.provideIcon(iconName);

		const iconPath = `${this.#baseValue}${iconManifest.path}`;

		import(/* @vite-ignore */ iconPath)
			.then((iconModule) => {
				icon.svg = iconModule.default;
			})
			.catch((err) => {
				console.error(`Failed to load icon ${iconName} on path ${iconPath}`, err.message);
			});

		return true;
	}
}
