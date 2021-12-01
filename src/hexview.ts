import { DiceImage } from "assets/dice";
import { ResetImage } from "assets/reset";
import { ResetModal } from "modal";
import {
	App,
	Events,
	MarkdownPostProcessorContext,
	Notice,
	stringifyYaml,
} from "obsidian";
import { HexTemplateBase, NavigationHexTemplate } from "template";
import { HandImage } from "./assets/hand";
import { HexagonImage } from "./assets/hexagon";
import { FindHexflowerText, ReplaceInCurrentFile } from "./parser";

const makeNavigation = (
	data: any,
	parent: HTMLDivElement,
	roll: string
): HTMLSpanElement => {
	let hexinfo = document.createElement("td");
	let txt = NavigationHexTemplate;
	txt = txt.replace("{N}", data.n);
	txt = txt.replace("{NE}", data.ne);
	txt = txt.replace("{NW}", data.nw);
	txt = txt.replace("{S}", data.s);
	txt = txt.replace("{SW}", data.sw);
	txt = txt.replace("{SE}", data.se);
	if (data.in) {
		txt = txt.replace("{IN}", data.in);
	} else {
		txt = txt.replace("{IN}", "");
	}

	hexinfo.innerHTML = txt;
	const inside = hexinfo.find("#inside");
	if (inside) {
		const t = createEl("span");
		t.innerHTML = "<br/><b>" + roll + "</b>";
		inside.appendChild(t);
	}
	const tab = hexinfo.find("#bkgtable");
	tab.className += "navtext";
	var encoded = window.btoa(HexagonImage);
	tab.style.background =
		"url(data:image/svg+xml;base64," +
		encoded +
		") no-repeat center center";

	const e = hexinfo.find("#navicons");
	let tmp = createSpan();
	tmp.innerHTML = DiceImage.trim();
	tmp.setAttribute("aria-label", "Roll");
	e.appendChild(tmp);
	tmp = createSpan();
	tmp.setAttribute("aria-label", "Manual roll");
	// tmp.onclick = this.actionManual.bind(this);
	tmp.innerHTML = HandImage.trim();
	e.appendChild(tmp);

	const d = hexinfo.find("#navdesc");
	if (d) {
		d.innerHTML = data.desc;
	}

	parent.appendChild(hexinfo);
	return tmp;
};

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
		pre.innerHTML = hexview;

		// navigation
		const hexinfo = document.createElement("table");
		const hirow = document.createElement("tr");
		hexinfo.appendChild(hirow);
		this.data.navigation.forEach((obj: any) => {
			const el = makeNavigation(obj, hirow, this.data.roll);
			el.onclick = this.actionRoll.bind(this);
		});

		// current value
		const current = document.createElement("div");
		current.innerHTML =
			"Roll result: " + this.data.values[this.data.current - 1];
		current.className += "hresult";

		// icons row
		const icons = document.createElement("div");
		icons.className += "hicons";
		let tmp = document.createElement("span");

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
		td.appendChild(hexinfo);
		tr.appendChild(td);
		table.appendChild(tr);
		tr = document.createElement("tr");
		td = document.createElement("td");
		td.setAttribute("colspan", "2");
		td.appendChild(icons);
		tr.appendChild(td);
		table.appendChild(tr);

		this.view = createDiv("");
		this.view.appendChild(table);
		this.view.appendChild(current);
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
			new Notice("Hexflower reset");
		});
		dlg.open();
	}
}
