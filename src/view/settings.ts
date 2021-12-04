// Settings tab

export interface HexflowerPluginSettings {
	navDiceColor: string;
	navDirectionColor: string;
	navHexColor: string;
	selectedHexColor: string;
	lineHexColor: string;
	textHexColor: string;
	resultColor: string;
	centerResult: boolean;
	showValues: boolean;
	showValueTooltips: boolean;
	showIcons: boolean;
	iconOpacity: number;
	showNumbers: boolean;
}

export const DEFAULT_SETTINGS_DARK: HexflowerPluginSettings = {
	navDiceColor: "#DAA520",
	navDirectionColor: "#5f9ea0",
	navHexColor: "#333333",
	selectedHexColor: "#1bde17",
	lineHexColor: "#bbbbbb",
	textHexColor: "#ffffff",
	resultColor: "#9acd32",
	centerResult: false,
	showValueTooltips: true,
	showValues: false,
	iconOpacity: 0.2,
	showIcons: true,
	showNumbers: true,
};

export const DEFAULT_SETTINGS_LIGHT: HexflowerPluginSettings = {
	navDiceColor: "#DAA520",
	navDirectionColor: "#275d5e",
	navHexColor: "#cccccc",
	selectedHexColor: "#1bde17",
	lineHexColor: "#bbbbbb",
	textHexColor: "#000000",
	resultColor: "#547512",
	centerResult: false,
	showValueTooltips: true,
	showValues: false,
	iconOpacity: 0.5,
	showIcons: true,
	showNumbers: true,
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

		new Setting(containerEl)
			.setName("Center result text")
			.setDesc("Center text in the result area.")
			.addToggle((t) => {
				t.setValue(this.plugin.settings.centerResult);
				t.onChange(async (v) => {
					this.plugin.settings.centerResult = v;
					await this.plugin.saveSettings();
					this.plugin.app.workspace.trigger(
						"hexflower:update-settings"
					);
				});
			});

		new Setting(containerEl)
			.setName("Show value tooltips")
			.setDesc("Show tooltips with hex values.")
			.addToggle((t) => {
				t.setValue(this.plugin.settings.showValueTooltips);
				t.onChange(async (v) => {
					this.plugin.settings.showValueTooltips = v;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Show value list")
			.setDesc("Show hexflower values below the result field.")
			.addToggle((t) => {
				t.setValue(this.plugin.settings.showValues);
				t.onChange(async (v) => {
					this.plugin.settings.showValues = v;
					await this.plugin.saveSettings();
					this.plugin.app.workspace.trigger(
						"hexflower:update-settings"
					);
				});
			});

		new Setting(containerEl)
			.setName("Show icons")
			.setDesc("Show icons inside hexes if specified.")
			.addToggle((t) => {
				t.setValue(this.plugin.settings.showIcons);
				t.onChange(async (v) => {
					this.plugin.settings.showIcons = v;
					await this.plugin.saveSettings();
					this.plugin.app.workspace.trigger(
						"hexflower:update-settings"
					);
				});
			});

		new Setting(containerEl)
			.setName("Icon image opacity")
			.setDesc("")
			.addSlider((t) => {
				t.setDynamicTooltip();
				t.setValue(this.plugin.settings.iconOpacity * 100);
				t.onChange(async (v) => {
					this.plugin.settings.iconOpacity = v / 100;
					await this.plugin.saveSettings();
					this.plugin.app.workspace.trigger(
						"hexflower:update-settings"
					);
				});
			});

		new Setting(containerEl)
			.setName("Show hex numbers")
			.setDesc("")
			.addToggle((t) => {
				t.setValue(this.plugin.settings.showNumbers);
				t.onChange(async (v) => {
					this.plugin.settings.showNumbers = v;
					await this.plugin.saveSettings();
					this.plugin.app.workspace.trigger(
						"hexflower:update-settings"
					);
				});
			});

		new Setting(containerEl).setHeading().setName("Colors");

		const div = containerEl.createEl("div", { cls: "centered" });
		const btn = containerEl.createEl("button", {
			text: "Defaults: Dark Theme",
			cls: "settingsResetBtn",
		});
		btn.onclick = async () => {
			this.plugin.settings = DEFAULT_SETTINGS_DARK;
			await this.plugin.saveSettings();
			await this.plugin.loadSettings();
			this.plugin.app.workspace.trigger("hexflower:update-colors");
			this.plugin.app.workspace.trigger("hexflower:update-settings");
			this.display();
		};
		div.appendChild(btn);
		const btn2 = containerEl.createEl("button", {
			text: "Defaults: Light Theme",
			cls: "settingsResetBtn",
		});
		btn2.onclick = async () => {
			this.plugin.settings = DEFAULT_SETTINGS_LIGHT;
			await this.plugin.saveSettings();
			await this.plugin.loadSettings();
			this.plugin.app.workspace.trigger("hexflower:update-colors");
			this.plugin.app.workspace.trigger("hexflower:update-settings");
			this.display();
		};
		div.appendChild(btn2);

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
