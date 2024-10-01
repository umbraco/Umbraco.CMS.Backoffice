import { UmbTiptapToolbarElementApiBase } from '../types.js';
import type { Editor } from '@umbraco-cms/backoffice/external/tiptap';

export default class UmbTiptapToolbarSubscriptExtensionApi extends UmbTiptapToolbarElementApiBase {
	override execute(editor?: Editor) {
		editor?.chain().focus().toggleSubscript().run();
	}
}
