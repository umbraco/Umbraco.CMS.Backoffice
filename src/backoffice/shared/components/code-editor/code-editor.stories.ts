import './code-editor-element';

import { html } from 'lit-html';

export default {
	title: 'Components/Code Editor',
	component: 'umb-code-editor',
	id: 'umb-code-editor',
};

const javascript = [
	'"use strict";',
	'function Person(age) {',
	'	if (age) {',
	'		this.age = age;',
	'	}',
	'}',
	'Person.prototype.getAge = function () {',
	'	return this.age;',
	'};',
].join('\n');

const css = `:host {
	display: flex;
	background-color: var(--uui-color-background);
	width: 100%;
	height: 100%;
	flex-direction: column;
}

#header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 70px;
	background-color: var(--uui-color-surface);
	border-bottom: 1px solid var(--uui-color-border);
	box-sizing: border-box;
}

#headline {
	display: block;
	margin: 0 var(--uui-size-layout-1);
}

#tabs {
	margin-left: auto;
}`;

const razor = ['@{ var myMessage = "Hello World"; }', '<p>The value of myMessage is: @myMessage</p>'].join('\n');

export const AAAOverview = () => html` <umb-code-editor .language=${'razor'} .code=${razor}></umb-code-editor>`;
AAAOverview.storyName = 'Overview';
