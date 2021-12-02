import {
	Editor,
	MarkdownPostProcessorContext,
	MarkdownView,
	parseYaml,
	Plugin,
} from "obsidian";
import { HexView } from "view/hexview";
import {
	DEFAULT_SETTINGS,
	HexflowerPluginSettings,
	HexflowerSettingsTab,
} from "view/settings";
import { HexflowerBlockSample } from "./tpl/block";

declare module "obsidian" {
	interface Workspace {
		on(name: "hexflower:update-colors", callback: () => void): EventRef;
		on(name: "hexflower:update-settings", callback: () => void): EventRef;
	}
}

export default class HexflowerPlugin extends Plugin {
	settings: HexflowerPluginSettings;
	hexView: HexView;

	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor(
			"hexflower",
			(
				source: string,
				el: HTMLElement,
				ctx: MarkdownPostProcessorContext
			) => {
				const hexdata = parseYaml(source);
				this.hexView = new HexView(this, hexdata, ctx);
				el.appendChild(this.hexView.view);
			}
		);

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: "open-sample-modal-simple",
		// 	name: "Open sample modal (simple)",
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	},
		// });

		this.addCommand({
			id: "generate-hexflower-block",
			name: "Generate hexflower block",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection(HexflowerBlockSample.trim());
			},
		});

		this.addSettingTab(new HexflowerSettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// console.log("click", evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(
		// 	window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		// );
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
