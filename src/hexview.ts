import { DiceImage } from "assets/dice";
import { ResetModal } from "modal";
import {
	App,
	Events,
	MarkdownPostProcessorContext,
	Notice,
	stringifyYaml,
} from "obsidian";
import { NavigationHexTemplate } from "template";
import { HandImage } from "./assets/hand";
import { HexflowerImage } from "./assets/hexflower";
import { NavigationImage } from "./assets/navigation";
import { FindHexflowerText, ReplaceInCurrentFile } from "./parser";

const fillNavigationRolls = (data: any, roll: string): string => {
	let txt = NavigationImage.trim();
	txt = txt.replace("{N}", data.n);
	txt = txt.replace("{NE}", data.ne);
	txt = txt.replace("{NW}", data.nw);
	txt = txt.replace("{S}", data.s);
	txt = txt.replace("{SE}", data.se);
	txt = txt.replace("{SW}", data.sw);
	if (data.in) {
		txt = txt.replace("{IN}", data.in);
	} else {
		txt = txt.replace("{IN}", "");
	}
	txt = txt.replace("{ROLL}", roll);

	return txt;
};

const makeNavigation = (
	data: any,
	parent: HTMLDivElement,
	roll: string
): HTMLSpanElement[] => {
	var retv: HTMLSpanElement[] = [];

	let hexinfo = document.createElement("td");
	hexinfo.innerHTML = NavigationHexTemplate.trim();

	const inside = hexinfo.find("#inside");
	if (inside) {
		const t = createEl("span");
		t.innerHTML = "<br/><b>" + roll + "</b>";
		inside.appendChild(t);
	}
	const navinfo = hexinfo.find("#navinfo");
	if (navinfo) {
		var encoded = window.btoa(fillNavigationRolls(data, roll));
		navinfo.style.background =
			"url(data:image/svg+xml;base64," +
			encoded +
			") no-repeat center center";
	}
	const e = hexinfo.find("#navicons");
	if (e) {
		let tmp = createSpan();
		tmp.innerHTML = DiceImage.trim();
		tmp.setAttribute("aria-label", "Roll");
		e.appendChild(tmp);
		retv[0] = tmp;
		tmp = createSpan();
		tmp.setAttribute("aria-label", "Manual result");
		tmp.innerHTML = HandImage.trim();
		e.appendChild(tmp);
		retv[1] = tmp;
	}

	const d = hexinfo.find("#navdesc");
	if (d) {
		d.innerHTML = data.desc;
	}

	parent.appendChild(hexinfo);
	return retv;
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
		// hexflower hexes
		const pre = createDiv();
		pre.innerHTML = HexflowerImage.trim();
		pre.className += "hexblock";
		for (let i = 1; i <= 19; i++) {
			let tmp = pre.find("#h" + i);
			if (tmp) {
				if (i == this.selected) {
					tmp.style.fill = "coral";
				} else {
					tmp.style.fill = "white";
				}
			}
			tmp.setAttribute("aria-label", this.data.values[i - 1]);
			tmp = pre.find("#c" + i);
			if (tmp) {
				if (i == this.selected) {
					tmp.setAttribute("fill", "coral");
				} else {
					tmp.setAttribute("fill", "none");
				}
			}
		}
		// navigation
		const hexinfo = document.createElement("table");
		const hirow = document.createElement("tr");
		hexinfo.appendChild(hirow);
		this.data.navigation.forEach((obj: any) => {
			const buttons = makeNavigation(obj, hirow, this.data.roll);
			// buttons[0].onclick = this.actionRoll.bind(this);
			// buttons[0].onclick = this.actionRoll.bind(this);
		});

		// current value
		const current = document.createElement("div");
		current.innerHTML =
			"Roll result: " + this.data.values[this.data.current - 1];
		current.className += "hresult";

		// icons row
		const icons = document.createElement("div");
		icons.className += "hicons";
		let tmp = document.createElement("button");
		// tmp.setAttribute("aria-label", "Reset");
		tmp.onclick = this.actionReset.bind(this);
		tmp.innerHTML = "Reset";
		// tmp.innerHTML = ResetImage.trim();
		icons.appendChild(tmp);

		// final table
		const table = document.createElement("table");
		table.className += "hftab-nb";
		let tr = document.createElement("tr");
		let td = document.createElement("td");
		td.appendChild(icons);
		td.appendChild(pre);

		tr.appendChild(td);
		td = document.createElement("td");
		td.appendChild(hexinfo);
		tr.appendChild(td);
		table.appendChild(tr);

		this.view = createDiv();
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
