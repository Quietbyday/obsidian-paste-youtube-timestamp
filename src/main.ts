import { Editor, MarkdownView, Plugin } from 'obsidian';
import { isYouTubeTimestampUrl, formatAsMarkdownLink } from './utils/timestamp';

export default class YouTubeTimestampPlugin extends Plugin {

	async onload() {
		this.registerEvent(
			this.app.workspace.on(
				'editor-paste',
				(evt: ClipboardEvent, editor: Editor, _view: MarkdownView) => {
					this.handlePaste(evt, editor);
				}
			)
		);
	}

	private handlePaste(evt: ClipboardEvent, editor: Editor): void {
		const text = evt.clipboardData?.getData('text/plain') ?? '';

		if (!isYouTubeTimestampUrl(text)) {
			return;
		}

		evt.preventDefault();
		const markdownLink = formatAsMarkdownLink(text);
		editor.replaceSelection(markdownLink);
	}
}
