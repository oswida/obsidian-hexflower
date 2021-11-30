import { DiceImage } from "assets/dice";
import { ResetImage } from "assets/reset";
import { ResetModal } from "modal";
import {
	App,
	Events,
	MarkdownPostProcessorContext,
	stringifyYaml,
} from "obsidian";
import { HexTemplateBase } from "template";
import { HandImage } from "./assets/hand";
import { FindHexflowerText, ReplaceInCurrentFile } from "./parser";
import { DirectionsTemplate } from "./template";

export class HexView extends Events {
	view: HTMLDivElement;
	data: any;
	selected: number;
	app: App;
	context: MarkdownPostProcessorContext;

	constructor(app: App, data: any, context: MarkdownPostProcessorContext) {
		super();
		this.app = app;
		this.context = context;
		this.data = data;
		this.selected = data.current;
		this.refresh();
	}

	refresh() {
		const pre = document.createElement("pre");
		pre.className += "hfpre";
		let hexview = HexTemplateBase();
		// fill hexes
		for (let i = 1; i <= 19; i++) {
			const hname = i.toString();
			const selclass = this.selected == i ? "hfsel" : "";
			hexview = hexview.replace(
				"$" + hname + ".",
				'<span class="' +
					selclass +
					'" aria-label="' +
					hname +
					": " +
					this.data.values[i - 1] +
					'">' +
					hname +
					" </span>"
			);
		}
		// fill hexinfo
		let hexinfo = DirectionsTemplate;
		Object.keys(this.data.directions).forEach((key) => {
			hexinfo = hexinfo.replace("$" + key, this.data.directions[key]);
		});
		hexinfo = hexinfo.replace("$roll", this.data.roll);
		pre.innerHTML = hexview;

		// current value
		const current = document.createElement("div");
		current.innerHTML = this.data.values[this.data.current - 1];
		current.className += "hresult";

		// icons row
		const icons = document.createElement("div");
		icons.className += "hicons";
		let tmp = document.createElement("span");
		tmp.innerHTML = DiceImage.trim();
		tmp.onclick = this.actionRoll.bind(this);
		tmp.setAttribute("aria-label", "Roll");
		icons.appendChild(tmp);
		tmp = document.createElement("span");
		tmp.setAttribute("aria-label", "Manual set");
		tmp.onclick = this.actionManual.bind(this);
		tmp.innerHTML = HandImage.trim();
		icons.appendChild(tmp);
		tmp = document.createElement("span");
		tmp.setAttribute("aria-label", "Reset");
		tmp.onclick = this.actionReset.bind(this);
		tmp.innerHTML = ResetImage.trim();
		icons.appendChild(tmp);

		// final table
		const table = document.createElement("table");
		table.className += "hftab-nb";
		let tr = document.createElement("tr");
		let td = document.createElement("td");
		td.appendChild(pre);
		tr.appendChild(td);
		td = document.createElement("td");
		td.innerHTML = hexinfo;
		tr.appendChild(td);
		table.appendChild(tr);
		tr = document.createElement("tr");
		td = document.createElement("td");
		td.setAttribute("colspan", "2");
		td.appendChild(icons);
		tr.appendChild(td);
		table.appendChild(tr);

		tr = document.createElement("tr");
		td = document.createElement("td");
		td.setAttribute("colspan", "2");
		td.appendChild(current);
		tr.appendChild(td);
		table.appendChild(tr);

		this.view = table;
	}

	setSelected(num: number) {
		this.selected = num;
		this.refresh();
	}

	async actionRoll(evt: MouseEvent) {
		evt.stopPropagation();
		evt.stopImmediatePropagation();
		console.log("actionRoll");
	}

	async actionManual(evt: MouseEvent) {
		evt.stopPropagation();
		evt.stopImmediatePropagation();
	}

	async actionReset(evt: MouseEvent) {
		evt.stopPropagation();
		evt.stopImmediatePropagation();
		const dlg = new ResetModal(this.app, async (value: string) => {
			const num = Number.parseInt(value);
			if (Number.isNaN(num)) {
				return;
			}
			this.data.current = num;
			this.selected = num;
			const result = await FindHexflowerText(this.app, this.data.name);
			ReplaceInCurrentFile(
				this.app,
				result.filePosition,
				result.filePosition + result.length,
				"```hexflower\n" + stringifyYaml(this.data) + "```"
			);
			// new Notice("Hexflower reset");
		});
		dlg.open();
	}
}
