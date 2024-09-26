import type { UfmToken } from '../../plugins/marked-ufm.plugin.js';
import { UmbUfmComponentBase } from '../ufm-component-base.js';

import './url-picker-in-list.element.js';

export class UmbUfmUrlPickerInListComponent extends UmbUfmComponentBase {
	render(token: UfmToken) {
		if (!token.text) return;

		const attributes = super.getAttributes(token.text);
		return `<ufm-url-picker-in-list ${attributes}></ufm-url-picker-in-list>`;
	}
}

export { UmbUfmUrlPickerInListComponent as api };
