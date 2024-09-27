import { UmbTiptapToolbarElementApiBase } from '../types.js';
import type { Editor } from '@umbraco-cms/backoffice/external/tiptap';

export default class UmbTiptapTextAlignJustifyExtensionApi extends UmbTiptapToolbarElementApiBase {
	override isActive(editor?: Editor) {
		return editor?.isActive({ textAlign: 'justify' }) === true;
	}

	override execute(editor?: Editor) {
		editor?.chain().focus().setTextAlign('justify').run();
	}
}