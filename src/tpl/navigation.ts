import { NavigationImage } from "assets/navigation";
import { HfNavDef } from "common/definition";
import { RollHex } from "common/roll";
import { App, Notice } from "obsidian";

// Hex navigation section, can be more than one

const tpl = `
<div>
    <div class="navblock" id="navinfo"></div>
    <div class="centered" id="navdesc" style="margin-top: 2em;margin-left: 2em;"></div>
</div>
`;

const HexNavRollColor = "goldenrod";
const HexNavResultColor = "cadetblue";
const HexNavLineColor = "#333333";

export class HexNavTemplate {
	app: App;
	data: HfNavDef;
	view: HTMLDivElement;
	current: number;
	refreshFunc: (newHex: number) => void;

	constructor(
		app: App,
		data: HfNavDef,
		current: number,
		refreshFunc: (newHex: number) => void
	) {
		this.app = app;
		this.data = data;
		this.current = current;
		this.refreshFunc = refreshFunc;
		this.refresh();
	}

	refresh() {
		const el = createEl("td");
		el.innerHTML = tpl.trim();
		const navinfo = el.find("#navinfo");
		navinfo.innerHTML = NavigationImage.trim();
		let tmp = navinfo.find("#roll");
		if (tmp) {
			tmp.innerHTML = this.data.roll;
			tmp.style.fill = HexNavRollColor;
			tmp.ariaLabel = "Roll";
			tmp.style.cursor = "hand";
			const clickFunc = (evt: MouseEvent) => {
				evt.stopPropagation();
				evt.stopImmediatePropagation();
				this.roll(null);
			};
			tmp.onclick = clickFunc.bind(this);
		}
		Object.keys(this.data).forEach((it, idx) => {
			if (it != "roll" && it != "name") {
				tmp = navinfo.find("#" + it);
				if (tmp) {
					let nums = Object.values(this.data)[idx];
					nums = nums ? nums.toString() : "";
					tmp.innerHTML = nums;
					tmp.style.fill = HexNavResultColor;
					tmp.ariaLabel = "🎲 " + nums;
					tmp.style.cursor = "hand";
					const rollValue = nums ? nums.split(",")[0].trim() : null;
					const clickFunc = (evt: MouseEvent) => {
						evt.stopPropagation();
						evt.stopImmediatePropagation();
						this.roll(rollValue);
					};
					tmp.onclick = clickFunc.bind(this);
				}
			}
		});

		const lines = navinfo.findAll("line");
		lines.forEach((it) => {
			it.style.stroke = HexNavLineColor;
		});

		const navdesc = el.find("#navdesc");
		navdesc.innerHTML = this.data.name;

		this.view = el;
	}

	roll(value: number | null) {
		const [result, roll] = RollHex(this.current, this.data, value);
		this.current = result;
		if (this.refreshFunc) {
			this.refreshFunc(this.current);
		}
		new Notice(this.data.name + " ⬢ " + this.current + " 🎲 " + roll);
	}
}
