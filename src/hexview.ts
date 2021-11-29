import { DiceImage } from "assets/dice";
import { ResetImage } from "assets/reset";
import { HexTemplateBase } from "template";
import { HandImage } from "./assets/hand";
import { DirectionsTemplate } from "./template";

export class HexView {
	view: HTMLDivElement;
	data: any;
	selected: number;

	constructor(data: any) {
		this.data = data;
		this.selected = 10;
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
					'" data-title="' +
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
		const tmp = document.createElement("div");
		tmp.innerHTML = DiceImage.trim();
		const ic1 = tmp.firstChild;
		(ic1 as HTMLElement).setAttribute("data-title", "Roll");
		icons.appendChild(ic1);
		tmp.innerHTML = HandImage.trim();
		const ic2 = tmp.firstChild;
		icons.appendChild(ic2);
		tmp.innerHTML = ResetImage.trim();
		const ic3 = tmp.firstChild;
		icons.appendChild(ic3);

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
}
