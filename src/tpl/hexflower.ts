import { HexflowerImage } from "assets/hexflower";
import { HfDef } from "common/definition";

const HexFontColor = "white";
const HexSelColor = "coral";

// Main hexflower view from SVG image
export class HexflowerTemplate {
	data: HfDef;
	view: HTMLDivElement;

	constructor(data: HfDef) {
		this.data = data;
		this.refresh();
	}

	refresh() {
		const pre = createDiv();
		pre.innerHTML = HexflowerImage.trim();
		pre.className += "hexblock";
		for (let i = 1; i <= 19; i++) {
			let tmp = pre.find("#h" + i);
			if (tmp) {
				if (i == this.data.current) {
					tmp.style.fill = HexSelColor;
				} else {
					tmp.style.fill = HexFontColor;
				}
			}
			tmp.setAttribute("aria-label", this.data.values[i - 1]);
			tmp.style.cursor = "help";

			tmp = pre.find("#c" + i);
			if (tmp) {
				if (i == this.data.current) {
					tmp.setAttribute("fill", HexSelColor);
				} else {
					tmp.setAttribute("fill", "none");
				}
			}
		}
		this.view = pre;
	}
}
