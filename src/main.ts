import {
	Editor,
	MarkdownPostProcessorContext,
	MarkdownView,
	parseYaml,
	Plugin,
} from "obsidian";
import { HexView } from "view/hexview";
import {
	DEFAULT_SETTINGS_DARK,
	HexflowerPluginSettings,
	HexflowerSettingsTab,
} from "view/settings";
import { HfParse } from "./common/blockdef";
import { HexflowerBlockSample } from "./tpl/block";
import { DEFAULT_SETTINGS_LIGHT } from "./view/settings";

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
		// settings
		await this.loadSettings();

		// hf markdown postprocessor
		this.registerMarkdownCodeBlockProcessor(
			"hexflower",
			(
				source: string,
				el: HTMLElement,
				ctx: MarkdownPostProcessorContext
			) => {
				const hexdata = HfParse(this.app, parseYaml(source));
				const hexView = new HexView(this, hexdata, ctx);
				el.appendChild(hexView.view);
			}
		);

		// command for hf block generation
		this.addCommand({
			id: "generate-hexflower-block",
			name: "Generate hexflower block",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection(HexflowerBlockSample.trim());
			},
		});

		this.addSettingTab(new HexflowerSettingsTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		const isDarkMode =
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches;
		this.settings = Object.assign(
			{},
			isDarkMode ? DEFAULT_SETTINGS_DARK : DEFAULT_SETTINGS_LIGHT,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
