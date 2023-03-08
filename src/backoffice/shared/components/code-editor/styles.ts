import { css } from 'lit';

export const monacoStyles = css`
	.monaco-action-bar {
		white-space: nowrap;
		height: 100%;
	}
	.monaco-action-bar .actions-container {
		display: flex;
		margin: 0 auto;
		padding: 0;
		height: 100%;
		width: 100%;
		align-items: center;
	}
	.monaco-action-bar.vertical .actions-container {
		display: inline-block;
	}
	.monaco-action-bar .action-item {
		display: block;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		position: relative;
	}
	.monaco-action-bar .action-item.disabled {
		cursor: default;
	}
	.monaco-action-bar .action-item .codicon,
	.monaco-action-bar .action-item .icon {
		display: block;
	}
	.monaco-action-bar .action-item .codicon {
		display: flex;
		align-items: center;
		width: 16px;
		height: 16px;
	}
	.monaco-action-bar .action-label {
		display: flex;
		font-size: 11px;
		padding: 3px;
		border-radius: 5px;
	}
	.monaco-action-bar .action-item.disabled .action-label,
	.monaco-action-bar .action-item.disabled .action-label:before,
	.monaco-action-bar .action-item.disabled .action-label:hover {
		opacity: 0.6;
	}
	.monaco-action-bar.vertical {
		text-align: left;
	}
	.monaco-action-bar.vertical .action-item {
		display: block;
	}
	.monaco-action-bar.vertical .action-label.separator {
		display: block;
		border-bottom: 1px solid #bbb;
		padding-top: 1px;
		margin-left: 0.8em;
		margin-right: 0.8em;
	}
	.monaco-action-bar .action-item .action-label.separator {
		width: 1px;
		height: 16px;
		margin: 5px 4px !important;
		cursor: default;
		min-width: 1px;
		padding: 0;
		background-color: #bbb;
	}
	.secondary-actions .monaco-action-bar .action-label {
		margin-left: 6px;
	}
	.monaco-action-bar .action-item.select-container {
		overflow: hidden;
		flex: 1;
		max-width: 170px;
		min-width: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
	}
	.monaco-action-bar .action-item.action-dropdown-item {
		display: flex;
	}
	.monaco-action-bar .action-item.action-dropdown-item > .action-dropdown-item-separator {
		display: flex;
		align-items: center;
		cursor: default;
	}
	.monaco-action-bar .action-item.action-dropdown-item > .action-dropdown-item-separator > div {
		width: 1px;
	}
	.monaco-aria-container {
		position: absolute;
		left: -999em;
	}
	.monaco-text-button {
		box-sizing: border-box;
		display: flex;
		width: 100%;
		padding: 4px;
		border-radius: 2px;
		text-align: center;
		cursor: pointer;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--vscode-button-border, transparent);
		line-height: 18px;
	}
	.monaco-text-button:focus {
		outline-offset: 2px !important;
	}
	.monaco-text-button:hover {
		text-decoration: none !important;
	}
	.monaco-button.disabled,
	.monaco-button.disabled:focus {
		opacity: 0.4 !important;
		cursor: default;
	}
	.monaco-text-button .codicon {
		margin: 0 0.2em;
		color: inherit !important;
	}
	.monaco-text-button.monaco-text-button-with-short-label {
		flex-direction: row;
		flex-wrap: wrap;
		padding: 0 4px;
		overflow: hidden;
		height: 28px;
	}
	.monaco-text-button.monaco-text-button-with-short-label > .monaco-button-label {
		flex-basis: 100%;
	}
	.monaco-text-button.monaco-text-button-with-short-label > .monaco-button-label-short {
		flex-grow: 1;
		width: 0;
		overflow: hidden;
	}
	.monaco-text-button.monaco-text-button-with-short-label > .monaco-button-label,
	.monaco-text-button.monaco-text-button-with-short-label > .monaco-button-label-short {
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 400;
		font-style: inherit;
		padding: 4px 0;
	}
	.monaco-button-dropdown {
		display: flex;
		cursor: pointer;
	}
	.monaco-button-dropdown.disabled {
		cursor: default;
	}
	.monaco-button-dropdown > .monaco-button:focus {
		outline-offset: -1px !important;
	}
	.monaco-button-dropdown.disabled > .monaco-button-dropdown-separator,
	.monaco-button-dropdown.disabled > .monaco-button.disabled,
	.monaco-button-dropdown.disabled > .monaco-button.disabled:focus {
		opacity: 0.4 !important;
	}
	.monaco-button-dropdown > .monaco-button.monaco-text-button {
		border-right-width: 0 !important;
	}
	.monaco-button-dropdown .monaco-button-dropdown-separator {
		padding: 4px 0;
		cursor: default;
	}
	.monaco-button-dropdown .monaco-button-dropdown-separator > div {
		height: 100%;
		width: 1px;
	}
	.monaco-button-dropdown > .monaco-button.monaco-dropdown-button {
		border: 1px solid var(--vscode-button-border, transparent);
		border-left-width: 0 !important;
		border-radius: 0 2px 2px 0;
	}
	.monaco-button-dropdown > .monaco-button.monaco-text-button {
		border-radius: 2px 0 0 2px;
	}
	.monaco-description-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 4px 5px;
	}
	.monaco-description-button .monaco-button-description {
		font-style: italic;
		font-size: 11px;
		padding: 4px 20px;
	}
	.monaco-description-button .monaco-button-description,
	.monaco-description-button .monaco-button-label {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.monaco-description-button .monaco-button-description > .codicon,
	.monaco-description-button .monaco-button-label > .codicon {
		margin: 0 0.2em;
		color: inherit !important;
	}
	@font-face {
		font-family: codicon;
		font-display: block;
		src: url(../base/browser/ui/codicons/codicon/codicon.ttf) format('truetype');
	}
	.codicon[class*='codicon-'] {
		font: normal normal normal 16px/1 codicon;
		display: inline-block;
		text-decoration: none;
		text-rendering: auto;
		text-align: center;
		text-transform: none;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		user-select: none;
		-webkit-user-select: none;
	}
	.codicon-wrench-subaction {
		opacity: 0.5;
	}
	@keyframes codicon-spin {
		to {
			transform: rotate(1turn);
		}
	}
	.codicon-gear.codicon-modifier-spin,
	.codicon-loading.codicon-modifier-spin,
	.codicon-notebook-state-executing.codicon-modifier-spin,
	.codicon-sync.codicon-modifier-spin {
		animation: codicon-spin 1.5s steps(30) infinite;
	}
	.codicon-modifier-disabled {
		opacity: 0.4;
	}
	.codicon-loading,
	.codicon-tree-item-loading:before {
		animation-duration: 1s !important;
		animation-timing-function: cubic-bezier(0.53, 0.21, 0.29, 0.67) !important;
	}
	.context-view {
		position: absolute;
	}
	.context-view.fixed {
		all: initial;
		font-family: inherit;
		font-size: 13px;
		position: fixed;
		color: inherit;
	}
	.monaco-count-badge {
		padding: 3px 6px;
		border-radius: 11px;
		font-size: 11px;
		min-width: 18px;
		min-height: 18px;
		line-height: 11px;
		font-weight: 400;
		text-align: center;
		display: inline-block;
		box-sizing: border-box;
	}
	.monaco-count-badge.long {
		padding: 2px 3px;
		border-radius: 2px;
		min-height: auto;
		line-height: normal;
	}
	.monaco-dropdown {
		height: 100%;
		padding: 0;
	}
	.monaco-dropdown > .dropdown-label {
		cursor: pointer;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.monaco-dropdown > .dropdown-label > .action-label.disabled {
		cursor: default;
	}
	.monaco-dropdown-with-primary {
		display: flex !important;
		flex-direction: row;
		border-radius: 5px;
	}
	.monaco-dropdown-with-primary > .action-container > .action-label {
		margin-right: 0;
	}
	.monaco-dropdown-with-primary
		> .dropdown-action-container
		> .monaco-dropdown
		> .dropdown-label
		.codicon[class*='codicon-'] {
		font-size: 12px;
		padding-left: 0;
		padding-right: 0;
		line-height: 16px;
		margin-left: -3px;
	}
	.monaco-dropdown-with-primary > .dropdown-action-container > .monaco-dropdown > .dropdown-label > .action-label {
		display: block;
		background-size: 16px;
		background-position: 50%;
		background-repeat: no-repeat;
	}
	.monaco-findInput {
		position: relative;
	}
	.monaco-findInput .monaco-inputbox {
		font-size: 13px;
		width: 100%;
	}
	.monaco-findInput > .controls {
		position: absolute;
		top: 3px;
		right: 2px;
	}
	.vs .monaco-findInput.disabled {
		background-color: #e1e1e1;
	}
	.vs-dark .monaco-findInput.disabled {
		background-color: #333;
	}
	.hc-light .monaco-findInput.highlight-0 .controls,
	.monaco-findInput.highlight-0 .controls {
		animation: monaco-findInput-highlight-0 0.1s linear 0s;
	}
	.hc-light .monaco-findInput.highlight-1 .controls,
	.monaco-findInput.highlight-1 .controls {
		animation: monaco-findInput-highlight-1 0.1s linear 0s;
	}
	.hc-black .monaco-findInput.highlight-0 .controls,
	.vs-dark .monaco-findInput.highlight-0 .controls {
		animation: monaco-findInput-highlight-dark-0 0.1s linear 0s;
	}
	.hc-black .monaco-findInput.highlight-1 .controls,
	.vs-dark .monaco-findInput.highlight-1 .controls {
		animation: monaco-findInput-highlight-dark-1 0.1s linear 0s;
	}
	@keyframes monaco-findInput-highlight-0 {
		0% {
			background: rgba(253, 255, 0, 0.8);
		}
		to {
			background: transparent;
		}
	}
	@keyframes monaco-findInput-highlight-1 {
		0% {
			background: rgba(253, 255, 0, 0.8);
		}
		99% {
			background: transparent;
		}
	}
	@keyframes monaco-findInput-highlight-dark-0 {
		0% {
			background: hsla(0, 0%, 100%, 0.44);
		}
		to {
			background: transparent;
		}
	}
	@keyframes monaco-findInput-highlight-dark-1 {
		0% {
			background: hsla(0, 0%, 100%, 0.44);
		}
		99% {
			background: transparent;
		}
	}
	.monaco-hover {
		cursor: default;
		position: absolute;
		overflow: hidden;
		z-index: 50;
		user-select: text;
		-webkit-user-select: text;
		box-sizing: initial;
		animation: fadein 0.1s linear;
		line-height: 1.5em;
	}
	.monaco-hover.hidden {
		display: none;
	}
	.monaco-hover a:hover:not(.disabled) {
		cursor: pointer;
	}
	.monaco-hover .hover-contents:not(.html-hover-contents) {
		padding: 4px 8px;
	}
	.monaco-hover .markdown-hover > .hover-contents:not(.code-hover-contents) {
		max-width: 500px;
		word-wrap: break-word;
	}
	.monaco-hover .markdown-hover > .hover-contents:not(.code-hover-contents) hr {
		min-width: 100%;
	}
	.monaco-hover .code,
	.monaco-hover h1,
	.monaco-hover h2,
	.monaco-hover h3,
	.monaco-hover h4,
	.monaco-hover h5,
	.monaco-hover h6,
	.monaco-hover p,
	.monaco-hover ul {
		margin: 8px 0;
	}
	.monaco-hover h1,
	.monaco-hover h2,
	.monaco-hover h3,
	.monaco-hover h4,
	.monaco-hover h5,
	.monaco-hover h6 {
		line-height: 1.1;
	}
	.monaco-hover code {
		font-family: var(--monaco-monospace-font);
	}
	.monaco-hover hr {
		box-sizing: border-box;
		border-left: 0;
		border-right: 0;
		margin: 4px -8px -4px;
		height: 1px;
	}
	.monaco-hover .code:first-child,
	.monaco-hover p:first-child,
	.monaco-hover ul:first-child {
		margin-top: 0;
	}
	.monaco-hover .code:last-child,
	.monaco-hover p:last-child,
	.monaco-hover ul:last-child {
		margin-bottom: 0;
	}
	.monaco-hover ol,
	.monaco-hover ul {
		padding-left: 20px;
	}
	.monaco-hover li > p {
		margin-bottom: 0;
	}
	.monaco-hover li > ul {
		margin-top: 0;
	}
	.monaco-hover code {
		border-radius: 3px;
		padding: 0 0.4em;
	}
	.monaco-hover .monaco-tokenized-source {
		white-space: pre-wrap;
	}
	.monaco-hover .hover-row.status-bar {
		font-size: 12px;
		line-height: 22px;
	}
	.monaco-hover .hover-row.status-bar .actions {
		display: flex;
		padding: 0 8px;
	}
	.monaco-hover .hover-row.status-bar .actions .action-container {
		margin-right: 16px;
		cursor: pointer;
	}
	.monaco-hover .hover-row.status-bar .actions .action-container .action .icon {
		padding-right: 4px;
	}
	.monaco-hover .markdown-hover .hover-contents .codicon {
		color: inherit;
		font-size: inherit;
		vertical-align: middle;
	}
	.monaco-hover .hover-contents a.code-link,
	.monaco-hover .hover-contents a.code-link:hover {
		color: inherit;
	}
	.monaco-hover .hover-contents a.code-link:before {
		content: '(';
	}
	.monaco-hover .hover-contents a.code-link:after {
		content: ')';
	}
	.monaco-hover .hover-contents a.code-link > span {
		text-decoration: underline;
		border-bottom: 1px solid transparent;
		text-underline-position: under;
		color: var(--vscode-textLink-foreground);
	}
	.monaco-hover .hover-contents a.code-link > span:hover {
		color: var(--vscode-textLink-activeForeground);
	}
	.monaco-hover .markdown-hover .hover-contents:not(.code-hover-contents):not(.html-hover-contents) span {
		margin-bottom: 4px;
		display: inline-block;
	}
	.monaco-hover-content .action-container a {
		-webkit-user-select: none;
		user-select: none;
	}
	.monaco-hover-content .action-container.disabled {
		pointer-events: none;
		opacity: 0.4;
		cursor: default;
	}
	.monaco-icon-label {
		display: flex;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.monaco-icon-label:before {
		background-size: 16px;
		background-position: 0;
		background-repeat: no-repeat;
		padding-right: 6px;
		width: 16px;
		height: 22px;
		line-height: inherit !important;
		display: inline-block;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		vertical-align: top;
		flex-shrink: 0;
	}
	.monaco-icon-label-container.disabled {
		color: var(--vscode-disabledForeground);
	}
	.monaco-icon-label > .monaco-icon-label-container {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
	}
	.monaco-icon-label > .monaco-icon-label-container > .monaco-icon-name-container > .label-name {
		color: inherit;
		white-space: pre;
	}
	.monaco-icon-label > .monaco-icon-label-container > .monaco-icon-name-container > .label-name > .label-separator {
		margin: 0 2px;
		opacity: 0.5;
	}
	.monaco-icon-label > .monaco-icon-label-container > .monaco-icon-description-container > .label-description {
		opacity: 0.7;
		margin-left: 0.5em;
		font-size: 0.9em;
		white-space: pre;
	}
	.monaco-icon-label.nowrap > .monaco-icon-label-container > .monaco-icon-description-container > .label-description {
		white-space: nowrap;
	}
	.vs .monaco-icon-label > .monaco-icon-label-container > .monaco-icon-description-container > .label-description {
		opacity: 0.95;
	}
	.monaco-icon-label.italic > .monaco-icon-label-container > .monaco-icon-description-container > .label-description,
	.monaco-icon-label.italic > .monaco-icon-label-container > .monaco-icon-name-container > .label-name {
		font-style: italic;
	}
	.monaco-icon-label.deprecated {
		text-decoration: line-through;
		opacity: 0.66;
	}
	.monaco-icon-label.italic:after {
		font-style: italic;
	}
	.monaco-icon-label.strikethrough
		> .monaco-icon-label-container
		> .monaco-icon-description-container
		> .label-description,
	.monaco-icon-label.strikethrough > .monaco-icon-label-container > .monaco-icon-name-container > .label-name {
		text-decoration: line-through;
	}
	.monaco-icon-label:after {
		opacity: 0.75;
		font-size: 90%;
		font-weight: 600;
		margin: auto 16px 0 5px;
		text-align: center;
	}
	.monaco-list:focus .selected .monaco-icon-label,
	.monaco-list:focus .selected .monaco-icon-label:after {
		color: inherit !important;
	}
	.monaco-list-row.focused.selected .label-description,
	.monaco-list-row.selected .label-description {
		opacity: 0.8;
	}
	.monaco-inputbox {
		position: relative;
		display: block;
		padding: 0;
		box-sizing: border-box;
		border-radius: 2px;
		font-size: inherit;
	}
	.monaco-inputbox > .ibwrapper > .input,
	.monaco-inputbox > .ibwrapper > .mirror {
		padding: 4px 6px;
	}
	.monaco-inputbox > .ibwrapper {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.monaco-inputbox > .ibwrapper > .input {
		display: inline-block;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		line-height: inherit;
		border: none;
		font-family: inherit;
		font-size: inherit;
		resize: none;
		color: inherit;
	}
	.monaco-inputbox > .ibwrapper > input {
		text-overflow: ellipsis;
	}
	.monaco-inputbox > .ibwrapper > textarea.input {
		display: block;
		scrollbar-width: none;
		outline: none;
	}
	.monaco-inputbox > .ibwrapper > textarea.input::-webkit-scrollbar {
		display: none;
	}
	.monaco-inputbox > .ibwrapper > textarea.input.empty {
		white-space: nowrap;
	}
	.monaco-inputbox > .ibwrapper > .mirror {
		position: absolute;
		display: inline-block;
		width: 100%;
		top: 0;
		left: 0;
		box-sizing: border-box;
		white-space: pre-wrap;
		visibility: hidden;
		word-wrap: break-word;
	}
	.monaco-inputbox-container {
		text-align: right;
	}
	.monaco-inputbox-container .monaco-inputbox-message {
		display: inline-block;
		overflow: hidden;
		text-align: left;
		width: 100%;
		box-sizing: border-box;
		padding: 0.4em;
		font-size: 12px;
		line-height: 17px;
		margin-top: -1px;
		word-wrap: break-word;
	}
	.monaco-inputbox .monaco-action-bar {
		position: absolute;
		right: 2px;
		top: 4px;
	}
	.monaco-inputbox .monaco-action-bar .action-item {
		margin-left: 2px;
	}
	.monaco-inputbox .monaco-action-bar .action-item .codicon {
		background-repeat: no-repeat;
		width: 16px;
		height: 16px;
	}
	.monaco-keybinding {
		display: flex;
		align-items: center;
		line-height: 10px;
	}
	.monaco-keybinding > .monaco-keybinding-key {
		display: inline-block;
		border-style: solid;
		border-width: 1px;
		border-radius: 3px;
		vertical-align: middle;
		font-size: 11px;
		padding: 3px 5px;
		margin: 0 2px;
	}
	.monaco-keybinding > .monaco-keybinding-key:first-child {
		margin-left: 0;
	}
	.monaco-keybinding > .monaco-keybinding-key:last-child {
		margin-right: 0;
	}
	.monaco-keybinding > .monaco-keybinding-key-separator {
		display: inline-block;
	}
	.monaco-keybinding > .monaco-keybinding-key-chord-separator {
		width: 6px;
	}
	.monaco-list {
		position: relative;
		height: 100%;
		width: 100%;
		white-space: nowrap;
	}
	.monaco-list.mouse-support {
		user-select: none;
		-webkit-user-select: none;
	}
	.monaco-list > .monaco-scrollable-element {
		height: 100%;
	}
	.monaco-list-rows {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.monaco-list.horizontal-scrolling .monaco-list-rows {
		width: auto;
		min-width: 100%;
	}
	.monaco-list-row {
		position: absolute;
		box-sizing: border-box;
		overflow: hidden;
		width: 100%;
	}
	.monaco-list.mouse-support .monaco-list-row {
		cursor: pointer;
		touch-action: none;
	}
	.monaco-list-row.scrolling {
		display: none !important;
	}
	.monaco-list.element-focused,
	.monaco-list.selection-multiple,
	.monaco-list.selection-single {
		outline: 0 !important;
	}
	.monaco-drag-image {
		display: inline-block;
		padding: 1px 7px;
		border-radius: 10px;
		font-size: 12px;
		position: absolute;
		z-index: 1000;
	}
	.monaco-list-type-filter-message {
		position: absolute;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		padding: 40px 1em 1em;
		text-align: center;
		white-space: normal;
		opacity: 0.7;
		pointer-events: none;
	}
	.monaco-list-type-filter-message:empty {
		display: none;
	}
	.monaco-mouse-cursor-text {
		cursor: text;
	}
	.monaco-progress-container {
		width: 100%;
		height: 5px;
		overflow: hidden;
	}
	.monaco-progress-container .progress-bit {
		width: 2%;
		height: 5px;
		position: absolute;
		left: 0;
		display: none;
	}
	.monaco-progress-container.active .progress-bit {
		display: inherit;
	}
	.monaco-progress-container.discrete .progress-bit {
		left: 0;
		transition: width 0.1s linear;
	}
	.monaco-progress-container.discrete.done .progress-bit {
		width: 100%;
	}
	.monaco-progress-container.infinite .progress-bit {
		animation-name: progress;
		animation-duration: 4s;
		animation-iteration-count: infinite;
		transform: translateZ(0);
		animation-timing-function: linear;
	}
	.monaco-progress-container.infinite.infinite-long-running .progress-bit {
		animation-timing-function: steps(100);
	}
	@keyframes progress {
		0% {
			transform: translateX(0) scaleX(1);
		}
		50% {
			transform: translateX(2500%) scaleX(3);
		}
		to {
			transform: translateX(4900%) scaleX(1);
		}
	}
	:root {
		--vscode-sash-size: 4px;
	}
	.monaco-sash {
		position: absolute;
		z-index: 35;
		touch-action: none;
	}
	.monaco-sash.disabled {
		pointer-events: none;
	}
	.monaco-sash.mac.vertical {
		cursor: col-resize;
	}
	.monaco-sash.vertical.minimum {
		cursor: e-resize;
	}
	.monaco-sash.vertical.maximum {
		cursor: w-resize;
	}
	.monaco-sash.mac.horizontal {
		cursor: row-resize;
	}
	.monaco-sash.horizontal.minimum {
		cursor: s-resize;
	}
	.monaco-sash.horizontal.maximum {
		cursor: n-resize;
	}
	.monaco-sash.disabled {
		cursor: default !important;
		pointer-events: none !important;
	}
	.monaco-sash.vertical {
		cursor: ew-resize;
		top: 0;
		width: var(--vscode-sash-size);
		height: 100%;
	}
	.monaco-sash.horizontal {
		cursor: ns-resize;
		left: 0;
		width: 100%;
		height: var(--vscode-sash-size);
	}
	.monaco-sash:not(.disabled) > .orthogonal-drag-handle {
		content: ' ';
		height: calc(var(--vscode-sash-size) * 2);
		width: calc(var(--vscode-sash-size) * 2);
		z-index: 100;
		display: block;
		cursor: all-scroll;
		position: absolute;
	}
	.monaco-sash.horizontal.orthogonal-edge-north:not(.disabled) > .orthogonal-drag-handle.start,
	.monaco-sash.horizontal.orthogonal-edge-south:not(.disabled) > .orthogonal-drag-handle.end {
		cursor: nwse-resize;
	}
	.monaco-sash.horizontal.orthogonal-edge-north:not(.disabled) > .orthogonal-drag-handle.end,
	.monaco-sash.horizontal.orthogonal-edge-south:not(.disabled) > .orthogonal-drag-handle.start {
		cursor: nesw-resize;
	}
	.monaco-sash.vertical > .orthogonal-drag-handle.start {
		left: calc(var(--vscode-sash-size) * -0.5);
		top: calc(var(--vscode-sash-size) * -1);
	}
	.monaco-sash.vertical > .orthogonal-drag-handle.end {
		left: calc(var(--vscode-sash-size) * -0.5);
		bottom: calc(var(--vscode-sash-size) * -1);
	}
	.monaco-sash.horizontal > .orthogonal-drag-handle.start {
		top: calc(var(--vscode-sash-size) * -0.5);
		left: calc(var(--vscode-sash-size) * -1);
	}
	.monaco-sash.horizontal > .orthogonal-drag-handle.end {
		top: calc(var(--vscode-sash-size) * -0.5);
		right: calc(var(--vscode-sash-size) * -1);
	}
	.monaco-sash:before {
		content: '';
		pointer-events: none;
		position: absolute;
		width: 100%;
		height: 100%;
		transition: background-color 0.1s ease-out;
		background: transparent;
	}
	.monaco-sash.active:before,
	.monaco-sash.hover:before {
		background: var(--vscode-sash-hoverBorder);
	}
	.monaco-sash.vertical:before {
		width: var(--vscode-sash-hover-size);
		left: calc(50% - var(--vscode-sash-hover-size) / 2);
	}
	.monaco-sash.horizontal:before {
		height: var(--vscode-sash-hover-size);
		top: calc(50% - var(--vscode-sash-hover-size) / 2);
	}
	.pointer-events-disabled {
		pointer-events: none !important;
	}
	.monaco-sash.debug {
		background: #0ff;
	}
	.monaco-sash.debug.disabled {
		background: rgba(0, 255, 255, 0.2);
	}
	.monaco-sash.debug:not(.disabled) > .orthogonal-drag-handle {
		background: red;
	}
	.monaco-scrollable-element > .scrollbar > .scra {
		cursor: pointer;
		font-size: 11px !important;
	}
	.monaco-scrollable-element > .visible {
		opacity: 1;
		background: transparent;
		transition: opacity 0.1s linear;
		z-index: 11;
	}
	.monaco-scrollable-element > .invisible {
		opacity: 0;
		pointer-events: none;
	}
	.monaco-scrollable-element > .invisible.fade {
		transition: opacity 0.8s linear;
	}
	.monaco-scrollable-element > .shadow {
		position: absolute;
		display: none;
	}
	.monaco-scrollable-element > .shadow.top {
		display: block;
		top: 0;
		left: 3px;
		height: 3px;
		width: 100%;
		box-shadow: var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset;
	}
	.monaco-scrollable-element > .shadow.left {
		display: block;
		top: 3px;
		left: 0;
		height: 100%;
		width: 3px;
		box-shadow: var(--vscode-scrollbar-shadow) 6px 0 6px -6px inset;
	}
	.monaco-scrollable-element > .shadow.top-left-corner {
		display: block;
		top: 0;
		left: 0;
		height: 3px;
		width: 3px;
	}
	.monaco-scrollable-element > .shadow.top.left {
		box-shadow: var(--vscode-scrollbar-shadow) 6px 0 6px -6px inset;
	}
	.monaco-scrollable-element > .scrollbar > .slider {
		background: var(--vscode-scrollbarSlider-background);
	}
	.monaco-scrollable-element > .scrollbar > .slider:hover {
		background: var(--vscode-scrollbarSlider-hoverBackground);
	}
	.monaco-scrollable-element > .scrollbar > .slider.active {
		background: var(--vscode-scrollbarSlider-activeBackground);
	}
	.monaco-select-box {
		width: 100%;
		cursor: pointer;
		border-radius: 2px;
	}
	.monaco-select-box-dropdown-container {
		font-size: 13px;
		font-weight: 400;
		text-transform: none;
	}
	.monaco-action-bar .action-item.select-container {
		cursor: default;
	}
	.monaco-action-bar .action-item .monaco-select-box {
		cursor: pointer;
		min-width: 100px;
		min-height: 18px;
		padding: 2px 23px 2px 8px;
	}
	.mac .monaco-action-bar .action-item .monaco-select-box {
		font-size: 11px;
		border-radius: 5px;
	}
	.monaco-select-box-dropdown-padding {
		--dropdown-padding-top: 1px;
		--dropdown-padding-bottom: 1px;
	}
	.hc-black .monaco-select-box-dropdown-padding,
	.hc-light .monaco-select-box-dropdown-padding {
		--dropdown-padding-top: 3px;
		--dropdown-padding-bottom: 4px;
	}
	.monaco-select-box-dropdown-container {
		display: none;
		box-sizing: border-box;
	}
	.monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown * {
		margin: 0;
	}
	.monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown a:focus {
		outline: 1px solid -webkit-focus-ring-color;
		outline-offset: -1px;
	}
	.monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown code {
		line-height: 15px;
		font-family: var(--monaco-monospace-font);
	}
	.monaco-select-box-dropdown-container.visible {
		display: flex;
		flex-direction: column;
		text-align: left;
		width: 1px;
		overflow: hidden;
		border-bottom-left-radius: 3px;
		border-bottom-right-radius: 3px;
	}
	.monaco-select-box-dropdown-container > .select-box-dropdown-list-container {
		flex: 0 0 auto;
		align-self: flex-start;
		padding-top: var(--dropdown-padding-top);
		padding-bottom: var(--dropdown-padding-bottom);
		padding-left: 1px;
		padding-right: 1px;
		width: 100%;
		overflow: hidden;
		box-sizing: border-box;
	}
	.monaco-select-box-dropdown-container > .select-box-details-pane {
		padding: 5px;
	}
	.hc-black .monaco-select-box-dropdown-container > .select-box-dropdown-list-container {
		padding-top: var(--dropdown-padding-top);
		padding-bottom: var(--dropdown-padding-bottom);
	}
	.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row {
		cursor: pointer;
	}
	.monaco-select-box-dropdown-container
		> .select-box-dropdown-list-container
		.monaco-list
		.monaco-list-row
		> .option-text {
		text-overflow: ellipsis;
		overflow: hidden;
		padding-left: 3.5px;
		white-space: nowrap;
		float: left;
	}
	.monaco-select-box-dropdown-container
		> .select-box-dropdown-list-container
		.monaco-list
		.monaco-list-row
		> .option-detail {
		text-overflow: ellipsis;
		overflow: hidden;
		padding-left: 3.5px;
		white-space: nowrap;
		float: left;
		opacity: 0.7;
	}
	.monaco-select-box-dropdown-container
		> .select-box-dropdown-list-container
		.monaco-list
		.monaco-list-row
		> .option-decorator-right {
		text-overflow: ellipsis;
		overflow: hidden;
		padding-right: 10px;
		white-space: nowrap;
		float: right;
	}
	.monaco-select-box-dropdown-container
		> .select-box-dropdown-list-container
		.monaco-list
		.monaco-list-row
		> .visually-hidden {
		position: absolute;
		left: -10000px;
		top: auto;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	.monaco-select-box-dropdown-container > .select-box-dropdown-container-width-control {
		flex: 1 1 auto;
		align-self: flex-start;
		opacity: 0;
	}
	.monaco-select-box-dropdown-container > .select-box-dropdown-container-width-control > .width-control-div {
		overflow: hidden;
		max-height: 0;
	}
	.monaco-select-box-dropdown-container
		> .select-box-dropdown-container-width-control
		> .width-control-div
		> .option-text-width-control {
		padding-left: 4px;
		padding-right: 8px;
		white-space: nowrap;
	}
	.monaco-split-view2 {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.monaco-split-view2 > .sash-container {
		position: absolute;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.monaco-split-view2 > .sash-container > .monaco-sash {
		pointer-events: auto;
	}
	.monaco-split-view2 > .monaco-scrollable-element {
		width: 100%;
		height: 100%;
	}
	.monaco-split-view2 > .monaco-scrollable-element > .split-view-container {
		width: 100%;
		height: 100%;
		white-space: nowrap;
		position: relative;
	}
	.monaco-split-view2 > .monaco-scrollable-element > .split-view-container > .split-view-view {
		white-space: normal;
		position: absolute;
	}
	.monaco-split-view2 > .monaco-scrollable-element > .split-view-container > .split-view-view:not(.visible) {
		display: none;
	}
	.monaco-split-view2.vertical > .monaco-scrollable-element > .split-view-container > .split-view-view {
		width: 100%;
	}
	.monaco-split-view2.horizontal > .monaco-scrollable-element > .split-view-container > .split-view-view {
		height: 100%;
	}
	.monaco-split-view2.separator-border
		> .monaco-scrollable-element
		> .split-view-container
		> .split-view-view:not(:first-child):before {
		content: ' ';
		position: absolute;
		top: 0;
		left: 0;
		z-index: 20;
		pointer-events: none;
		background-color: var(--separator-border);
	}
	.monaco-split-view2.separator-border.horizontal
		> .monaco-scrollable-element
		> .split-view-container
		> .split-view-view:not(:first-child):before {
		height: 100%;
		width: 1px;
	}
	.monaco-split-view2.separator-border.vertical
		> .monaco-scrollable-element
		> .split-view-container
		> .split-view-view:not(:first-child):before {
		height: 1px;
		width: 100%;
	}
	.monaco-table {
		display: flex;
		flex-direction: column;
		position: relative;
		height: 100%;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
	}
	.monaco-table > .monaco-split-view2 {
		border-bottom: 1px solid transparent;
	}
	.monaco-table > .monaco-list {
		flex: 1;
	}
	.monaco-table-tr {
		display: flex;
		height: 100%;
	}
	.monaco-table-th {
		width: 100%;
		height: 100%;
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.monaco-table-td,
	.monaco-table-th {
		box-sizing: border-box;
		flex-shrink: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.monaco-table > .monaco-split-view2 .monaco-sash.vertical:before {
		content: '';
		position: absolute;
		left: calc(var(--vscode-sash-size) / 2);
		width: 0;
		border-left: 1px solid transparent;
	}
	.monaco-workbench:not(.reduce-motion) .monaco-table > .monaco-split-view2,
	.monaco-workbench:not(.reduce-motion) .monaco-table > .monaco-split-view2 .monaco-sash.vertical:before {
		transition: border-color 0.2s ease-out;
	}
	.monaco-custom-toggle {
		margin-left: 2px;
		float: left;
		cursor: pointer;
		overflow: hidden;
		width: 20px;
		height: 20px;
		border-radius: 3px;
		border: 1px solid transparent;
		padding: 1px;
		box-sizing: border-box;
		user-select: none;
		-webkit-user-select: none;
	}
	.monaco-custom-toggle:hover {
		background-color: var(--vscode-inputOption-hoverBackground);
	}
	.hc-black .monaco-custom-toggle:hover,
	.hc-light .monaco-custom-toggle:hover {
		border: 1px dashed var(--vscode-focusBorder);
	}
	.hc-black .monaco-custom-toggle,
	.hc-black .monaco-custom-toggle:hover,
	.hc-light .monaco-custom-toggle,
	.hc-light .monaco-custom-toggle:hover {
		background: none;
	}
	.monaco-custom-toggle.monaco-checkbox {
		height: 18px;
		width: 18px;
		border: 1px solid transparent;
		border-radius: 3px;
		margin-right: 9px;
		margin-left: 0;
		padding: 0;
		opacity: 1;
		background-size: 16px !important;
	}
	.monaco-custom-toggle.monaco-checkbox:not(.checked):before {
		visibility: hidden;
	}
	.monaco-toolbar {
		height: 100%;
	}
	.monaco-toolbar .toolbar-toggle-more {
		display: inline-block;
		padding: 0;
	}
	.monaco-tl-row {
		display: flex;
		height: 100%;
		align-items: center;
		position: relative;
	}
	.monaco-tl-row.disabled {
		cursor: default;
	}
	.monaco-tl-indent {
		height: 100%;
		position: absolute;
		top: 0;
		left: 16px;
		pointer-events: none;
	}
	.hide-arrows .monaco-tl-indent {
		left: 12px;
	}
	.monaco-tl-indent > .indent-guide {
		display: inline-block;
		box-sizing: border-box;
		height: 100%;
		border-left: 1px solid transparent;
		transition: border-color 0.1s linear;
	}
	.monaco-tl-contents,
	.monaco-tl-twistie {
		height: 100%;
	}
	.monaco-tl-twistie {
		font-size: 10px;
		text-align: right;
		padding-right: 6px;
		flex-shrink: 0;
		width: 16px;
		display: flex !important;
		align-items: center;
		justify-content: center;
		transform: translateX(3px);
	}
	.monaco-tl-contents {
		flex: 1;
		overflow: hidden;
	}
	.monaco-tl-twistie:before {
		border-radius: 20px;
	}
	.monaco-tl-twistie.collapsed:before {
		transform: rotate(-90deg);
	}
	.monaco-tl-twistie.codicon-tree-item-loading:before {
		animation: codicon-spin 1.25s steps(30) infinite;
	}
	.monaco-tree-type-filter {
		position: absolute;
		top: 0;
		display: flex;
		padding: 3px;
		transition: top 0.3s;
		max-width: 200px;
		z-index: 100;
		margin: 0 6px;
	}
	.monaco-tree-type-filter.disabled {
		top: -40px !important;
	}
	.monaco-tree-type-filter-grab {
		display: flex !important;
		align-items: center;
		justify-content: center;
		cursor: grab;
		margin-right: 2px;
	}
	.monaco-tree-type-filter-grab.grabbing {
		cursor: grabbing;
	}
	.monaco-tree-type-filter-input {
		flex: 1;
	}
	.monaco-tree-type-filter-input .monaco-inputbox {
		height: 23px;
	}
	.monaco-tree-type-filter-input .monaco-inputbox > .ibwrapper > .input,
	.monaco-tree-type-filter-input .monaco-inputbox > .ibwrapper > .mirror {
		padding: 2px 4px;
	}
	.monaco-tree-type-filter-input .monaco-findInput > .controls {
		top: 2px;
	}
	.monaco-tree-type-filter-actionbar {
		margin-left: 4px;
	}
	.monaco-tree-type-filter-actionbar .monaco-action-bar .action-label {
		padding: 2px;
	}
	.monaco-editor .inputarea {
		min-width: 0;
		min-height: 0;
		margin: 0;
		padding: 0;
		position: absolute;
		outline: none !important;
		resize: none;
		border: none;
		overflow: hidden;
		color: transparent;
		background-color: transparent;
		z-index: -10;
	}
	.monaco-editor .inputarea.ime-input {
		z-index: 10;
		caret-color: var(--vscode-editorCursor-foreground);
		color: var(--vscode-editor-foreground);
	}
	.monaco-editor .blockDecorations-container {
		position: absolute;
		top: 0;
	}
	.monaco-editor .blockDecorations-block {
		position: absolute;
		box-sizing: border-box;
	}
	.monaco-editor .margin-view-overlays .current-line,
	.monaco-editor .view-overlays .current-line {
		display: block;
		position: absolute;
		left: 0;
		top: 0;
		box-sizing: border-box;
	}
	.monaco-editor .margin-view-overlays .current-line.current-line-margin.current-line-margin-both {
		border-right: 0;
	}
	.monaco-editor .lines-content .cdr {
		position: absolute;
	}
	.monaco-editor .glyph-margin {
		position: absolute;
		top: 0;
	}
	.monaco-editor .margin-view-overlays .cgmr {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.monaco-editor .lines-content .core-guide {
		position: absolute;
		box-sizing: border-box;
	}
	.monaco-editor .lines-content .core-guide-indent {
		box-shadow: 1px 0 0 0 var(--vscode-editorIndentGuide-background) inset;
	}
	.monaco-editor .lines-content .core-guide-indent-active {
		box-shadow: 1px 0 0 0 var(--vscode-editorIndentGuide-activeBackground, --vscode-editorIndentGuide-background) inset;
	}
	.monaco-editor .margin-view-overlays .line-numbers {
		font-variant-numeric: tabular-nums;
		position: absolute;
		text-align: right;
		display: inline-block;
		vertical-align: middle;
		box-sizing: border-box;
		cursor: default;
		height: 100%;
	}
	.monaco-editor .relative-current-line-number {
		text-align: left;
		display: inline-block;
		width: 100%;
	}
	.monaco-editor .margin-view-overlays .line-numbers.lh-odd {
		margin-top: 1px;
	}
	.monaco-editor .line-numbers {
		color: var(--vscode-editorLineNumber-foreground);
	}
	.monaco-editor .line-numbers.active-line-number {
		color: var(--vscode-editorLineNumber-activeForeground);
	}
	.mtkcontrol {
		color: #fff !important;
		background: #960000 !important;
	}
	.mtkoverflow {
		background-color: var(--vscode-button-background, --vscode-editor-background);
		color: var(--vscode-button-foreground, --vscode-editor-foreground);
		border: 1px solid var(--vscode-contrastBorder);
		border-radius: 2px;
		padding: 4px;
		cursor: pointer;
	}
	.mtkoverflow:hover {
		background-color: var(--vscode-button-hoverBackground);
	}
	.monaco-editor.no-user-select .lines-content,
	.monaco-editor.no-user-select .view-line,
	.monaco-editor.no-user-select .view-lines {
		user-select: none;
		-webkit-user-select: none;
	}
	.monaco-editor.mac .lines-content:hover,
	.monaco-editor.mac .view-line:hover,
	.monaco-editor.mac .view-lines:hover {
		user-select: text;
		-webkit-user-select: text;
		-ms-user-select: text;
	}
	.monaco-editor.enable-user-select {
		user-select: initial;
		-webkit-user-select: initial;
	}
	.monaco-editor .view-lines {
		white-space: nowrap;
	}
	.monaco-editor .view-line {
		position: absolute;
		width: 100%;
	}
	.monaco-editor .mtkw,
	.monaco-editor .mtkz {
		color: var(--vscode-editorWhitespace-foreground) !important;
	}
	.monaco-editor .mtkz {
		display: inline-block;
	}
	.monaco-editor .lines-decorations {
		position: absolute;
		top: 0;
		background: #fff;
	}
	.monaco-editor .margin-view-overlays .cldr {
		position: absolute;
		height: 100%;
	}
	.monaco-editor .margin {
		background-color: var(--vscode-editorGutter-background);
	}
	.monaco-editor .margin-view-overlays .cmdr {
		position: absolute;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.monaco-editor .minimap.slider-mouseover .minimap-slider {
		opacity: 0;
		transition: opacity 0.1s linear;
	}
	.monaco-editor .minimap.slider-mouseover .minimap-slider.active,
	.monaco-editor .minimap.slider-mouseover:hover .minimap-slider {
		opacity: 1;
	}
	.monaco-editor .minimap-slider .minimap-slider-horizontal {
		background: var(--vscode-minimapSlider-background);
	}
	.monaco-editor .minimap-slider:hover .minimap-slider-horizontal {
		background: var(--vscode-minimapSlider-hoverBackground);
	}
	.monaco-editor .minimap-slider.active .minimap-slider-horizontal {
		background: var(--vscode-minimapSlider-activeBackground);
	}
	.monaco-editor .minimap-shadow-visible {
		box-shadow: var(--vscode-scrollbar-shadow) -6px 0 6px -6px inset;
	}
	.monaco-editor .minimap-shadow-hidden {
		position: absolute;
		width: 0;
	}
	.monaco-editor .minimap-shadow-visible {
		position: absolute;
		left: -6px;
		width: 6px;
	}
	.monaco-editor.no-minimap-shadow .minimap-shadow-visible {
		position: absolute;
		left: -1px;
		width: 1px;
	}
	.minimap.autohide {
		opacity: 0;
		transition: opacity 0.5s;
	}
	.minimap.autohide:hover {
		opacity: 1;
	}
	.monaco-editor .overlayWidgets {
		position: absolute;
		top: 0;
		left: 0;
	}
	.monaco-editor .view-ruler {
		position: absolute;
		top: 0;
		box-shadow: 1px 0 0 0 var(--vscode-editorRuler-foreground) inset;
	}
	.monaco-editor .scroll-decoration {
		position: absolute;
		top: 0;
		left: 0;
		height: 6px;
		box-shadow: var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset;
	}
	.monaco-editor .lines-content .cslr {
		position: absolute;
	}
	.monaco-editor .focused .selected-text {
		background-color: var(--vscode-editor-selectionBackground);
	}
	.monaco-editor .selected-text {
		background-color: var(--vscode-editor-inactiveSelectionBackground);
	}
	.monaco-editor .top-left-radius {
		border-top-left-radius: 3px;
	}
	.monaco-editor .bottom-left-radius {
		border-bottom-left-radius: 3px;
	}
	.monaco-editor .top-right-radius {
		border-top-right-radius: 3px;
	}
	.monaco-editor .bottom-right-radius {
		border-bottom-right-radius: 3px;
	}
	.monaco-editor.hc-black .top-left-radius {
		border-top-left-radius: 0;
	}
	.monaco-editor.hc-black .bottom-left-radius {
		border-bottom-left-radius: 0;
	}
	.monaco-editor.hc-black .top-right-radius {
		border-top-right-radius: 0;
	}
	.monaco-editor.hc-black .bottom-right-radius {
		border-bottom-right-radius: 0;
	}
	.monaco-editor.hc-light .top-left-radius {
		border-top-left-radius: 0;
	}
	.monaco-editor.hc-light .bottom-left-radius {
		border-bottom-left-radius: 0;
	}
	.monaco-editor.hc-light .top-right-radius {
		border-top-right-radius: 0;
	}
	.monaco-editor.hc-light .bottom-right-radius {
		border-bottom-right-radius: 0;
	}
	.monaco-editor .cursors-layer {
		position: absolute;
		top: 0;
	}
	.monaco-editor .cursors-layer > .cursor {
		position: absolute;
		overflow: hidden;
		box-sizing: border-box;
	}
	.monaco-editor .cursors-layer.cursor-smooth-caret-animation > .cursor {
		transition: all 80ms;
	}
	.monaco-editor .cursors-layer.cursor-block-outline-style > .cursor {
		background: transparent !important;
		border-style: solid;
		border-width: 1px;
	}
	.monaco-editor .cursors-layer.cursor-underline-style > .cursor {
		border-bottom-width: 2px;
		border-bottom-style: solid;
		background: transparent !important;
	}
	.monaco-editor .cursors-layer.cursor-underline-thin-style > .cursor {
		border-bottom-width: 1px;
		border-bottom-style: solid;
		background: transparent !important;
	}
	@keyframes monaco-cursor-smooth {
		0%,
		20% {
			opacity: 1;
		}
		60%,
		to {
			opacity: 0;
		}
	}
	@keyframes monaco-cursor-phase {
		0%,
		20% {
			opacity: 1;
		}
		90%,
		to {
			opacity: 0;
		}
	}
	@keyframes monaco-cursor-expand {
		0%,
		20% {
			transform: scaleY(1);
		}
		80%,
		to {
			transform: scaleY(0);
		}
	}
	.cursor-smooth {
		animation: monaco-cursor-smooth 0.5s ease-in-out 0s 20 alternate;
	}
	.cursor-phase {
		animation: monaco-cursor-phase 0.5s ease-in-out 0s 20 alternate;
	}
	.cursor-expand > .cursor {
		animation: monaco-cursor-expand 0.5s ease-in-out 0s 20 alternate;
	}
	.monaco-editor .mwh {
		position: absolute;
		color: var(--vscode-editorWhitespace-foreground) !important;
	}
	.monaco-diff-editor .diffOverview {
		z-index: 9;
	}
	.monaco-diff-editor .diffOverview .diffViewport {
		z-index: 10;
	}
	.monaco-diff-editor.vs .diffOverview {
		background: rgba(0, 0, 0, 0.03);
	}
	.monaco-diff-editor.vs-dark .diffOverview {
		background: hsla(0, 0%, 100%, 0.01);
	}
	.monaco-scrollable-element.modified-in-monaco-diff-editor.vs-dark .scrollbar,
	.monaco-scrollable-element.modified-in-monaco-diff-editor.vs .scrollbar {
		background: transparent;
	}
	.monaco-scrollable-element.modified-in-monaco-diff-editor.hc-black .scrollbar,
	.monaco-scrollable-element.modified-in-monaco-diff-editor.hc-light .scrollbar {
		background: none;
	}
	.monaco-scrollable-element.modified-in-monaco-diff-editor .slider {
		z-index: 10;
	}
	.modified-in-monaco-diff-editor .slider.active {
		background: hsla(0, 0%, 67.1%, 0.4);
	}
	.modified-in-monaco-diff-editor.hc-black .slider.active,
	.modified-in-monaco-diff-editor.hc-light .slider.active {
		background: none;
	}
	.monaco-diff-editor .delete-sign,
	.monaco-diff-editor .insert-sign,
	.monaco-editor .delete-sign,
	.monaco-editor .insert-sign {
		font-size: 11px !important;
		opacity: 0.7 !important;
		display: flex !important;
		align-items: center;
	}
	.monaco-diff-editor.hc-black .delete-sign,
	.monaco-diff-editor.hc-black .insert-sign,
	.monaco-diff-editor.hc-light .delete-sign,
	.monaco-diff-editor.hc-light .insert-sign,
	.monaco-editor.hc-black .delete-sign,
	.monaco-editor.hc-black .insert-sign,
	.monaco-editor.hc-light .delete-sign,
	.monaco-editor.hc-light .insert-sign {
		opacity: 1;
	}
	.monaco-editor .inline-added-margin-view-zone,
	.monaco-editor .inline-deleted-margin-view-zone {
		text-align: right;
	}
	.monaco-editor .arrow-revert-change {
		z-index: 10;
		position: absolute;
	}
	.monaco-editor .arrow-revert-change:hover {
		cursor: pointer;
	}
	.monaco-editor .view-zones .view-lines .view-line span {
		display: inline-block;
	}
	.monaco-editor .margin-view-zones .lightbulb-glyph:hover {
		cursor: pointer;
	}
	.monaco-diff-editor .char-insert,
	.monaco-editor .char-insert {
		background-color: var(--vscode-diffEditor-insertedTextBackground);
	}
	.monaco-diff-editor .line-insert,
	.monaco-editor .line-insert {
		background-color: var(--vscode-diffEditor-insertedLineBackground, --vscode-diffEditor-insertedTextBackground);
	}
	.monaco-editor .char-insert,
	.monaco-editor .line-insert {
		box-sizing: border-box;
		border: 1px solid var(--vscode-diffEditor-insertedTextBorder);
	}
	.monaco-editor.hc-black .char-insert,
	.monaco-editor.hc-black .line-insert,
	.monaco-editor.hc-light .char-insert,
	.monaco-editor.hc-light .line-insert {
		border-style: dashed;
	}
	.monaco-editor .char-delete,
	.monaco-editor .line-delete {
		box-sizing: border-box;
		border: 1px solid var(--vscode-diffEditor-removedTextBorder);
	}
	.monaco-editor.hc-black .char-delete,
	.monaco-editor.hc-black .line-delete,
	.monaco-editor.hc-light .char-delete,
	.monaco-editor.hc-light .line-delete {
		border-style: dashed;
	}
	.monaco-diff-editor .gutter-insert,
	.monaco-editor .gutter-insert,
	.monaco-editor .inline-added-margin-view-zone {
		background-color: var(
			--vscode-diffEditorGutter-insertedLineBackground,
			--vscode-diffEditor-insertedLineBackground,
			--vscode-diffEditor-insertedTextBackground
		);
	}
	.monaco-diff-editor .char-delete,
	.monaco-editor .char-delete {
		background-color: var(--vscode-diffEditor-removedTextBackground);
	}
	.monaco-diff-editor .line-delete,
	.monaco-editor .line-delete {
		background-color: var(--vscode-diffEditor-removedLineBackground, --vscode-diffEditor-removedTextBackground);
	}
	.monaco-diff-editor .gutter-delete,
	.monaco-editor .gutter-delete,
	.monaco-editor .inline-deleted-margin-view-zone {
		background-color: var(
			--vscode-diffEditorGutter-removedLineBackground,
			--vscode-diffEditor-removedLineBackground,
			--vscode-diffEditor-removedTextBackground
		);
	}
	.monaco-diff-editor.side-by-side .editor.modified {
		box-shadow: -6px 0 5px -5px var(--vscode-scrollbar-shadow);
		border-left: 1px solid var(--vscode-diffEditor-border);
	}
	.monaco-diff-editor .diffViewport {
		background: var(--vscode-scrollbarSlider-background);
	}
	.monaco-diff-editor .diffViewport:hover {
		background: var(--vscode-scrollbarSlider-hoverBackground);
	}
	.monaco-diff-editor .diffViewport:active {
		background: var(--vscode-scrollbarSlider-activeBackground);
	}
	.monaco-diff-editor .diff-review-line-number {
		text-align: right;
		display: inline-block;
		color: var(--vscode-editorLineNumber-foreground);
	}
	.monaco-diff-editor .diff-review {
		position: absolute;
		user-select: none;
		-webkit-user-select: none;
	}
	.monaco-diff-editor .diff-review-summary {
		padding-left: 10px;
	}
	.monaco-diff-editor .diff-review-shadow {
		position: absolute;
		box-shadow: var(--vscode-scrollbar-shadow) 0 -6px 6px -6px inset;
	}
	.monaco-diff-editor .diff-review-row {
		white-space: pre;
	}
	.monaco-diff-editor .diff-review-table {
		display: table;
		min-width: 100%;
	}
	.monaco-diff-editor .diff-review-row {
		display: table-row;
		width: 100%;
	}
	.monaco-diff-editor .diff-review-spacer {
		display: inline-block;
		width: 10px;
		vertical-align: middle;
	}
	.monaco-diff-editor .diff-review-spacer > .codicon {
		font-size: 9px !important;
	}
	.monaco-diff-editor .diff-review-actions {
		display: inline-block;
		position: absolute;
		right: 10px;
		top: 2px;
	}
	.monaco-diff-editor .diff-review-actions .action-label {
		width: 16px;
		height: 16px;
		margin: 2px 0;
	}
	::-ms-clear {
		display: none;
	}
	.monaco-editor .editor-widget input {
		color: inherit;
	}
	.monaco-editor {
		position: relative;
		overflow: visible;
		-webkit-text-size-adjust: 100%;
		color: var(--vscode-editor-foreground);
	}
	.monaco-editor,
	.monaco-editor-background {
		background-color: var(--vscode-editor-background);
	}
	.monaco-editor .rangeHighlight {
		background-color: var(--vscode-editor-rangeHighlightBackground);
		box-sizing: border-box;
		border: 1px solid var(--vscode-editor-rangeHighlightBorder);
	}
	.monaco-editor.hc-black .rangeHighlight,
	.monaco-editor.hc-light .rangeHighlight {
		border-style: dotted;
	}
	.monaco-editor .symbolHighlight {
		background-color: var(--vscode-editor-symbolHighlightBackground);
		box-sizing: border-box;
		border: 1px solid var(--vscode-editor-symbolHighlightBorder);
	}
	.monaco-editor.hc-black .symbolHighlight,
	.monaco-editor.hc-light .symbolHighlight {
		border-style: dotted;
	}
	.monaco-editor .overflow-guard {
		position: relative;
		overflow: hidden;
	}
	.monaco-editor .view-overlays {
		position: absolute;
		top: 0;
	}
	.monaco-editor .squiggly-error {
		border-bottom: 4px double var(--vscode-editorError-border);
	}
	.monaco-editor .squiggly-error:before {
		display: block;
		content: '';
		width: 100%;
		height: 100%;
		background: var(--vscode-editorError-background);
	}
	.monaco-editor .squiggly-warning {
		border-bottom: 4px double var(--vscode-editorWarning-border);
	}
	.monaco-editor .squiggly-warning:before {
		display: block;
		content: '';
		width: 100%;
		height: 100%;
		background: var(--vscode-editorWarning-background);
	}
	.monaco-editor .squiggly-info {
		border-bottom: 4px double var(--vscode-editorInfo-border);
	}
	.monaco-editor .squiggly-info:before {
		display: block;
		content: '';
		width: 100%;
		height: 100%;
		background: var(--vscode-editorInfo-background);
	}
	.monaco-editor .squiggly-hint {
		border-bottom: 2px dotted var(--vscode-editorHint-border);
	}
	.monaco-editor.showUnused .squiggly-unnecessary {
		border-bottom: 2px dashed var(--vscode-editorUnnecessaryCode-border);
	}
	.monaco-editor.showDeprecated .squiggly-inline-deprecated {
		text-decoration: line-through;
		text-decoration-color: var(--vscode-editor-foreground, inherit);
	}
	.monaco-editor .selection-anchor {
		background-color: #007acc;
		width: 2px !important;
	}
	.monaco-editor .bracket-match {
		box-sizing: border-box;
		background-color: var(--vscode-editorBracketMatch-background);
		border: 1px solid var(--vscode-editorBracketMatch-border);
	}
	.monaco-editor .lightBulbWidget {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.monaco-editor .lightBulbWidget:hover {
		cursor: pointer;
	}
	.monaco-editor .lightBulbWidget.codicon-light-bulb {
		color: var(--vscode-editorLightBulb-foreground);
	}
	.monaco-editor .lightBulbWidget.codicon-lightbulb-autofix {
		color: var(--vscode-editorLightBulbAutoFix-foreground, var(--vscode-editorLightBulb-foreground));
	}
	.monaco-editor .lightBulbWidget:before {
		position: relative;
		z-index: 2;
	}
	.monaco-editor .lightBulbWidget:after {
		position: absolute;
		top: 0;
		left: 0;
		content: '';
		display: block;
		width: 100%;
		height: 100%;
		opacity: 0.3;
		background-color: var(--vscode-editor-background);
		z-index: 1;
	}
	.monaco-editor .codelens-decoration {
		overflow: hidden;
		display: inline-block;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--vscode-editorCodeLens-foreground);
		line-height: var(--vscode-editorCodeLens-lineHeight);
		font-size: var(--vscode-editorCodeLens-fontSize);
		padding-right: calc(var(--vscode-editorCodeLens-fontSize) * 0.5);
		font-feature-settings: var(--vscode-editorCodeLens-fontFeatureSettings);
		font-family: var(--vscode-editorCodeLens-fontFamily), var(--vscode-editorCodeLens-fontFamilyDefault);
	}
	.monaco-editor .codelens-decoration > a,
	.monaco-editor .codelens-decoration > span {
		user-select: none;
		-webkit-user-select: none;
		white-space: nowrap;
		vertical-align: sub;
	}
	.monaco-editor .codelens-decoration > a {
		text-decoration: none;
	}
	.monaco-editor .codelens-decoration > a:hover {
		cursor: pointer;
	}
	.monaco-editor .codelens-decoration > a:hover,
	.monaco-editor .codelens-decoration > a:hover .codicon {
		color: var(--vscode-editorLink-activeForeground) !important;
	}
	.monaco-editor .codelens-decoration .codicon {
		vertical-align: middle;
		color: currentColor !important;
		color: var(--vscode-editorCodeLens-foreground);
		line-height: var(--vscode-editorCodeLens-lineHeight);
		font-size: var(--vscode-editorCodeLens-fontSize);
	}
	.monaco-editor .codelens-decoration > a:hover .codicon:before {
		cursor: pointer;
	}
	@keyframes fadein {
		0% {
			opacity: 0;
			visibility: visible;
		}
		to {
			opacity: 1;
		}
	}
	.monaco-editor .codelens-decoration.fadein {
		animation: fadein 0.1s linear;
	}
	.colorpicker-widget {
		height: 190px;
		user-select: none;
		-webkit-user-select: none;
	}
	.colorpicker-color-decoration,
	.hc-light .colorpicker-color-decoration {
		border: 0.1em solid #000;
		box-sizing: border-box;
		margin: 0.1em 0.2em 0;
		width: 0.8em;
		height: 0.8em;
		line-height: 0.8em;
		display: inline-block;
		cursor: pointer;
	}
	.hc-black .colorpicker-color-decoration,
	.vs-dark .colorpicker-color-decoration {
		border: 0.1em solid #eee;
	}
	.colorpicker-header {
		display: flex;
		height: 24px;
		position: relative;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII=);
		background-size: 9px 9px;
		image-rendering: pixelated;
	}
	.colorpicker-header .picked-color {
		width: 216px;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 24px;
		cursor: pointer;
		color: #fff;
		flex: 1;
	}
	.colorpicker-header .picked-color .codicon {
		color: inherit;
		font-size: 14px;
		position: absolute;
		left: 8px;
	}
	.colorpicker-header .picked-color.light {
		color: #000;
	}
	.colorpicker-header .original-color {
		width: 74px;
		z-index: inherit;
		cursor: pointer;
	}
	.colorpicker-body {
		display: flex;
		padding: 8px;
		position: relative;
	}
	.colorpicker-body .saturation-wrap {
		overflow: hidden;
		height: 150px;
		position: relative;
		min-width: 220px;
		flex: 1;
	}
	.colorpicker-body .saturation-box {
		height: 150px;
		position: absolute;
	}
	.colorpicker-body .saturation-selection {
		width: 9px;
		height: 9px;
		margin: -5px 0 0 -5px;
		border: 1px solid #fff;
		border-radius: 100%;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
		position: absolute;
	}
	.colorpicker-body .strip {
		width: 25px;
		height: 150px;
	}
	.colorpicker-body .hue-strip {
		position: relative;
		margin-left: 8px;
		cursor: grab;
		background: linear-gradient(180deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red);
	}
	.colorpicker-body .opacity-strip {
		position: relative;
		margin-left: 8px;
		cursor: grab;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII=);
		background-size: 9px 9px;
		image-rendering: pixelated;
	}
	.colorpicker-body .strip.grabbing {
		cursor: grabbing;
	}
	.colorpicker-body .slider {
		position: absolute;
		top: 0;
		left: -2px;
		width: calc(100% + 4px);
		height: 4px;
		box-sizing: border-box;
		border: 1px solid hsla(0, 0%, 100%, 0.71);
		box-shadow: 0 0 1px rgba(0, 0, 0, 0.85);
	}
	.colorpicker-body .strip .overlay {
		height: 150px;
		pointer-events: none;
	}
	.monaco-editor.hc-light .dnd-target,
	.monaco-editor.vs .dnd-target {
		border-right: 2px dotted #000;
		color: #fff;
	}
	.monaco-editor.vs-dark .dnd-target {
		border-right: 2px dotted #aeafad;
		color: #51504f;
	}
	.monaco-editor.hc-black .dnd-target {
		border-right: 2px dotted #fff;
		color: #000;
	}
	.monaco-editor.hc-black.mac.mouse-default .view-lines,
	.monaco-editor.hc-light.mac.mouse-default .view-lines,
	.monaco-editor.mouse-default .view-lines,
	.monaco-editor.vs-dark.mac.mouse-default .view-lines {
		cursor: default;
	}
	.monaco-editor.hc-black.mac.mouse-copy .view-lines,
	.monaco-editor.hc-light.mac.mouse-copy .view-lines,
	.monaco-editor.mouse-copy .view-lines,
	.monaco-editor.vs-dark.mac.mouse-copy .view-lines {
		cursor: copy;
	}
	.monaco-editor .findOptionsWidget {
		background-color: var(--vscode-editorWidget-background);
		color: var(--vscode-editorWidget-foreground);
		box-shadow: 0 0 8px 2px var(--vscode-widget-shadow);
		border: 2px solid var(--vscode-contrastBorder);
	}
	.monaco-editor .find-widget {
		position: absolute;
		z-index: 35;
		height: 33px;
		overflow: hidden;
		line-height: 19px;
		transition: transform 0.2s linear;
		padding: 0 4px;
		box-sizing: border-box;
		transform: translateY(calc(-100% - 10px));
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
	}
	.monaco-workbench.reduce-motion .monaco-editor .find-widget {
		transition: transform 0ms linear;
	}
	.monaco-editor .find-widget textarea {
		margin: 0;
	}
	.monaco-editor .find-widget.hiddenEditor {
		display: none;
	}
	.monaco-editor .find-widget.replaceToggled > .replace-part {
		display: flex;
	}
	.monaco-editor .find-widget.visible {
		transform: translateY(0);
	}
	.monaco-editor .find-widget .monaco-inputbox.synthetic-focus {
		outline: 1px solid -webkit-focus-ring-color;
		outline-offset: -1px;
	}
	.monaco-editor .find-widget .monaco-inputbox .input {
		background-color: transparent;
		min-height: 0;
	}
	.monaco-editor .find-widget .monaco-findInput .input {
		font-size: 13px;
	}
	.monaco-editor .find-widget > .find-part,
	.monaco-editor .find-widget > .replace-part {
		margin: 3px 0 0 17px;
		font-size: 12px;
		display: flex;
	}
	.monaco-editor .find-widget > .find-part .monaco-inputbox,
	.monaco-editor .find-widget > .replace-part .monaco-inputbox {
		min-height: 25px;
	}
	.monaco-editor .find-widget > .replace-part .monaco-inputbox > .ibwrapper > .mirror {
		padding-right: 22px;
	}
	.monaco-editor .find-widget > .find-part .monaco-inputbox > .ibwrapper > .input,
	.monaco-editor .find-widget > .find-part .monaco-inputbox > .ibwrapper > .mirror,
	.monaco-editor .find-widget > .replace-part .monaco-inputbox > .ibwrapper > .input,
	.monaco-editor .find-widget > .replace-part .monaco-inputbox > .ibwrapper > .mirror {
		padding-top: 2px;
		padding-bottom: 2px;
	}
	.monaco-editor .find-widget > .find-part .find-actions,
	.monaco-editor .find-widget > .replace-part .replace-actions {
		height: 25px;
		display: flex;
		align-items: center;
	}
	.monaco-editor .find-widget .monaco-findInput {
		vertical-align: middle;
		display: flex;
		flex: 1;
	}
	.monaco-editor .find-widget .monaco-findInput .monaco-scrollable-element {
		width: 100%;
	}
	.monaco-editor .find-widget .monaco-findInput .monaco-scrollable-element .scrollbar.vertical {
		opacity: 0;
	}
	.monaco-editor .find-widget .matchesCount {
		display: flex;
		flex: initial;
		margin: 0 0 0 3px;
		padding: 2px 0 0 2px;
		height: 25px;
		vertical-align: middle;
		box-sizing: border-box;
		text-align: center;
		line-height: 23px;
	}
	.monaco-editor .find-widget .button {
		width: 16px;
		height: 16px;
		padding: 3px;
		border-radius: 5px;
		flex: initial;
		margin-left: 3px;
		background-position: 50%;
		background-repeat: no-repeat;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.monaco-editor .find-widget .codicon-find-selection {
		width: 22px;
		height: 22px;
		padding: 3px;
		border-radius: 5px;
	}
	.monaco-editor .find-widget .button.left {
		margin-left: 0;
		margin-right: 3px;
	}
	.monaco-editor .find-widget .button.wide {
		width: auto;
		padding: 1px 6px;
		top: -1px;
	}
	.monaco-editor .find-widget .button.toggle {
		position: absolute;
		top: 0;
		left: 3px;
		width: 18px;
		height: 100%;
		border-radius: 0;
		box-sizing: border-box;
	}
	.monaco-editor .find-widget .button.toggle.disabled {
		display: none;
	}
	.monaco-editor .find-widget .disabled {
		color: var(--vscode-disabledForeground);
		cursor: default;
	}
	.monaco-editor .find-widget > .replace-part {
		display: none;
	}
	.monaco-editor .find-widget > .replace-part > .monaco-findInput {
		position: relative;
		display: flex;
		vertical-align: middle;
		flex: auto;
		flex-grow: 0;
		flex-shrink: 0;
	}
	.monaco-editor .find-widget > .replace-part > .monaco-findInput > .controls {
		position: absolute;
		top: 3px;
		right: 2px;
	}
	.monaco-editor .find-widget.reduced-find-widget .matchesCount {
		display: none;
	}
	.monaco-editor .find-widget.narrow-find-widget {
		max-width: 257px !important;
	}
	.monaco-editor .find-widget.collapsed-find-widget {
		max-width: 170px !important;
	}
	.monaco-editor .find-widget.collapsed-find-widget .button.next,
	.monaco-editor .find-widget.collapsed-find-widget .button.previous,
	.monaco-editor .find-widget.collapsed-find-widget .button.replace,
	.monaco-editor .find-widget.collapsed-find-widget .button.replace-all,
	.monaco-editor .find-widget.collapsed-find-widget > .find-part .monaco-findInput .controls {
		display: none;
	}
	.monaco-editor .findMatch {
		animation-duration: 0;
		animation-name: inherit !important;
	}
	.monaco-editor .find-widget .monaco-sash {
		left: 0 !important;
	}
	.monaco-editor.hc-black .find-widget .button:before {
		position: relative;
		top: 1px;
		left: 2px;
	}
	.monaco-editor .margin-view-overlays .codicon-folding-collapsed,
	.monaco-editor .margin-view-overlays .codicon-folding-expanded,
	.monaco-editor .margin-view-overlays .codicon-folding-manual-collapsed,
	.monaco-editor .margin-view-overlays .codicon-folding-manual-expanded {
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.5s;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 140%;
		margin-left: 2px;
	}
	.monaco-editor .margin-view-overlays .codicon.alwaysShowFoldIcons,
	.monaco-editor .margin-view-overlays .codicon.codicon-folding-collapsed,
	.monaco-editor .margin-view-overlays .codicon.codicon-folding-manual-collapsed,
	.monaco-editor .margin-view-overlays:hover .codicon {
		opacity: 1;
	}
	.monaco-editor .inline-folded:after {
		color: grey;
		margin: 0.1em 0.2em 0;
		content: '\22EF';
		display: inline;
		line-height: 1em;
		cursor: pointer;
	}
	.monaco-editor .folded-background {
		background-color: var(--vscode-editor-foldBackground);
	}
	.monaco-editor .cldr.codicon.codicon-folding-collapsed,
	.monaco-editor .cldr.codicon.codicon-folding-expanded,
	.monaco-editor .cldr.codicon.codicon-folding-manual-collapsed,
	.monaco-editor .cldr.codicon.codicon-folding-manual-expanded {
		color: var(--vscode-editorGutter-foldingControlForeground) !important;
	}
	.monaco-editor .peekview-widget .head .peekview-title .severity-icon {
		display: inline-block;
		vertical-align: text-top;
		margin-right: 4px;
	}
	.monaco-editor .marker-widget {
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.monaco-editor .marker-widget > .stale {
		opacity: 0.6;
		font-style: italic;
	}
	.monaco-editor .marker-widget .title {
		display: inline-block;
		padding-right: 5px;
	}
	.monaco-editor .marker-widget .descriptioncontainer {
		position: absolute;
		white-space: pre;
		user-select: text;
		-webkit-user-select: text;
		padding: 8px 12px 0 20px;
	}
	.monaco-editor .marker-widget .descriptioncontainer .message {
		display: flex;
		flex-direction: column;
	}
	.monaco-editor .marker-widget .descriptioncontainer .message .details {
		padding-left: 6px;
	}
	.monaco-editor .marker-widget .descriptioncontainer .message .source,
	.monaco-editor .marker-widget .descriptioncontainer .message span.code {
		opacity: 0.6;
	}
	.monaco-editor .marker-widget .descriptioncontainer .message a.code-link {
		opacity: 0.6;
		color: inherit;
	}
	.monaco-editor .marker-widget .descriptioncontainer .message a.code-link:before {
		content: '(';
	}
	.monaco-editor .marker-widget .descriptioncontainer .message a.code-link:after {
		content: ')';
	}
	.monaco-editor .marker-widget .descriptioncontainer .message a.code-link > span {
		text-decoration: underline;
		border-bottom: 1px solid transparent;
		text-underline-position: under;
		color: var(--vscode-textLink-foreground);
		color: var(--vscode-textLink-activeForeground);
	}
	.monaco-editor .marker-widget .descriptioncontainer .filename {
		cursor: pointer;
	}
	.monaco-editor .goto-definition-link {
		text-decoration: underline;
		cursor: pointer;
		color: var(--vscode-editorLink-activeForeground) !important;
	}
	.monaco-editor .zone-widget .zone-widget-container.reference-zone-widget {
		border-top-width: 1px;
		border-bottom-width: 1px;
	}
	.monaco-editor .reference-zone-widget .inline {
		display: inline-block;
		vertical-align: top;
	}
	.monaco-editor .reference-zone-widget .messages {
		height: 100%;
		width: 100%;
		text-align: center;
		padding: 3em 0;
	}
	.monaco-editor .reference-zone-widget .ref-tree {
		line-height: 23px;
		background-color: var(--vscode-peekViewResult-background);
		color: var(--vscode-peekViewResult-lineForeground);
	}
	.monaco-editor .reference-zone-widget .ref-tree .reference {
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.monaco-editor .reference-zone-widget .ref-tree .reference-file {
		display: inline-flex;
		width: 100%;
		height: 100%;
		color: var(--vscode-peekViewResult-fileForeground);
	}
	.monaco-editor .reference-zone-widget .ref-tree .monaco-list:focus .selected .reference-file {
		color: inherit !important;
	}
	.monaco-editor
		.reference-zone-widget
		.ref-tree
		.monaco-list:focus
		.monaco-list-rows
		> .monaco-list-row.selected:not(.highlighted) {
		background-color: var(--vscode-peekViewResult-selectionBackground);
		color: var(--vscode-peekViewResult-selectionForeground) !important;
	}
	.monaco-editor .reference-zone-widget .ref-tree .reference-file .count {
		margin-right: 12px;
		margin-left: auto;
	}
	.monaco-editor .reference-zone-widget .ref-tree .referenceMatch .highlight {
		background-color: var(--vscode-peekViewResult-matchHighlightBackground);
	}
	.monaco-editor .reference-zone-widget .preview .reference-decoration {
		background-color: var(--vscode-peekViewEditor-matchHighlightBackground);
		border: 2px solid var(--vscode-peekViewEditor-matchHighlightBorder);
		box-sizing: border-box;
	}
	.monaco-editor .reference-zone-widget .preview .monaco-editor .inputarea.ime-input,
	.monaco-editor .reference-zone-widget .preview .monaco-editor .monaco-editor-background {
		background-color: var(--vscode-peekViewEditor-background);
	}
	.monaco-editor .reference-zone-widget .preview .monaco-editor .margin {
		background-color: var(--vscode-peekViewEditorGutter-background);
	}
	.monaco-editor.hc-black .reference-zone-widget .ref-tree .reference-file,
	.monaco-editor.hc-light .reference-zone-widget .ref-tree .reference-file {
		font-weight: 700;
	}
	.monaco-editor.hc-black .reference-zone-widget .ref-tree .referenceMatch .highlight,
	.monaco-editor.hc-light .reference-zone-widget .ref-tree .referenceMatch .highlight {
		border: 1px dotted var(--vscode-contrastActiveBorder, transparent);
		box-sizing: border-box;
	}
	.monaco-editor .hoverHighlight {
		background-color: var(--vscode-editor-hoverHighlightBackground);
	}
	.monaco-editor .monaco-hover {
		color: var(--vscode-editorHoverWidget-foreground);
		background-color: var(--vscode-editorHoverWidget-background);
		border: 1px solid var(--vscode-editorHoverWidget-border);
	}
	.monaco-editor .monaco-hover a {
		color: var(--vscode-textLink-foreground);
	}
	.monaco-editor .monaco-hover a:hover {
		color: var(--vscode-textLink-activeForeground);
	}
	.monaco-editor .monaco-hover .hover-row .actions {
		background-color: var(--vscode-editorHoverWidget-statusBarBackground);
	}
	.monaco-editor .monaco-hover code {
		background-color: var(--vscode-textCodeBlock-background);
	}
	.monaco-editor.vs .valueSetReplacement {
		outline: solid 2px var(--vscode-editorBracketMatch-border);
	}
	.monaco-editor .suggest-preview-additional-widget {
		white-space: nowrap;
	}
	.monaco-editor .suggest-preview-additional-widget .content-spacer {
		color: transparent;
		white-space: pre;
	}
	.monaco-editor .suggest-preview-additional-widget .button {
		display: inline-block;
		cursor: pointer;
		text-decoration: underline;
		text-underline-position: under;
	}
	.monaco-editor .ghost-text-hidden {
		opacity: 0;
		font-size: 0;
	}
	.monaco-editor .ghost-text-decoration,
	.monaco-editor .suggest-preview-text {
		font-style: italic;
	}
	.monaco-editor .inline-completion-text-to-replace {
		text-decoration: underline;
		text-underline-position: under;
	}
	.monaco-editor .ghost-text-decoration,
	.monaco-editor .ghost-text-decoration-preview,
	.monaco-editor .suggest-preview-text .ghost-text {
		color: var(--vscode-editorGhostText-foreground) !important;
		background-color: var(--vscode-editorGhostText-background);
		border: 1px solid var(--vscode-editorGhostText-border);
	}
	.monaco-editor .inlineSuggestionsHints.withBorder {
		z-index: 39;
		color: var(--vscode-editor-hoverForeground);
		background-color: var(--vscode-editorHoverWidget-background);
		border: 1px solid var(--vscode-editorHoverWidget-border);
	}
	.monaco-editor .inlineSuggestionsHints a,
	.monaco-editor .inlineSuggestionsHints a:hover {
		color: var(--vscode-foreground);
	}
	.monaco-editor .inlineSuggestionsHints .keybinding {
		display: flex;
		margin-left: 4px;
		opacity: 0.6;
	}
	.monaco-editor .inlineSuggestionsHints .keybinding .monaco-keybinding-key {
		font-size: 8px;
		padding: 2px 3px;
	}
	.monaco-editor .inlineSuggestionsHints .custom-actions .action-item:nth-child(2) a {
		display: flex;
		min-width: 19px;
		justify-content: center;
	}
	.monaco-editor .inlineSuggestionStatusBarItemLabel {
		margin-right: 2px;
	}
	.monaco-editor .linked-editing-decoration {
		background-color: var(--vscode-editor-linkedEditingBackground);
		border-left-color: var(--vscode-editor-linkedEditingBackground);
	}
	.monaco-editor .detected-link,
	.monaco-editor .detected-link-active {
		text-decoration: underline;
		text-underline-position: under;
	}
	.monaco-editor .detected-link-active {
		cursor: pointer;
		color: var(--vscode-editorLink-activeForeground) !important;
	}
	.monaco-editor .monaco-editor-overlaymessage {
		padding-bottom: 8px;
		z-index: 10000;
	}
	.monaco-editor .monaco-editor-overlaymessage.below {
		padding-bottom: 0;
		padding-top: 8px;
		z-index: 10000;
	}
	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.monaco-editor .monaco-editor-overlaymessage.fadeIn {
		animation: fadeIn 0.15s ease-out;
	}
	@keyframes fadeOut {
		0% {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
	.monaco-editor .monaco-editor-overlaymessage.fadeOut {
		animation: fadeOut 0.1s ease-out;
	}
	.monaco-editor .monaco-editor-overlaymessage .message {
		padding: 1px 4px;
		color: var(--vscode-inputValidation-infoForeground);
		background-color: var(--vscode-inputValidation-infoBackground);
		border: 1px solid var(--vscode-inputValidation-infoBorder);
	}
	.monaco-editor.hc-black .monaco-editor-overlaymessage .message,
	.monaco-editor.hc-light .monaco-editor-overlaymessage .message {
		border-width: 2px;
	}
	.monaco-editor .monaco-editor-overlaymessage .anchor {
		width: 0 !important;
		height: 0 !important;
		z-index: 1000;
		border: 8px solid transparent;
		position: absolute;
	}
	.monaco-editor .monaco-editor-overlaymessage .anchor.top {
		border-bottom-color: var(--vscode-inputValidation-infoBorder);
	}
	.monaco-editor .monaco-editor-overlaymessage .anchor.below {
		border-top-color: var(--vscode-inputValidation-infoBorder);
	}
	.monaco-editor .monaco-editor-overlaymessage.below .anchor.below,
	.monaco-editor .monaco-editor-overlaymessage:not(.below) .anchor.top {
		display: none;
	}
	.monaco-editor .monaco-editor-overlaymessage.below .anchor.top {
		display: inherit;
		top: -8px;
	}
	.monaco-editor .parameter-hints-widget {
		z-index: 39;
		display: flex;
		flex-direction: column;
		line-height: 1.5em;
		cursor: default;
		color: var(--vscode-editor-hoverForeground);
		background-color: var(--vscode-editorHoverWidget-background);
		border: 1px solid var(--vscode-editorHoverWidget-border);
	}
	.hc-black .monaco-editor .parameter-hints-widget,
	.hc-light .monaco-editor .parameter-hints-widget {
		border-width: 2px;
	}
	.monaco-editor .parameter-hints-widget > .phwrapper {
		max-width: 440px;
		display: flex;
		flex-direction: row;
	}
	.monaco-editor .parameter-hints-widget.multiple {
		min-height: 3.3em;
		padding: 0;
	}
	.monaco-editor .parameter-hints-widget.multiple .body:before {
		content: '';
		display: block;
		height: 100%;
		position: absolute;
		opacity: 0.5;
		border-left: 1px solid var(--vscode-editorHoverWidget-border);
	}
	.monaco-editor .parameter-hints-widget p,
	.monaco-editor .parameter-hints-widget ul {
		margin: 8px 0;
	}
	.monaco-editor .parameter-hints-widget .body,
	.monaco-editor .parameter-hints-widget .monaco-scrollable-element {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-height: 100%;
	}
	.monaco-editor .parameter-hints-widget .signature {
		padding: 4px 5px;
		position: relative;
	}
	.monaco-editor .parameter-hints-widget .signature.has-docs:after {
		content: '';
		display: block;
		position: absolute;
		left: 0;
		width: 100%;
		padding-top: 4px;
		opacity: 0.5;
		border-bottom: 1px solid var(--vscode-editorHoverWidget-border);
	}
	.monaco-editor .parameter-hints-widget .docs {
		padding: 0 10px 0 5px;
		white-space: pre-wrap;
	}
	.monaco-editor .parameter-hints-widget .docs.empty {
		display: none;
	}
	.monaco-editor .parameter-hints-widget .docs a {
		color: var(--vscode-textLink-foreground);
	}
	.monaco-editor .parameter-hints-widget .docs a:hover {
		color: var(--vscode-textLink-activeForeground);
		cursor: pointer;
	}
	.monaco-editor .parameter-hints-widget .docs .markdown-docs {
		white-space: normal;
	}
	.monaco-editor .parameter-hints-widget .docs code {
		font-family: var(--monaco-monospace-font);
		border-radius: 3px;
		padding: 0 0.4em;
		background-color: var(--vscode-textCodeBlock-background);
	}
	.monaco-editor .parameter-hints-widget .docs .code,
	.monaco-editor .parameter-hints-widget .docs .monaco-tokenized-source {
		white-space: pre-wrap;
	}
	.monaco-editor .parameter-hints-widget .controls {
		display: none;
		flex-direction: column;
		align-items: center;
		min-width: 22px;
		justify-content: flex-end;
	}
	.monaco-editor .parameter-hints-widget.multiple .controls {
		display: flex;
		padding: 0 2px;
	}
	.monaco-editor .parameter-hints-widget.multiple .button {
		width: 16px;
		height: 16px;
		background-repeat: no-repeat;
		cursor: pointer;
	}
	.monaco-editor .parameter-hints-widget .button.previous {
		bottom: 24px;
	}
	.monaco-editor .parameter-hints-widget .overloads {
		text-align: center;
		height: 12px;
		line-height: 12px;
		font-family: var(--monaco-monospace-font);
	}
	.monaco-editor .parameter-hints-widget .signature .parameter.active {
		color: var(--vscode-editorHoverWidget-highlightForeground);
		font-weight: 700;
	}
	.monaco-editor .parameter-hints-widget .documentation-parameter > .parameter {
		font-weight: 700;
		margin-right: 0.5em;
	}
	.monaco-editor .peekview-widget .head {
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		flex-wrap: nowrap;
	}
	.monaco-editor .peekview-widget .head .peekview-title {
		display: flex;
		align-items: baseline;
		font-size: 13px;
		margin-left: 20px;
		min-width: 0;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.monaco-editor .peekview-widget .head .peekview-title.clickable {
		cursor: pointer;
	}
	.monaco-editor .peekview-widget .head .peekview-title .dirname:not(:empty) {
		font-size: 0.9em;
		margin-left: 0.5em;
	}
	.monaco-editor .peekview-widget .head .peekview-title .dirname,
	.monaco-editor .peekview-widget .head .peekview-title .filename,
	.monaco-editor .peekview-widget .head .peekview-title .meta {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.monaco-editor .peekview-widget .head .peekview-title .meta:not(:empty):before {
		content: '-';
		padding: 0 0.3em;
	}
	.monaco-editor .peekview-widget .head .peekview-actions {
		flex: 1;
		text-align: right;
		padding-right: 2px;
	}
	.monaco-editor .peekview-widget .head .peekview-actions > .monaco-action-bar {
		display: inline-block;
	}
	.monaco-editor .peekview-widget .head .peekview-actions > .monaco-action-bar,
	.monaco-editor .peekview-widget .head .peekview-actions > .monaco-action-bar > .actions-container {
		height: 100%;
	}
	.monaco-editor .peekview-widget > .body {
		border-top: 1px solid;
		position: relative;
	}
	.monaco-editor .peekview-widget .head .peekview-title .codicon {
		margin-right: 4px;
		align-self: center;
	}
	.monaco-editor .peekview-widget .monaco-list .monaco-list-row.focused .codicon {
		color: inherit !important;
	}
	.monaco-editor .rename-box {
		z-index: 100;
		color: inherit;
		border-radius: 4px;
	}
	.monaco-editor .rename-box.preview {
		padding: 4px 4px 0;
	}
	.monaco-editor .rename-box .rename-input {
		padding: 3px;
		border-radius: 2px;
	}
	.monaco-editor .rename-box .rename-label {
		display: none;
		opacity: 0.8;
	}
	.monaco-editor .rename-box.preview .rename-label {
		display: inherit;
	}
	.monaco-editor .snippet-placeholder {
		min-width: 2px;
		outline-style: solid;
		outline-width: 1px;
		background-color: var(--vscode-editor-snippetTabstopHighlightBackground, transparent);
		outline-color: var(--vscode-editor-snippetTabstopHighlightBorder, transparent);
	}
	.monaco-editor .finish-snippet-placeholder {
		outline-style: solid;
		outline-width: 1px;
		background-color: var(--vscode-editor-snippetFinalTabstopHighlightBackground, transparent);
		outline-color: var(--vscode-editor-snippetFinalTabstopHighlightBorder, transparent);
	}
	.monaco-editor .sticky-line {
		color: var(--vscode-editorLineNumber-foreground);
		overflow: hidden;
		white-space: nowrap;
		display: inline-block;
	}
	.monaco-editor .sticky-line-number {
		text-align: right;
		float: left;
	}
	.monaco-editor .sticky-line-root {
		background-color: inherit;
		overflow: hidden;
		white-space: nowrap;
		width: 100%;
	}
	.monaco-editor.hc-black .sticky-widget,
	.monaco-editor.hc-light .sticky-widget {
		border-bottom: 1px solid var(--vscode-contrastBorder);
	}
	.monaco-editor .sticky-line-root:hover {
		background-color: var(--vscode-editorStickyScrollHover-background);
		cursor: pointer;
	}
	.monaco-editor .sticky-widget {
		width: 100%;
		box-shadow: var(--vscode-scrollbar-shadow) 0 3px 2px -2px;
		z-index: 11;
		background-color: var(--vscode-editorStickyScroll-background);
	}
	.monaco-editor .sticky-widget.peek {
		background-color: var(--vscode-peekViewEditorStickyScroll-background);
	}
	.monaco-editor .suggest-widget {
		width: 430px;
		z-index: 40;
		display: flex;
		flex-direction: column;
	}
	.monaco-editor .suggest-widget.message {
		flex-direction: row;
		align-items: center;
	}
	.monaco-editor .suggest-details,
	.monaco-editor .suggest-widget {
		flex: 0 1 auto;
		width: 100%;
		border: 1px solid var(--vscode-editorSuggestWidget-border);
		background-color: var(--vscode-editorSuggestWidget-background);
	}
	.monaco-editor.hc-black .suggest-details,
	.monaco-editor.hc-black .suggest-widget,
	.monaco-editor.hc-light .suggest-details,
	.monaco-editor.hc-light .suggest-widget {
		border-width: 2px;
	}
	.monaco-editor .suggest-widget .suggest-status-bar {
		box-sizing: border-box;
		display: none;
		flex-flow: row nowrap;
		justify-content: space-between;
		width: 100%;
		font-size: 80%;
		padding: 0 4px;
		border-top: 1px solid var(--vscode-editorSuggestWidget-border);
		overflow: hidden;
	}
	.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar {
		display: flex;
	}
	.monaco-editor .suggest-widget .suggest-status-bar .left {
		padding-right: 8px;
	}
	.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar .action-label {
		color: var(--vscode-editorSuggestWidgetStatus-foreground);
	}
	.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar .action-item:not(:last-of-type) .action-label {
		margin-right: 0;
	}
	.monaco-editor
		.suggest-widget.with-status-bar
		.suggest-status-bar
		.action-item:not(:last-of-type)
		.action-label:after {
		content: ', ';
		margin-right: 0.3em;
	}
	.monaco-editor
		.suggest-widget.with-status-bar
		.monaco-list
		.monaco-list-row.focused.string-label
		> .contents
		> .main
		> .right
		> .readMore,
	.monaco-editor
		.suggest-widget.with-status-bar
		.monaco-list
		.monaco-list-row
		> .contents
		> .main
		> .right
		> .readMore {
		display: none;
	}
	.monaco-editor
		.suggest-widget.with-status-bar:not(.docs-side)
		.monaco-list
		.monaco-list-row:hover
		> .contents
		> .main
		> .right.can-expand-details
		> .details-label {
		width: 100%;
	}
	.monaco-editor .suggest-widget > .message {
		padding-left: 22px;
	}
	.monaco-editor .suggest-widget > .tree {
		height: 100%;
		width: 100%;
	}
	.monaco-editor .suggest-widget .monaco-list {
		user-select: none;
		-webkit-user-select: none;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row {
		display: flex;
		-mox-box-sizing: border-box;
		box-sizing: border-box;
		padding-right: 10px;
		background-repeat: no-repeat;
		background-position: 2px 2px;
		white-space: nowrap;
		cursor: pointer;
		touch-action: none;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused {
		color: var(--vscode-editorSuggestWidget-selectedForeground);
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused .codicon {
		color: var(--vscode-editorSuggestWidget-selectedIconForeground);
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents {
		flex: 1;
		height: 100%;
		overflow: hidden;
		padding-left: 2px;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main {
		display: flex;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: pre;
		justify-content: space-between;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left,
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right {
		display: flex;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row:not(.focused) > .contents > .main .monaco-icon-label {
		color: var(--vscode-editorSuggestWidget-foreground);
	}
	.monaco-editor .suggest-widget:not(.frozen) .monaco-highlighted-label .highlight {
		font-weight: 700;
	}
	.monaco-editor
		.suggest-widget
		.monaco-list
		.monaco-list-row
		> .contents
		> .main
		.monaco-highlighted-label
		.highlight {
		color: var(--vscode-editorSuggestWidget-highlightForeground);
	}
	.monaco-editor
		.suggest-widget
		.monaco-list
		.monaco-list-row.focused
		> .contents
		> .main
		.monaco-highlighted-label
		.highlight {
		color: var(--vscode-editorSuggestWidget-focusHighlightForeground);
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .header > .codicon-close,
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .readMore:before {
		color: inherit;
		opacity: 1;
		font-size: 14px;
		cursor: pointer;
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .header > .codicon-close {
		position: absolute;
		top: 6px;
		right: 2px;
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .header > .codicon-close:hover,
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .readMore:hover {
		opacity: 1;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .details-label {
		opacity: 0.7;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left > .signature-label {
		overflow: hidden;
		text-overflow: ellipsis;
		opacity: 0.6;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left > .qualifier-label {
		margin-left: 12px;
		opacity: 0.4;
		font-size: 85%;
		line-height: normal;
		text-overflow: ellipsis;
		overflow: hidden;
		align-self: center;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .details-label {
		font-size: 85%;
		margin-left: 1.1em;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.monaco-editor
		.suggest-widget
		.monaco-list
		.monaco-list-row
		> .contents
		> .main
		> .right
		> .details-label
		> .monaco-tokenized-source {
		display: inline;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .details-label {
		display: none;
	}
	.monaco-editor
		.suggest-widget.docs-side
		.monaco-list
		.monaco-list-row.focused:not(.string-label)
		> .contents
		> .main
		> .right
		> .details-label,
	.monaco-editor
		.suggest-widget
		.monaco-list
		.monaco-list-row:not(.string-label)
		> .contents
		> .main
		> .right
		> .details-label,
	.monaco-editor
		.suggest-widget:not(.shows-details)
		.monaco-list
		.monaco-list-row.focused
		> .contents
		> .main
		> .right
		> .details-label {
		display: inline;
	}
	.monaco-editor
		.suggest-widget:not(.docs-side)
		.monaco-list
		.monaco-list-row.focused:hover
		> .contents
		> .main
		> .right.can-expand-details
		> .details-label {
		width: calc(100% - 26px);
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left {
		flex-shrink: 1;
		flex-grow: 1;
		overflow: hidden;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left > .monaco-icon-label {
		flex-shrink: 0;
	}
	.monaco-editor
		.suggest-widget
		.monaco-list
		.monaco-list-row:not(.string-label)
		> .contents
		> .main
		> .left
		> .monaco-icon-label {
		max-width: 100%;
	}
	.monaco-editor
		.suggest-widget
		.monaco-list
		.monaco-list-row.string-label
		> .contents
		> .main
		> .left
		> .monaco-icon-label {
		flex-shrink: 1;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right {
		overflow: hidden;
		flex-shrink: 4;
		max-width: 70%;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .readMore {
		display: inline-block;
		position: absolute;
		right: 10px;
		width: 18px;
		height: 18px;
		visibility: hidden;
	}
	.monaco-editor .suggest-widget.docs-side .monaco-list .monaco-list-row > .contents > .main > .right > .readMore {
		display: none !important;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row.string-label > .contents > .main > .right > .readMore {
		display: none;
	}
	.monaco-editor
		.suggest-widget
		.monaco-list
		.monaco-list-row.focused.string-label
		> .contents
		> .main
		> .right
		> .readMore {
		display: inline-block;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused:hover > .contents > .main > .right > .readMore {
		visibility: visible;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row .monaco-icon-label.deprecated {
		opacity: 0.66;
		text-decoration: unset;
	}
	.monaco-editor
		.suggest-widget
		.monaco-list
		.monaco-list-row
		.monaco-icon-label.deprecated
		> .monaco-icon-label-container
		> .monaco-icon-name-container {
		text-decoration: line-through;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row .monaco-icon-label:before {
		height: 100%;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row .icon {
		display: block;
		height: 16px;
		width: 16px;
		margin-left: 2px;
		background-repeat: no-repeat;
		background-size: 80%;
		background-position: 50%;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row .icon.hide {
		display: none;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row .suggest-icon {
		display: flex;
		align-items: center;
		margin-right: 4px;
	}
	.monaco-editor .suggest-widget.no-icons .monaco-list .monaco-list-row .icon,
	.monaco-editor .suggest-widget.no-icons .monaco-list .monaco-list-row .suggest-icon:before {
		display: none;
	}
	.monaco-editor .suggest-widget .monaco-list .monaco-list-row .icon.customcolor .colorspan {
		margin: 0 0 0 0.3em;
		border: 0.1em solid #000;
		width: 0.7em;
		height: 0.7em;
		display: inline-block;
	}
	.monaco-editor .suggest-details-container {
		z-index: 41;
	}
	.monaco-editor .suggest-details {
		display: flex;
		flex-direction: column;
		cursor: default;
		color: var(--vscode-editorSuggestWidget-foreground);
	}
	.monaco-editor .suggest-details.focused {
		border-color: var(--vscode-focusBorder);
	}
	.monaco-editor .suggest-details a {
		color: var(--vscode-textLink-foreground);
	}
	.monaco-editor .suggest-details a:hover {
		color: var(--vscode-textLink-activeForeground);
	}
	.monaco-editor .suggest-details code {
		background-color: var(--vscode-textCodeBlock-background);
	}
	.monaco-editor .suggest-details.no-docs {
		display: none;
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element {
		flex: 1;
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body {
		box-sizing: border-box;
		height: 100%;
		width: 100%;
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .header > .type {
		flex: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		opacity: 0.7;
		white-space: pre;
		margin: 0 24px 0 0;
		padding: 4px 0 12px 5px;
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .header > .type.auto-wrap {
		white-space: normal;
		word-break: break-all;
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs {
		margin: 0;
		padding: 4px 5px;
		white-space: pre-wrap;
	}
	.monaco-editor .suggest-details.no-type > .monaco-scrollable-element > .body > .docs {
		margin-right: 24px;
		overflow: hidden;
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs {
		padding: 0;
		white-space: normal;
		min-height: calc(1rem + 8px);
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs > div,
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs > span:not(:empty) {
		padding: 4px 5px;
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs > div > p:first-child {
		margin-top: 0;
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs > div > p:last-child {
		margin-bottom: 0;
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs .monaco-tokenized-source {
		white-space: pre;
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs .code {
		white-space: pre-wrap;
		word-wrap: break-word;
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs .codicon {
		vertical-align: sub;
	}
	.monaco-editor .suggest-details > .monaco-scrollable-element > .body > p:empty {
		display: none;
	}
	.monaco-editor .suggest-details code {
		border-radius: 3px;
		padding: 0 0.4em;
	}
	.monaco-editor .suggest-details ol,
	.monaco-editor .suggest-details ul {
		padding-left: 20px;
	}
	.monaco-editor .suggest-details p code {
		font-family: var(--monaco-monospace-font);
	}
	.monaco-editor .codicon.codicon-symbol-array,
	.monaco-workbench .codicon.codicon-symbol-array {
		color: var(--vscode-symbolIcon-arrayForeground);
	}
	.monaco-editor .codicon.codicon-symbol-boolean,
	.monaco-workbench .codicon.codicon-symbol-boolean {
		color: var(--vscode-symbolIcon-booleanForeground);
	}
	.monaco-editor .codicon.codicon-symbol-class,
	.monaco-workbench .codicon.codicon-symbol-class {
		color: var(--vscode-symbolIcon-classForeground);
	}
	.monaco-editor .codicon.codicon-symbol-method,
	.monaco-workbench .codicon.codicon-symbol-method {
		color: var(--vscode-symbolIcon-methodForeground);
	}
	.monaco-editor .codicon.codicon-symbol-color,
	.monaco-workbench .codicon.codicon-symbol-color {
		color: var(--vscode-symbolIcon-colorForeground);
	}
	.monaco-editor .codicon.codicon-symbol-constant,
	.monaco-workbench .codicon.codicon-symbol-constant {
		color: var(--vscode-symbolIcon-constantForeground);
	}
	.monaco-editor .codicon.codicon-symbol-constructor,
	.monaco-workbench .codicon.codicon-symbol-constructor {
		color: var(--vscode-symbolIcon-constructorForeground);
	}
	.monaco-editor .codicon.codicon-symbol-enum,
	.monaco-editor .codicon.codicon-symbol-value,
	.monaco-workbench .codicon.codicon-symbol-enum,
	.monaco-workbench .codicon.codicon-symbol-value {
		color: var(--vscode-symbolIcon-enumeratorForeground);
	}
	.monaco-editor .codicon.codicon-symbol-enum-member,
	.monaco-workbench .codicon.codicon-symbol-enum-member {
		color: var(--vscode-symbolIcon-enumeratorMemberForeground);
	}
	.monaco-editor .codicon.codicon-symbol-event,
	.monaco-workbench .codicon.codicon-symbol-event {
		color: var(--vscode-symbolIcon-eventForeground);
	}
	.monaco-editor .codicon.codicon-symbol-field,
	.monaco-workbench .codicon.codicon-symbol-field {
		color: var(--vscode-symbolIcon-fieldForeground);
	}
	.monaco-editor .codicon.codicon-symbol-file,
	.monaco-workbench .codicon.codicon-symbol-file {
		color: var(--vscode-symbolIcon-fileForeground);
	}
	.monaco-editor .codicon.codicon-symbol-folder,
	.monaco-workbench .codicon.codicon-symbol-folder {
		color: var(--vscode-symbolIcon-folderForeground);
	}
	.monaco-editor .codicon.codicon-symbol-function,
	.monaco-workbench .codicon.codicon-symbol-function {
		color: var(--vscode-symbolIcon-functionForeground);
	}
	.monaco-editor .codicon.codicon-symbol-interface,
	.monaco-workbench .codicon.codicon-symbol-interface {
		color: var(--vscode-symbolIcon-interfaceForeground);
	}
	.monaco-editor .codicon.codicon-symbol-key,
	.monaco-workbench .codicon.codicon-symbol-key {
		color: var(--vscode-symbolIcon-keyForeground);
	}
	.monaco-editor .codicon.codicon-symbol-keyword,
	.monaco-workbench .codicon.codicon-symbol-keyword {
		color: var(--vscode-symbolIcon-keywordForeground);
	}
	.monaco-editor .codicon.codicon-symbol-module,
	.monaco-workbench .codicon.codicon-symbol-module {
		color: var(--vscode-symbolIcon-moduleForeground);
	}
	.monaco-editor .codicon.codicon-symbol-namespace,
	.monaco-workbench .codicon.codicon-symbol-namespace {
		color: var(--vscode-symbolIcon-namespaceForeground);
	}
	.monaco-editor .codicon.codicon-symbol-null,
	.monaco-workbench .codicon.codicon-symbol-null {
		color: var(--vscode-symbolIcon-nullForeground);
	}
	.monaco-editor .codicon.codicon-symbol-number,
	.monaco-workbench .codicon.codicon-symbol-number {
		color: var(--vscode-symbolIcon-numberForeground);
	}
	.monaco-editor .codicon.codicon-symbol-object,
	.monaco-workbench .codicon.codicon-symbol-object {
		color: var(--vscode-symbolIcon-objectForeground);
	}
	.monaco-editor .codicon.codicon-symbol-operator,
	.monaco-workbench .codicon.codicon-symbol-operator {
		color: var(--vscode-symbolIcon-operatorForeground);
	}
	.monaco-editor .codicon.codicon-symbol-package,
	.monaco-workbench .codicon.codicon-symbol-package {
		color: var(--vscode-symbolIcon-packageForeground);
	}
	.monaco-editor .codicon.codicon-symbol-property,
	.monaco-workbench .codicon.codicon-symbol-property {
		color: var(--vscode-symbolIcon-propertyForeground);
	}
	.monaco-editor .codicon.codicon-symbol-reference,
	.monaco-workbench .codicon.codicon-symbol-reference {
		color: var(--vscode-symbolIcon-referenceForeground);
	}
	.monaco-editor .codicon.codicon-symbol-snippet,
	.monaco-workbench .codicon.codicon-symbol-snippet {
		color: var(--vscode-symbolIcon-snippetForeground);
	}
	.monaco-editor .codicon.codicon-symbol-string,
	.monaco-workbench .codicon.codicon-symbol-string {
		color: var(--vscode-symbolIcon-stringForeground);
	}
	.monaco-editor .codicon.codicon-symbol-struct,
	.monaco-workbench .codicon.codicon-symbol-struct {
		color: var(--vscode-symbolIcon-structForeground);
	}
	.monaco-editor .codicon.codicon-symbol-text,
	.monaco-workbench .codicon.codicon-symbol-text {
		color: var(--vscode-symbolIcon-textForeground);
	}
	.monaco-editor .codicon.codicon-symbol-type-parameter,
	.monaco-workbench .codicon.codicon-symbol-type-parameter {
		color: var(--vscode-typeParameterForeground);
	}
	.monaco-editor .codicon.codicon-symbol-unit,
	.monaco-workbench .codicon.codicon-symbol-unit {
		color: var(--vscode-symbolIcon-unitForeground);
	}
	.monaco-editor .codicon.codicon-symbol-variable,
	.monaco-workbench .codicon.codicon-symbol-variable {
		color: var(--vscode-symbolIcon-variableForeground);
	}
	.editor-banner {
		box-sizing: border-box;
		cursor: default;
		width: 100%;
		font-size: 12px;
		display: flex;
		overflow: visible;
		height: 26px;
		background: var(--vscode-banner-background);
	}
	.editor-banner .icon-container {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		padding: 0 6px 0 10px;
	}
	.editor-banner .icon-container.custom-icon {
		background-repeat: no-repeat;
		background-position: 50%;
		background-size: 16px;
		width: 16px;
		padding: 0;
		margin: 0 6px 0 10px;
	}
	.editor-banner .message-container {
		display: flex;
		align-items: center;
		line-height: 26px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.editor-banner .message-container p {
		margin-block-start: 0;
		margin-block-end: 0;
	}
	.editor-banner .message-actions-container {
		flex-grow: 1;
		flex-shrink: 0;
		line-height: 26px;
		margin: 0 4px;
	}
	.editor-banner .message-actions-container a.monaco-button {
		width: inherit;
		margin: 2px 8px;
		padding: 0 12px;
	}
	.editor-banner .message-actions-container a {
		padding: 3px;
		margin-left: 12px;
		text-decoration: underline;
	}
	.editor-banner .action-container {
		padding: 0 10px 0 6px;
	}
	.editor-banner {
		background-color: var(--vscode-banner-background);
	}
	.editor-banner,
	.editor-banner .action-container .codicon,
	.editor-banner .message-actions-container .monaco-link {
		color: var(--vscode-banner-foreground);
	}
	.editor-banner .icon-container .codicon {
		color: var(--vscode-banner-iconForeground);
	}
	.monaco-editor .unicode-highlight {
		border: 1px solid var(--vscode-editorUnicodeHighlight-border);
		background-color: var(--vscode-editorUnicodeHighlight-background);
		box-sizing: border-box;
	}
	.monaco-editor .focused .selectionHighlight {
		background-color: var(--vscode-editor-selectionHighlightBackground);
		box-sizing: border-box;
		border: 1px solid var(--vscode-editor-selectionHighlightBorder);
	}
	.monaco-editor.hc-black .focused .selectionHighlight,
	.monaco-editor.hc-light .focused .selectionHighlight {
		border-style: dotted;
	}
	.monaco-editor .wordHighlight {
		background-color: var(--vscode-editor-wordHighlightBackground);
		box-sizing: border-box;
		border: 1px solid var(--vscode-editor-wordHighlightBorder);
	}
	.monaco-editor.hc-black .wordHighlight,
	.monaco-editor.hc-light .wordHighlight {
		border-style: dotted;
	}
	.monaco-editor .wordHighlightStrong {
		background-color: var(--vscode-editor-wordHighlightStrongBackground);
		box-sizing: border-box;
		border: 1px solid var(--vscode-editor-wordHighlightStrongBorder);
	}
	.monaco-editor.hc-black .wordHighlightStrong,
	.monaco-editor.hc-light .wordHighlightStrong {
		border-style: dotted;
	}
	.monaco-editor .wordHighlightText {
		background-color: var(--vscode-editor-wordHighlightTextBackground);
		box-sizing: border-box;
		border: 1px solid var(--vscode-editor-wordHighlightTextBorder);
	}
	.monaco-editor.hc-black .wordHighlightText,
	.monaco-editor.hc-light .wordHighlightText {
		border-style: dotted;
	}
	.monaco-editor .zone-widget {
		position: absolute;
		z-index: 10;
	}
	.monaco-editor .zone-widget .zone-widget-container {
		border-top-style: solid;
		border-bottom-style: solid;
		border-top-width: 0;
		border-bottom-width: 0;
		position: relative;
	}
	.monaco-editor .accessibilityHelpWidget {
		padding: 10px;
		vertical-align: middle;
		overflow: scroll;
		color: var(--vscode-editorWidget-foreground);
		background-color: var(--vscode-editorWidget-background);
		box-shadow: 0 2px 8px var(--vscode-widget-shadow);
		border: 2px solid var(--vscode-contrastBorder);
	}
	.monaco-editor .iPadShowKeyboard {
		width: 58px;
		min-width: 0;
		height: 36px;
		min-height: 0;
		margin: 0;
		padding: 0;
		position: absolute;
		resize: none;
		overflow: hidden;
		background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00OC4wMzYgNC4wMUg0LjAwOFYzMi4wM2g0NC4wMjhWNC4wMXpNNC4wMDguMDA4QTQuMDAzIDQuMDAzIDAgMDAuMDA1IDQuMDFWMzIuMDNhNC4wMDMgNC4wMDMgMCAwMDQuMDAzIDQuMDAyaDQ0LjAyOGE0LjAwMyA0LjAwMyAwIDAwNC4wMDMtNC4wMDJWNC4wMUE0LjAwMyA0LjAwMyAwIDAwNDguMDM2LjAwOEg0LjAwOHpNOC4wMSA4LjAxM2g0LjAwM3Y0LjAwM0g4LjAxVjguMDEzem0xMi4wMDggMGgtNC4wMDJ2NC4wMDNoNC4wMDJWOC4wMTN6bTQuMDAzIDBoNC4wMDJ2NC4wMDNoLTQuMDAyVjguMDEzem0xMi4wMDggMGgtNC4wMDN2NC4wMDNoNC4wMDNWOC4wMTN6bTQuMDAyIDBoNC4wMDN2NC4wMDNINDAuMDNWOC4wMTN6bS0yNC4wMTUgOC4wMDVIOC4wMXY0LjAwM2g4LjAwNnYtNC4wMDN6bTQuMDAyIDBoNC4wMDN2NC4wMDNoLTQuMDAzdi00LjAwM3ptMTIuMDA4IDBoLTQuMDAzdjQuMDAzaDQuMDAzdi00LjAwM3ptMTIuMDA4IDB2NC4wMDNoLTguMDA1di00LjAwM2g4LjAwNXptLTMyLjAyMSA4LjAwNUg4LjAxdjQuMDAzaDQuMDAzdi00LjAwM3ptNC4wMDMgMGgyMC4wMTN2NC4wMDNIMTYuMDE2di00LjAwM3ptMjguMDE4IDBINDAuMDN2NC4wMDNoNC4wMDN2LTQuMDAzeiIgZmlsbD0iIzQyNDI0MiIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9ImNsaXAwIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDUzdjM2SDB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+)
			50% no-repeat;
		border: 4px solid #f6f6f6;
		border-radius: 4px;
	}
	.monaco-editor.vs-dark .iPadShowKeyboard {
		background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00OC4wMzYgNC4wMUg0LjAwOFYzMi4wM2g0NC4wMjhWNC4wMXpNNC4wMDguMDA4QTQuMDAzIDQuMDAzIDAgMDAuMDA1IDQuMDFWMzIuMDNhNC4wMDMgNC4wMDMgMCAwMDQuMDAzIDQuMDAyaDQ0LjAyOGE0LjAwMyA0LjAwMyAwIDAwNC4wMDMtNC4wMDJWNC4wMUE0LjAwMyA0LjAwMyAwIDAwNDguMDM2LjAwOEg0LjAwOHpNOC4wMSA4LjAxM2g0LjAwM3Y0LjAwM0g4LjAxVjguMDEzem0xMi4wMDggMGgtNC4wMDJ2NC4wMDNoNC4wMDJWOC4wMTN6bTQuMDAzIDBoNC4wMDJ2NC4wMDNoLTQuMDAyVjguMDEzem0xMi4wMDggMGgtNC4wMDN2NC4wMDNoNC4wMDNWOC4wMTN6bTQuMDAyIDBoNC4wMDN2NC4wMDNINDAuMDNWOC4wMTN6bS0yNC4wMTUgOC4wMDVIOC4wMXY0LjAwM2g4LjAwNnYtNC4wMDN6bTQuMDAyIDBoNC4wMDN2NC4wMDNoLTQuMDAzdi00LjAwM3ptMTIuMDA4IDBoLTQuMDAzdjQuMDAzaDQuMDAzdi00LjAwM3ptMTIuMDA4IDB2NC4wMDNoLTguMDA1di00LjAwM2g4LjAwNXptLTMyLjAyMSA4LjAwNUg4LjAxdjQuMDAzaDQuMDAzdi00LjAwM3ptNC4wMDMgMGgyMC4wMTN2NC4wMDNIMTYuMDE2di00LjAwM3ptMjguMDE4IDBINDAuMDN2NC4wMDNoNC4wMDN2LTQuMDAzeiIgZmlsbD0iI0M1QzVDNSIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9ImNsaXAwIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDUzdjM2SDB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+)
			50% no-repeat;
		border: 4px solid #252526;
	}
	.monaco-editor .tokens-inspect-widget {
		z-index: 50;
		user-select: text;
		-webkit-user-select: text;
		padding: 10px;
		color: var(--vscode-editorHoverWidget-foreground);
		background-color: var(--vscode-editorHoverWidget-background);
		border: 1px solid var(--vscode-editorHoverWidget-border);
	}
	.monaco-editor.hc-black .tokens-inspect-widget,
	.monaco-editor.hc-light .tokens-inspect-widget {
		border-width: 2px;
	}
	.monaco-editor .tokens-inspect-widget .tokens-inspect-separator {
		height: 1px;
		border: 0;
		background-color: var(--vscode-editorHoverWidget-border);
	}
	.monaco-editor .tokens-inspect-widget .tm-token {
		font-family: var(--monaco-monospace-font);
	}
	.monaco-editor .tokens-inspect-widget .tm-token-length {
		font-weight: 400;
		font-size: 60%;
		float: right;
	}
	.monaco-editor .tokens-inspect-widget .tm-metadata-table {
		width: 100%;
	}
	.monaco-editor .tokens-inspect-widget .tm-metadata-value {
		font-family: var(--monaco-monospace-font);
		text-align: right;
	}
	.monaco-editor .tokens-inspect-widget .tm-token-type {
		font-family: var(--monaco-monospace-font);
	}
	.quick-input-widget {
		font-size: 13px;
	}
	.quick-input-widget .monaco-highlighted-label .highlight {
		color: #0066bf;
	}
	.vs .quick-input-widget .monaco-list-row.focused .monaco-highlighted-label .highlight {
		color: #9dddff;
	}
	.vs-dark .quick-input-widget .monaco-highlighted-label .highlight {
		color: #0097fb;
	}
	.hc-black .quick-input-widget .monaco-highlighted-label .highlight {
		color: #f38518;
	}
	.hc-light .quick-input-widget .monaco-highlighted-label .highlight {
		color: #0f4a85;
	}
	.monaco-keybinding > .monaco-keybinding-key {
		background-color: hsla(0, 0%, 86.7%, 0.4);
		border: 1px solid hsla(0, 0%, 80%, 0.4);
		border-bottom-color: hsla(0, 0%, 73.3%, 0.4);
		box-shadow: inset 0 -1px 0 hsla(0, 0%, 73.3%, 0.4);
		color: #555;
	}
	.hc-black .monaco-keybinding > .monaco-keybinding-key {
		background-color: transparent;
		border: 1px solid #6fc3df;
		box-shadow: none;
		color: #fff;
	}
	.hc-light .monaco-keybinding > .monaco-keybinding-key {
		background-color: transparent;
		border: 1px solid #0f4a85;
		box-shadow: none;
		color: #292929;
	}
	.vs-dark .monaco-keybinding > .monaco-keybinding-key {
		background-color: hsla(0, 0%, 50.2%, 0.17);
		border: 1px solid rgba(51, 51, 51, 0.6);
		border-bottom-color: rgba(68, 68, 68, 0.6);
		box-shadow: inset 0 -1px 0 rgba(68, 68, 68, 0.6);
		color: #ccc;
	}
	.monaco-editor {
		font-family: -apple-system, BlinkMacSystemFont, Segoe WPC, Segoe UI, HelveticaNeue-Light, system-ui, Ubuntu,
			Droid Sans, sans-serif;
		--monaco-monospace-font: 'SF Mono', Monaco, Menlo, Consolas, 'Ubuntu Mono', 'Liberation Mono', 'DejaVu Sans Mono',
			'Courier New', monospace;
	}
	.monaco-editor.hc-black .monaco-menu .monaco-action-bar.vertical .action-menu-item:focus .action-label,
	.monaco-editor.hc-light .monaco-menu .monaco-action-bar.vertical .action-menu-item:focus .action-label,
	.monaco-editor.vs-dark .monaco-menu .monaco-action-bar.vertical .action-menu-item:focus .action-label,
	.monaco-menu .monaco-action-bar.vertical .action-item .action-menu-item:focus .action-label {
		stroke-width: 1.2px;
	}
	.monaco-hover p {
		margin: 0;
	}
	.monaco-aria-container {
		position: absolute !important;
		top: 0;
		height: 1px;
		width: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		clip: rect(1px, 1px, 1px, 1px);
		clip-path: inset(50%);
	}
	.action-list-description {
		opacity: 0.7;
		margin-left: 0.5em;
		font-size: 0.9em;
		white-space: pre;
	}
	.action-widget {
		font-size: 13px;
		border-radius: 0;
		min-width: 160px;
		max-width: 500px;
		z-index: 40;
		display: block;
		width: 100%;
		border: 1px solid var(--vscode-editorWidget-border) !important;
		background-color: var(--vscode-editorWidget-background);
		color: var(--vscode-editorWidget-foreground);
	}
	.context-view-block {
		z-index: -1;
	}
	.context-view-block,
	.context-view-pointerBlock {
		position: fixed;
		cursor: auto;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.context-view-pointerBlock {
		z-index: 2;
	}
	.action-widget .monaco-list {
		user-select: none;
		-webkit-user-select: none;
		border: 0 !important;
	}
	.action-widget .monaco-list:focus:before {
		outline: 0 !important;
	}
	.action-widget .monaco-list .monaco-scrollable-element {
		overflow: visible;
	}
	.action-widget .monaco-list .monaco-list-row {
		padding: 0 10px;
		white-space: nowrap;
		cursor: pointer;
		touch-action: none;
		width: 100%;
	}
	.action-widget .monaco-list .monaco-list-row.action.focused:not(.option-disabled) {
		background-color: var(--vscode-quickInputList-focusBackground) !important;
		color: var(--vscode-quickInputList-focusForeground);
		outline: 1px solid var(--vscode-menu-selectionBorder, transparent);
		outline-offset: -1px;
	}
	.action-widget .monaco-list-row.group-header {
		color: var(--vscode-pickerGroup-foreground) !important;
		font-weight: 600;
	}
	.action-widget .monaco-list .group-header,
	.action-widget .monaco-list .option-disabled,
	.action-widget .monaco-list .option-disabled .focused,
	.action-widget .monaco-list .option-disabled .focused:before,
	.action-widget .monaco-list .option-disabled:before {
		cursor: default !important;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		user-select: none;
		background-color: transparent !important;
		outline: 0 solid !important;
	}
	.action-widget .monaco-list-row.action {
		display: flex;
		gap: 6px;
		align-items: center;
	}
	.action-widget .monaco-list-row.action.option-disabled {
		color: var(--vscode-disabledForeground);
	}
	.action-widget .monaco-list-row.action.option-disabled .codicon {
		opacity: 0.4;
	}
	.action-widget .monaco-list-row.action:not(.option-disabled) .codicon {
		color: inherit;
	}
	.action-widget .monaco-list-row.action .title {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.action-widget .action-widget-action-bar {
		background-color: var(--vscode-editorHoverWidget-statusBarBackground);
		border-top: 1px solid var(--vscode-editorHoverWidget-border);
	}
	.action-widget .action-widget-action-bar:before {
		display: block;
		content: '';
		width: 100%;
	}
	.action-widget .action-widget-action-bar .actions-container {
		padding: 0 8px;
	}
	.action-widget-action-bar .action-label {
		color: var(--vscode-textLink-activeForeground);
		font-size: 12px;
		line-height: 22px;
		padding: 0;
		pointer-events: all;
	}
	.action-widget-action-bar .action-item {
		margin-right: 16px;
		pointer-events: none;
	}
	.action-widget-action-bar .action-label:hover {
		background-color: transparent !important;
	}
	.monaco-action-bar .action-item.menu-entry .action-label.icon {
		width: 16px;
		height: 16px;
		background-repeat: no-repeat;
		background-position: 50%;
		background-size: 16px;
	}
	.monaco-dropdown-with-default {
		display: flex !important;
		flex-direction: row;
		border-radius: 5px;
	}
	.monaco-dropdown-with-default > .action-container > .action-label {
		margin-right: 0;
	}
	.monaco-dropdown-with-default > .action-container.menu-entry > .action-label.icon {
		width: 16px;
		height: 16px;
		background-repeat: no-repeat;
		background-position: 50%;
		background-size: 16px;
	}
	.monaco-dropdown-with-default
		> .dropdown-action-container
		> .monaco-dropdown
		> .dropdown-label
		.codicon[class*='codicon-'] {
		font-size: 12px;
		padding-left: 0;
		padding-right: 0;
		line-height: 16px;
		margin-left: -3px;
	}
	.monaco-dropdown-with-default > .dropdown-action-container > .monaco-dropdown > .dropdown-label > .action-label {
		display: block;
		background-size: 16px;
		background-position: 50%;
		background-repeat: no-repeat;
	}
	.monaco-link {
		color: var(--vscode-textLink-foreground);
	}
	.monaco-link:hover {
		color: var(--vscode-textLink-activeForeground);
	}
	.quick-input-widget {
		position: absolute;
		width: 600px;
		z-index: 2550;
		left: 50%;
		margin-left: -300px;
		-webkit-app-region: no-drag;
		border-radius: 6px;
	}
	.quick-input-titlebar {
		display: flex;
		align-items: center;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}
	.quick-input-left-action-bar {
		display: flex;
		margin-left: 4px;
		flex: 1;
	}
	.quick-input-title {
		padding: 3px 0;
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.quick-input-right-action-bar {
		display: flex;
		margin-right: 4px;
		flex: 1;
	}
	.quick-input-right-action-bar > .actions-container {
		justify-content: flex-end;
	}
	.quick-input-titlebar .monaco-action-bar .action-label.codicon {
		background-position: 50%;
		background-repeat: no-repeat;
		padding: 2px;
	}
	.quick-input-description {
		margin: 6px;
	}
	.quick-input-header .quick-input-description {
		margin: 4px 2px;
	}
	.quick-input-header {
		display: flex;
		padding: 8px 6px 6px;
	}
	.quick-input-widget.hidden-input .quick-input-header {
		padding: 0;
		margin-bottom: 0;
	}
	.quick-input-and-message {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		min-width: 0;
		position: relative;
	}
	.quick-input-check-all {
		align-self: center;
		margin: 0;
	}
	.quick-input-filter {
		flex-grow: 1;
		display: flex;
		position: relative;
	}
	.quick-input-box {
		flex-grow: 1;
	}
	.quick-input-widget.show-checkboxes .quick-input-box,
	.quick-input-widget.show-checkboxes .quick-input-message {
		margin-left: 5px;
	}
	.quick-input-visible-count {
		position: absolute;
		left: -10000px;
	}
	.quick-input-count {
		align-self: center;
		position: absolute;
		right: 4px;
		display: flex;
		align-items: center;
	}
	.quick-input-count .monaco-count-badge {
		vertical-align: middle;
		padding: 2px 4px;
		border-radius: 2px;
		min-height: auto;
		line-height: normal;
	}
	.quick-input-action {
		margin-left: 6px;
	}
	.quick-input-action .monaco-text-button {
		font-size: 11px;
		padding: 0 6px;
		display: flex;
		height: 25px;
		align-items: center;
	}
	.quick-input-message {
		margin-top: -1px;
		padding: 5px;
		overflow-wrap: break-word;
	}
	.quick-input-message > .codicon {
		margin: 0 0.2em;
		vertical-align: text-bottom;
	}
	.quick-input-message a {
		color: inherit;
	}
	.quick-input-progress.monaco-progress-container {
		position: relative;
	}
	.quick-input-progress.monaco-progress-container,
	.quick-input-progress.monaco-progress-container .progress-bit {
		height: 2px;
	}
	.quick-input-list {
		line-height: 22px;
	}
	.quick-input-widget.hidden-input .quick-input-list {
		margin-top: 4px;
		padding-bottom: 4px;
	}
	.quick-input-list .monaco-list {
		overflow: hidden;
		max-height: 440px;
		padding-bottom: 5px;
	}
	.quick-input-list .monaco-scrollable-element {
		padding: 0 5px;
	}
	.quick-input-list .quick-input-list-entry {
		box-sizing: border-box;
		overflow: hidden;
		display: flex;
		height: 100%;
		padding: 0 6px;
	}
	.quick-input-list .quick-input-list-entry.quick-input-list-separator-border {
		border-top-width: 1px;
		border-top-style: solid;
	}
	.quick-input-list .monaco-list-row {
		border-radius: 3px;
	}
	.quick-input-list .monaco-list-row[data-index='0'] .quick-input-list-entry.quick-input-list-separator-border {
		border-top-style: none;
	}
	.quick-input-list .quick-input-list-label {
		overflow: hidden;
		display: flex;
		height: 100%;
		flex: 1;
	}
	.quick-input-list .quick-input-list-checkbox {
		align-self: center;
		margin: 0;
	}
	.quick-input-list .quick-input-list-rows {
		overflow: hidden;
		text-overflow: ellipsis;
		display: flex;
		flex-direction: column;
		height: 100%;
		flex: 1;
		margin-left: 5px;
	}
	.quick-input-widget.show-checkboxes .quick-input-list .quick-input-list-rows {
		margin-left: 10px;
	}
	.quick-input-widget .quick-input-list .quick-input-list-checkbox {
		display: none;
	}
	.quick-input-widget.show-checkboxes .quick-input-list .quick-input-list-checkbox {
		display: inline;
	}
	.quick-input-list .quick-input-list-rows > .quick-input-list-row {
		display: flex;
		align-items: center;
	}
	.quick-input-list .quick-input-list-rows > .quick-input-list-row .monaco-icon-label,
	.quick-input-list
		.quick-input-list-rows
		> .quick-input-list-row
		.monaco-icon-label
		.monaco-icon-label-container
		> .monaco-icon-name-container {
		flex: 1;
	}
	.quick-input-list .quick-input-list-rows > .quick-input-list-row .codicon[class*='codicon-'] {
		vertical-align: text-bottom;
	}
	.quick-input-list .quick-input-list-rows .monaco-highlighted-label > span {
		opacity: 1;
	}
	.quick-input-list .quick-input-list-entry .quick-input-list-entry-keybinding {
		margin-right: 8px;
	}
	.quick-input-list .quick-input-list-label-meta {
		opacity: 0.7;
		line-height: normal;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.quick-input-list .monaco-highlighted-label .highlight {
		font-weight: 700;
	}
	.quick-input-list .quick-input-list-entry .quick-input-list-separator {
		margin-right: 4px;
	}
	.quick-input-list .quick-input-list-entry-action-bar {
		display: flex;
		flex: 0;
		overflow: visible;
	}
	.quick-input-list .quick-input-list-entry-action-bar .action-label {
		display: none;
	}
	.quick-input-list .quick-input-list-entry-action-bar .action-label.codicon {
		margin-right: 4px;
		padding: 0 2px 2px;
	}
	.quick-input-list .quick-input-list-entry-action-bar {
		margin-top: 1px;
		margin-right: 4px;
	}
	.quick-input-list .monaco-list-row.focused .quick-input-list-entry-action-bar .action-label,
	.quick-input-list .quick-input-list-entry .quick-input-list-entry-action-bar .action-label.always-visible,
	.quick-input-list .quick-input-list-entry:hover .quick-input-list-entry-action-bar .action-label {
		display: flex;
	}
	.quick-input-list .monaco-list-row.focused .monaco-keybinding-key,
	.quick-input-list .monaco-list-row.focused .quick-input-list-entry .quick-input-list-separator {
		color: inherit;
	}
	.quick-input-list .monaco-list-row.focused .monaco-keybinding-key {
		background: none;
	}
	.extension-editor .codicon.codicon-error,
	.extensions-viewlet > .extensions .codicon.codicon-error,
	.markers-panel .marker-icon .codicon.codicon-error,
	.markers-panel .marker-icon.error,
	.monaco-editor .zone-widget .codicon.codicon-error,
	.preferences-editor .codicon.codicon-error,
	.text-search-provider-messages .providerMessage .codicon.codicon-error {
		color: var(--vscode-problemsErrorIcon-foreground);
	}
	.extension-editor .codicon.codicon-warning,
	.extensions-viewlet > .extensions .codicon.codicon-warning,
	.markers-panel .marker-icon .codicon.codicon-warning,
	.markers-panel .marker-icon.warning,
	.monaco-editor .zone-widget .codicon.codicon-warning,
	.preferences-editor .codicon.codicon-warning,
	.text-search-provider-messages .providerMessage .codicon.codicon-warning {
		color: var(--vscode-problemsWarningIcon-foreground);
	}
	.extension-editor .codicon.codicon-info,
	.extensions-viewlet > .extensions .codicon.codicon-info,
	.markers-panel .marker-icon .codicon.codicon-info,
	.markers-panel .marker-icon.info,
	.monaco-editor .zone-widget .codicon.codicon-info,
	.preferences-editor .codicon.codicon-info,
	.text-search-provider-messages .providerMessage .codicon.codicon-info {
		color: var(--vscode-problemsInfoIcon-foreground);
	}
`;
