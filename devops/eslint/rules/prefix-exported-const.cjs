module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Ensure all exported constants should be in uppercase with words separated by underscores and prefixed with UMB_',
		},
	},
	create: function (context) {
		const excludedFileNames = context.options[0]?.excludedFileNames || [];
		return {
			ExportNamedDeclaration(node) {
				const fileName = context.getFilename();

				if (excludedFileNames.some((excludedFileName) => fileName.includes(excludedFileName))) {
					// Skip the rule check for files in the excluded list
					return;
				}

				if (node.declaration && node.declaration.type === 'VariableDeclaration') {
					const declaration = node.declaration.declarations[0];
					const { id, init } = declaration;

					if (id && id.type === 'Identifier' && init && init.type === 'Literal' && typeof init.value === 'string') {
						const isValidName = /^[A-Z]+(_[A-Z]+)*$/.test(id.name);

						if (!isValidName || !id.name.startsWith('UMB_')) {
							context.report({
								node: id,
								message:
									'Exported constant should be in uppercase with words separated by underscores and prefixed with UMB_',
							});
						}
					}
				}
			},
		};
	},
};
