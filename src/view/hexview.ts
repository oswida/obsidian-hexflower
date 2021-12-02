import HexflowerPlugin from "main";
import {
	Events,
	MarkdownPostProcessorContext,
	Notice,
	stringifyYaml,
} from "obsidian";
import { ResetModal } from "view/modal";
import { HfDef } from "../common/definition";
import { FindHexflowerText, ReplaceInCurrentFile } from "../common/parser";
import { HexflowerTemplate } from "../tpl/hexflower";
import { HexNavTemplate } from "../tpl/navigation";

const tpl = `
<h2 id="title" aria-label=""></h2>
<button id="reset-btn" style="margin-top: 1em">Reset</button>
<table class="hftab-nb">
 <tr id="hrow">
  <td  class="hexblock centered" id="main">
  </td>
 </tr>
</table>
<div id="hexflower-result" class="hresult"></div>
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

		this.hFlower = new HexflowerTemplate(this.plugin, this.data);
		this.refresh();
		this.plugin.registerEvent(
			this.plugin.app.workspace.on("hexflower:update-colors", () => {
				this.updateColors();
			})
		);
	}

	refresh() {
		const mainView = createDiv();
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
		}

		//credentials
		// const cr = mainView.find("#credentials");
		// if (cr) {
		// 	if (this.data.source.trim() != "") {
		// 		const link = createEl("a");
		// 		link.href = this.data.source;
		// 		link.style.textDecoration = "none";
		// 		link.style.textDecorationColor = "grey";
		// 		link.innerHTML = this.data.author;
		// 		cr.appendChild(link);
		// 	} else {
		// 		cr.innerHTML = this.data.author;
		// 	}
		// }

		this.view = mainView;
	}

	async setSelected(num: number) {
		this.data.current = num;
		const result = await FindHexflowerText(this.plugin.app, this.data.name);
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
}
