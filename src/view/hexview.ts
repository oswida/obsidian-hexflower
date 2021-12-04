import HexflowerPlugin from "main";
import {
	Events,
	MarkdownPostProcessorContext,
	Notice,
	stringifyYaml,
} from "obsidian";
import { ResetModal } from "view/modal";
import { HfDef } from "../common/definition";
import { FindHexflowerText, ReplaceInCurrentFile } from "../common/util";
import { HexflowerTemplate } from "../tpl/hexflower";
import { HexNavTemplate } from "../tpl/navigation";

const tpl = `
<h2 id="title" aria-label=""></h2>
<button id="reset-btn" style="margin-top: 1em">Reset</button>
<table class="hftab-nb">
 <tr id="hrow">
  <td  class="hexblock centered" id="main"></td>
 </tr>
</table>
<div id="hexflower-result" class="hresult"></div>
<div id="hexflower-value-list"></div>
`;

export class HexView extends Events {
	view: HTMLDivElement;
	data: HfDef;
	plugin: HexflowerPlugin;
	context: MarkdownPostProcessorContext;

	hFlower: HexflowerTemplate;
	hNavs: HexNavTemplate[];

	constructor(
		plugin: HexflowerPlugin,
		data: HfDef,
		context: MarkdownPostProcessorContext
	) {
		super();
		this.plugin = plugin;
		this.context = context;
		this.data = data;
		this.view = createDiv();

		this.hFlower = new HexflowerTemplate(this.plugin, this.data);
		this.refresh();
		this.plugin.registerEvent(
			this.plugin.app.workspace.on("hexflower:update-colors", () => {
				this.updateColors();
			})
		);
		this.plugin.registerEvent(
			this.plugin.app.workspace.on("hexflower:update-settings", () => {
				this.updateSettings();
			})
		);
	}

	refresh() {
		const mainView = this.view;
		mainView.empty();

		mainView.innerHTML = tpl.trim();

		const title = mainView.find("#title");
		if (title) {
			title.innerHTML = this.data.name;
		}
		const reset = mainView.find("#reset-btn");
		reset.onclick = this.actionReset.bind(this);

		const ms = mainView.find("#main");
		// hexflower hexes
		if (ms) {
			ms.appendChild(this.hFlower.view);
			this.hFlower.refresh();
		}

		const hrow = mainView.find("#hrow");
		// navigation
		if (hrow) {
			this.hNavs = this.data.navigation.map((obj) => {
				const nav = new HexNavTemplate(
					this.plugin,
					obj,
					this.data.current,
					(newHex: number) => {
						this.setSelected(newHex);
					}
				);
				hrow.appendChild(nav.view);
				return nav;
			});
		}

		// result
		const cres = mainView.find("#hexflower-result");
		if (cres) {
			cres.innerHTML = this.data.values[this.data.current - 1];
			cres.style.color = this.plugin.settings.resultColor;
			if (this.plugin.settings.centerResult) {
				cres.style.textAlign = "center";
			} else {
				cres.style.textAlign = "left";
			}
		}

		// value list
		const lst = mainView.find("#hexflower-value-list");
		if (lst) {
			lst.createEl("h3", { text: "Values" });
			const tab = lst.createEl("table");
			for (let i = 1; i <= 19; i++) {
				const tr = tab.createEl("tr");
				tr.innerHTML =
					"<td>" +
					i.toString() +
					"</td><td>" +
					this.data.values[i - 1] +
					"</td>";
			}
			if (this.plugin.settings.showValues) {
				lst.style.display = "block";
			} else {
				lst.style.display = "none";
			}
		}

		this.view = mainView;
	}

	async setSelected(num: number) {
		this.data.current = num;
		const result = await FindHexflowerText(this.plugin.app, this.data.name);
		if (!result) return;
		ReplaceInCurrentFile(
			this.plugin.app,
			result.filePosition,
			result.filePosition + result.length,
			"```hexflower\n" + stringifyYaml(this.data) + "```"
		);
		this.refresh();
	}

	async actionReset(evt: MouseEvent) {
		evt.stopPropagation();
		evt.stopImmediatePropagation();
		const dlg = new ResetModal(this.plugin.app, async (value: string) => {
			const num = Number.parseInt(value);
			if (Number.isNaN(num)) {
				return;
			}
			this.setSelected(num);
			new Notice(this.data.name + " ⬢ " + num);
		});
		dlg.open();
	}

	updateColors() {
		const cres =
			this.plugin.app.workspace.containerEl.findAll("#hexflower-result");
		cres.forEach((n) => {
			n.style.color = this.plugin.settings.resultColor;
		});
	}

	updateSettings() {
		const lst = this.plugin.app.workspace.containerEl.findAll(
			"#hexflower-value-list"
		);
		lst.forEach((l) => {
			if (this.plugin.settings.showValues) l.style.display = "block";
			else l.style.display = "none";
		});
		const cres =
			this.plugin.app.workspace.containerEl.findAll("#hexflower-result");
		cres.forEach((c) => {
			if (this.plugin.settings.centerResult) {
				c.style.textAlign = "center";
			} else {
				c.style.textAlign = "left";
			}
		});
	}
}
