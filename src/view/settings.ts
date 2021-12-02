// Settings tab

export interface HexflowerPluginSettings {
	navDiceColor: string;
	navDirectionColor: string;
	navHexColor: string;
	selectedHexColor: string;
	lineHexColor: string;
	textHexColor: string;
	resultColor: string;
}

export const DEFAULT_SETTINGS: HexflowerPluginSettings = {
	navDiceColor: "#DAA520",
	navDirectionColor: "#5f9ea0",
	navHexColor: "#333333",
	selectedHexColor: "#FF7F50",
	lineHexColor: "#bbbbbb",
	textHexColor: "#ffffff",
	resultColor: "#9acd32",
};

import HexflowerPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class HexflowerSettingsTab extends PluginSettingTab {
	plugin: HexflowerPlugin;

	constructor(app: App, plugin: HexflowerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Hexflower settings" });

		const div = containerEl.createEl("div", { cls: "centered" });
		const btn = containerEl.createEl("button", {
			text: "Reset to defaults",
			cls: "settingsResetBtn",
		});
		btn.onclick = async () => {
			this.plugin.settings = DEFAULT_SETTINGS;
			await this.plugin.saveSettings();
			await this.plugin.loadSettings();
			this.plugin.app.workspace.trigger("hexflower:update-colors");
			this.display();
		};
		div.appendChild(btn);

		containerEl.createEl("div", {
			cls: "centered",
			text: "Colors",
		});
		const diceColor = new Setting(containerEl)
			.setName("Dice field color")
			.setDesc("The color of the dice field in the navigation hex.");
		diceColor.controlEl.createEl(
			"input",
			{
				type: "color",
				value: this.plugin.settings.navDiceColor,
			},
			this.colorChangeFunction("navDiceColor")
		);
		const dirColor = new Setting(containerEl)
			.setName("Direction string color")
			.setDesc(
				"The color of the direction roll values in the navigation hex."
			);
		dirColor.controlEl.createEl(
			"input",
			{
				type: "color",
				value: this.plugin.settings.navDirectionColor,
			},
			this.colorChangeFunction("navDirectionColor")
		);
		const hexColor = new Setting(containerEl)
			.setName("Navigation hex color")
			.setDesc("The color of the navigation hex lines.");
		hexColor.controlEl.createEl(
			"input",
			{
				type: "color",
				value: this.plugin.settings.navHexColor,
			},
			this.colorChangeFunction("navHexColor")
		);
		const selColor = new Setting(containerEl)
			.setName("Selected hex color")
			.setDesc("The color of the selected hex number.");
		selColor.controlEl.createEl(
			"input",
			{
				type: "color",
				value: this.plugin.settings.selectedHexColor,
			},
			this.colorChangeFunction("selectedHexColor")
		);
		const lineColor = new Setting(containerEl)
			.setName("Hex line color")
			.setDesc("The color of the hex line in the main area.");
		lineColor.controlEl.createEl(
			"input",
			{
				type: "color",
				value: this.plugin.settings.lineHexColor,
			},
			this.colorChangeFunction("lineHexColor")
		);
		const txtColor = new Setting(containerEl)
			.setName("Hex text color")
			.setDesc("The color of the hex text in the main area.");
		txtColor.controlEl.createEl(
			"input",
			{
				type: "color",
				value: this.plugin.settings.textHexColor,
			},
			this.colorChangeFunction("textHexColor")
		);
		const resColor = new Setting(containerEl)
			.setName("Result text color")
			.setDesc("The color of the result - value of the selected text.");
		resColor.controlEl.createEl(
			"input",
			{
				type: "color",
				value: this.plugin.settings.resultColor,
			},
			this.colorChangeFunction("resultColor")
		);
	}

	colorChangeFunction = (fieldName: string) => {
		return (el: HTMLInputElement) => {
			el.value = (this.plugin.settings as any)[fieldName];
			el.onchange = async ({ target }) => {
				let color = (target as HTMLInputElement).value;
				(this.plugin.settings as any)[fieldName] = color;
				await this.plugin.saveSettings();
				this.plugin.app.workspace.trigger("hexflower:update-colors");
			};
		};
	};
}
