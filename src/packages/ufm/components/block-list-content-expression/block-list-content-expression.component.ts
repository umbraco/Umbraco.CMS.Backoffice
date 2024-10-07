import type { UfmToken } from '../../plugins/marked-ufm.plugin.js';
import { UmbUfmComponentBase } from '../ufm-component-base.js';

import './block-list-content-expression.element.js';

export class UmbBlockListContentExpressionComponent extends UmbUfmComponentBase {
	render(token: UfmToken) {
		if (!token.text) return;
		const attributes = super.getAttributes(token.text);
		return `<ufm-url-picker-in-list ${attributes}></ufm-url-picker-in-list>`;
	}
}
export { UmbBlockListContentExpressionComponent as api };
