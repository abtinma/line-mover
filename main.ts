import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class LineMover extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		function moveLine(editor: Editor, direction: string) {
			let cursor = editor.getCursor();
			let line = editor.getLine(cursor.line);

			if (direction === "up" && cursor.line > 0) {
				let prevLine = editor.getLine(cursor.line - 1);
				editor.setLine(cursor.line - 1, line);
				editor.setLine(cursor.line, prevLine);
				editor.setCursor({ line: cursor.line - 1, ch: cursor.ch });
			} else if (
				direction === "down" &&
				cursor.line < editor.lineCount() - 1
			) {
				let nextLine = editor.getLine(cursor.line + 1);
				editor.setLine(cursor.line + 1, line);
				editor.setLine(cursor.line, nextLine);
				editor.setCursor({ line: cursor.line + 1, ch: cursor.ch });
			}
		}
		this.addCommand({
			id: "move-line-up",
			name: "Move Line Up",
			hotkeys: [{ modifiers: ["Alt"], key: "ArrowUp" }],
			editorCallback: (editor, view) => {
				moveLine(editor, "up");
			},
		});
		this.addCommand({
			id: "move-line-down",
			name: "Move Line Down",
			hotkeys: [{ modifiers: ["Alt"], key: "ArrowDown" }],
			editorCallback: (editor, view) => {
				moveLine(editor, "down");
			},
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
