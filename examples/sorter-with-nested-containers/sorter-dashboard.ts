import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import type { ModelEntryType } from './sorter-group.js';

import './sorter-group.js';
@customElement('example-sorter-dashboard')
export class ExampleSorterDashboard extends UmbElementMixin(LitElement) {
	groupOneItems: ModelEntryType[] = [
		{
			name: 'Apple',
			children: [
				{
					name: 'Juice',
				},
				{
					name: 'Milk',
				},
			],
		},
		{
			name: 'Banana',
			children: [],
		},
		{
			name: 'Pear',
		},
		{
			name: 'Pineapple',
		},
		{
			name: 'Lemon',
			children: [
				{
					name: 'Cola',
				},
				{
					name: 'Pepsi',
				},
			],
		},
	];

	groupTwoItems: ModelEntryType[] = [
		{
			name: 'DXP',
		},
		{
			name: 'H5YR',
		},
		{
			name: 'UUI',
		},
	];

	render() {
		return html`
			<uui-box class="uui-text">
				<div class="outer-wrapper">
					<h5>Notice this example still only support single group of Sorter.</h5>
					<example-sorter-group .initialItems=${this.groupOneItems}></example-sorter-group>
					<example-sorter-group .initialItems=${this.groupTwoItems}></example-sorter-group>
				</div>
			</uui-box>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				padding: var(--uui-size-layout-1);
			}

			.outer-wrapper {
				display: flex;
				gap: var(--uui-size-layout-1);
			}
		`,
	];
}

export default ExampleSorterDashboard;

declare global {
	interface HTMLElementTagNameMap {
		'example-sorter-dashboard-nested': ExampleSorterDashboard;
	}
}
