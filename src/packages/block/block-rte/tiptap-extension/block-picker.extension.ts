import { UMB_BLOCK_RTE_MANAGER_CONTEXT } from '../context/block-rte-manager.context-token.js';
import { UMB_BLOCK_RTE_ENTRIES_CONTEXT } from '../context/block-rte-entries.context-token.js';
import type { UmbBlockDataType } from '../../block/types.js';
import type { UmbBlockRteLayoutModel } from '../types.js';
import type { UmbBlockTypeBaseModel } from '@umbraco-cms/backoffice/block-type';
import { UmbTiptapToolbarElementApiBase } from '@umbraco-cms/backoffice/tiptap';
import { Node, type Editor } from '@umbraco-cms/backoffice/external/tiptap';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		umbRteBlock: {
			setBlock: (options: { contentUdi: string }) => ReturnType;
		};
		umbRteBlockInline: {
			setBlockInline: (options: { contentUdi: string }) => ReturnType;
		};
	}
}

const umbRteBlock = Node.create({
	name: 'umbRteBlock',
	group: 'block',
	content: undefined, // The block does not have any content, it is just a wrapper.
	atom: true, // The block is an atom, meaning it is a single unit that cannot be split.
	marks: '', // We do not allow marks on the block
	draggable: true,
	//selectable: true,

	addAttributes() {
		return {
			'data-content-udi': {
				isRequired: true,
			},
		};
	},

	parseHTML() {
		return [{ tag: 'umb-rte-block' }];
	},

	renderHTML({ HTMLAttributes }) {
		return ['umb-rte-block', HTMLAttributes];
	},

	addCommands() {
		return {
			setBlock:
				(options) =>
				({ commands }) => {
					const attrs = { 'data-content-udi': options.contentUdi };
					return commands.insertContent({
						type: this.name,
						attrs,
					});
				},
		};
	},
});

const umbRteBlockInline = umbRteBlock.extend({
	name: 'umbRteBlockInline',
	group: 'inline',
	inline: true,

	parseHTML() {
		return [{ tag: 'umb-rte-block-inline' }];
	},

	renderHTML({ HTMLAttributes }) {
		return ['umb-rte-block-inline', HTMLAttributes];
	},

	addCommands() {
		return {
			setBlockInline:
				(options) =>
				({ commands }) => {
					const attrs = { 'data-content-udi': options.contentUdi };
					return commands.insertContent({
						type: this.name,
						attrs,
					});
				},
		};
	},
});

export default class UmbTiptapBlockPickerExtension extends UmbTiptapToolbarElementApiBase {
	private _blocks?: Array<UmbBlockTypeBaseModel>;
	#entriesContext?: typeof UMB_BLOCK_RTE_ENTRIES_CONTEXT.TYPE;

	#editor?: Editor;

	constructor(host: UmbControllerHost) {
		super(host);

		this.consumeContext(UMB_BLOCK_RTE_MANAGER_CONTEXT, (context) => {
			this.observe(
				context.blockTypes,
				(blockTypes) => {
					this._blocks = blockTypes;
				},
				'blockType',
			);
			this.observe(
				context.contents,
				(contents) => {
					this.#handleBlocks(contents, context.getLayouts());
				},
				'contents',
			);
		});
		this.consumeContext(UMB_BLOCK_RTE_ENTRIES_CONTEXT, (context) => {
			this.#entriesContext = context;
		});
	}

	getTiptapExtensions() {
		return [umbRteBlock, umbRteBlockInline];
	}

	override isActive(editor: Editor) {
		return (
			editor.isActive('umb-rte-block[data-content-udi]') || editor.isActive('umb-rte-block-inline[data-content-udi]')
		);
	}

	override async execute(editor: Editor) {
		this.#editor = editor;
		return this.#showDialog();
	}

	async #showDialog() {
		//const blockEl = this.editor.selection.getNode();

		/*if (blockEl.nodeName === 'UMB-RTE-BLOCK' || blockEl.nodeName === 'UMB-RTE-BLOCK-INLINE') {
			const blockUdi = blockEl.getAttribute('data-content-udi') ?? undefined;
			if (blockUdi) {
				// TODO: Missing a solution to edit a block from this scope. [NL]
				this.#editBlock(blockUdi);
				return;
			}
		}*/

		// If no block is selected, open the block picker:
		this.#createBlock();
	}

	#createBlock() {
		if (!this.#entriesContext) {
			console.error('[Block Picker] No entries context available.');
			return;
		}

		// TODO: Missing solution to skip catalogue if only one type available. [NL]
		let createPath: string | undefined = undefined;

		if (this._blocks?.length === 1) {
			const elementKey = this._blocks[0].contentElementTypeKey;
			createPath = this.#entriesContext.getPathForCreateBlock() + 'modal/umb-modal-workspace/create/' + elementKey;
		} else {
			createPath = this.#entriesContext.getPathForCreateBlock();
		}

		if (createPath) {
			window.history.pushState({}, '', createPath);
		}
	}

	#handleBlocks(blocks: UmbBlockDataType[], layouts: Array<UmbBlockRteLayoutModel>) {
		const editor = this.#editor;
		if (!editor) return;

		const existingBlocks = Array.from(
			editor.view.dom.querySelectorAll('umb-rte-block[data-content-udi], umb-rte-block-inline[data-content-udi]'),
		);
		const newBlocks: UmbBlockDataType[] = [];

		blocks.forEach((block) => {
			// Find existing block
			const existingBlock = existingBlocks.find((el) => el.getAttribute('data-content-udi') === block.udi);
			if (existingBlock) {
				return;
			}

			newBlocks.push(block);

			// Find layout for block
			const layout = layouts.find((x) => x.contentUdi === block.udi);
			const inline = layout?.displayInline ?? false;

			if (inline) {
				editor.commands.setBlockInline({ contentUdi: block.udi });
				return;
			}
			editor.commands.setBlock({ contentUdi: block.udi });
		});

		// Remove unused blocks
		existingBlocks.forEach((block) => {
			const blockUdi = block.getAttribute('data-content-udi');

			const found = newBlocks.find((x) => x.udi === blockUdi);
			if (!found) {
				//editor.commands.deleteNode(block);
			}
		});
	}
}
