import {
	Editor,
	MarkdownPostProcessorContext,
	MarkdownView,
	parseYaml,
	Plugin,
} from "obsidian";
import { HexView } from "view/hexview";
import { HexflowerBlockSample } from "./tpl/block";

interface HexflowerPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: HexflowerPluginSettings = {
	mySetting: "default",
};

export default class HexflowerPlugin extends Plugin {
	settings: HexflowerPluginSettings;

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
				const hview = new HexView(this.app, hexdata, ctx);
				el.appendChild(hview.view);
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

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

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

	// async saveSettings() {
	// 	await this.saveData(this.settings);
	// }
}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const { contentEl } = this;
// 		contentEl.setText("Woah!");
// 	}

// 	onClose() {
// 		const { contentEl } = this;
// 		contentEl.empty();
// 	}
// }

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const { containerEl } = this;

// 		containerEl.empty();

// 		containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

// 		new Setting(containerEl)
// 			.setName("Setting #1")
// 			.setDesc("It's a secret")
// 			.addText((text) =>
// 				text
// 					.setPlaceholder("Enter your secret")
// 					.setValue(this.plugin.settings.mySetting)
// 					.onChange(async (value) => {
// 						console.log("Secret: " + value);
// 						this.plugin.settings.mySetting = value;
// 						await this.plugin.saveSettings();
// 					})
// 			);
// 	}
// }
