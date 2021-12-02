import { HexflowerImage } from "assets/hexflower";
import { HfDef } from "common/definition";
import HexflowerPlugin from "main";

// Main hexflower view from SVG image
export class HexflowerTemplate {
	data: HfDef;
	view: HTMLDivElement;
	plugin: HexflowerPlugin;

	constructor(plugin: HexflowerPlugin, data: HfDef) {
		this.data = data;
		this.plugin = plugin;
		this.refresh();
		this.plugin.registerEvent(
			this.plugin.app.workspace.on("hexflower:update-colors", () => {
				this.updateColors();
			})
		);
	}

	refresh() {
		const pre = createDiv();
		pre.innerHTML = HexflowerImage.trim();
		pre.className += "hexblock";
		for (let i = 1; i <= 19; i++) {
			let tmp = pre.find("#h" + i);
			if (tmp) {
				if (i == this.data.current) {
					tmp.style.fill = this.plugin.settings.selectedHexColor;
					tmp.setAttribute("data-selected", "true");
				} else {
					tmp.style.fill = this.plugin.settings.textHexColor;
					tmp.removeAttribute("data-selected");
				}
			}
			tmp.setAttribute("aria-label", this.data.values[i - 1]);
			tmp.style.cursor = "help";

			tmp = pre.find("#c" + i);
			if (tmp) {
				if (i == this.data.current) {
					tmp.setAttribute(
						"fill",
						this.plugin.settings.selectedHexColor
					);
					tmp.setAttribute("data-selected-center", "true");
				} else {
					tmp.setAttribute("fill", "none");
					tmp.removeAttribute("data-selected-center");
				}
			}
		}

		const lines = pre.findAll("line");
		lines.forEach((l) => {
			if (!l.getAttribute("data-finish-line"))
				l.style.stroke = this.plugin.settings.lineHexColor;
		});

		this.view = pre;
	}

	updateColors() {
		const nodes = this.plugin.app.workspace.containerEl.findAll(
			"#hexflower-main-area"
		);
		nodes.forEach((n) => {
			const lines = n.findAll("line");
			lines.forEach((l) => {
				if (!l.getAttribute("data-finish-line"))
					l.style.stroke = this.plugin.settings.lineHexColor;
			});
			const txt = n.findAll("text");
			txt.forEach((t) => {
				if (t.getAttribute("data-selected")) {
					t.style.fill = this.plugin.settings.selectedHexColor;
				} else {
					t.style.fill = this.plugin.settings.textHexColor;
				}
			});
			const cc = n.findAll("circle");
			cc.forEach((t) => {
				if (t.getAttribute("data-selected-center")) {
					t.setAttribute(
						"fill",
						this.plugin.settings.selectedHexColor
					);
				} else {
					t.setAttribute("fill", "none");
				}
			});
		});
	}
}
