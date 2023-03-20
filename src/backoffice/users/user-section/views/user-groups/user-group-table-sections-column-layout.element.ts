import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UmbTableItem } from '../../../../shared/components/table';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extensions-api';
import { UmbLitElement } from '@umbraco-cms/backoffice/element';

@customElement('umb-user-group-table-sections-column-layout')
export class UmbUserGroupTableSectionsColumnLayoutElement extends UmbLitElement {
	@property({ type: Object, attribute: false })
	item!: UmbTableItem;

	@property({ attribute: false })
	value!: any;

	@state()
	private _sectionsNames: Array<string> = [];

	updated(changedProperties: Map<string, any>) {
		if (changedProperties.has('value')) {
			this.observeSectionNames();
		}
	}

	private observeSectionNames() {
		this.observe(umbExtensionsRegistry.extensionsOfType('section'), (sections) => {
			this._sectionsNames = sections.filter((x) => this.value.includes(x.alias)).map((x) => x.meta.label || x.name);
		});
	}

	render() {
		return html`${this._sectionsNames.join(', ')}`;
	}
}

export default UmbUserGroupTableSectionsColumnLayoutElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-user-group-table-sections-column-layout': UmbUserGroupTableSectionsColumnLayoutElement;
	}
}
