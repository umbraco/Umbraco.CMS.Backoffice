'use strict';

/*
 * A eslint rule that ensures the use of the `import type` operator from the `src/core/models/index.ts` file.
 */
// eslint-disable-next-line no-undef
module.exports = {
	/** @type {import('eslint').Rule.RuleModule} */
	'bad-type-import': {
		meta: {
			type: 'problem',
			docs: {
				description: 'Ensures the use of the `import type` operator from the `src/core/models/index.ts` file.',
				category: 'Best Practices',
				recommended: true,
			},
			fixable: 'code',
			schema: [],
		},
		create: function (context) {
			return {
				ImportDeclaration: function (node) {
					if (
						node.source.parent.importKind !== 'type' &&
						(node.source.value.endsWith('/models') || node.source.value === 'router-slot/model')
					) {
						const sourceCode = context.getSourceCode();
						const nodeSource = sourceCode.getText(node);
						context.report({
							node,
							message: 'Use `import type` instead of `import`.',
							fix: (fixer) => fixer.replaceText(node, nodeSource.replace('import', 'import type')),
						});
					}
				},
			};
		},
	},

	/** @type {import('eslint').Rule.RuleModule} */
	'no-direct-api-import': {
		meta: {
			type: 'suggestion',
			docs: {
				description:
					'Ensures that any API resources from the `@umbraco-cms/backend-api` module are not used directly. Instead you should use the `tryExecuteAndNotify` function from the `@umbraco-cms/resources` module.',
				category: 'Best Practices',
				recommended: true,
			},
			fixable: 'code',
			schema: [],
		},
		create: function (context) {
			return {
				// If methods called on *Resource classes are not already wrapped with `await tryExecuteAndNotify()`, then we should suggest to wrap them.
				CallExpression: function (node) {
					if (
						node.callee.type === 'MemberExpression' &&
						node.callee.object.type === 'Identifier' &&
						node.callee.object.name.endsWith('Resource') &&
						node.callee.property.type === 'Identifier' &&
						node.callee.property.name !== 'constructor'
					) {
						const hasTryExecuteAndNotify =
							node.parent &&
							node.parent.callee &&
							(node.parent.callee.name === 'tryExecute' || node.parent.callee.name === 'tryExecuteAndNotify');
						if (!hasTryExecuteAndNotify) {
							context.report({
								node,
								message: 'Wrap this call with `tryExecuteAndNotify()`. Make sure to `await` the result.',
								fix: (fixer) => [
									fixer.insertTextBefore(node, 'tryExecuteAndNotify(this, '),
									fixer.insertTextAfter(node, ')'),
								],
							});
						}
					}
				},
			};
		},
	},

	/** @type {import('eslint').Rule.RuleModule} */
	'prefer-import-aliases': {
		meta: {
			type: 'suggestion',
			docs: {
				description:
					'Ensures that the application does not rely on file system paths for imports. Instead, use import aliases or relative imports. This also solves a problem where GitHub fails on the test runner step.',
				category: 'Best Practices',
				recommended: true,
			},
			schema: [],
		},
		create: function (context) {
			return {
				ImportDeclaration: function (node) {
					if (node.source.value.startsWith('src/')) {
						context.report({
							node,
							message:
								'Prefer using import aliases or relative imports instead of absolute imports. Example: `import { MyComponent } from "src/components/MyComponent";` should be `import { MyComponent } from "@components/MyComponent";`',
						});
					}
				},
			};
		},
	},
	/** @type {import('eslint').Rule.RuleModule} */
	'enforce-element-suffix-on-element-class-name': {
		meta: {
			type: 'suggestion',
			docs: {
				description: 'Enforce Element class name to end with "Element".',
				category: 'Naming',
				recommended: true,
			},
			fixable: 'code',
		},
		create: function (context) {
			return {
				ClassDeclaration(node) {
					// check if the class extends HTMLElement, LitElement, or UmbLitElement
					const isExtendingElement =
						node.superClass && ['HTMLElement', 'LitElement', 'UmbLitElement'].includes(node.superClass.name);
					// check if the class name ends with 'Element'
					const isClassNameValid = node.id.name.endsWith('Element');

					if (isExtendingElement && !isClassNameValid) {
						context.report({
							node,
							message: "Element class name should end with 'Element'.",
							fix(fixer) {
								const oldName = node.id.name;
								const newName = `${oldName}Element`;
								return fixer.replaceText(node.id, newName);
							},
						});
					}
				},
			};
		},
	},
};
