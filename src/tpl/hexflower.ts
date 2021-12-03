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
			// hex labels
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
			if (this.plugin.settings.showValueTooltips) {
				tmp.setAttribute("aria-label", this.data.values[i - 1]);
			} else {
				tmp.removeAttribute("aria-label");
			}
			tmp.style.cursor = "help";

			// circles
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
			// hex icons
			if (
				this.data.icons &&
				this.plugin.settings.showIcons &&
				i - 1 < this.data.icons.length
			) {
				const hexagon = pre.find("#hf" + i);
				const fname = this.data.icons[i - 1];
				const img = this.plugin.app.vault
					.getFiles()
					.filter((f) => f.path == fname);
				if (img && img.length > 0) {
					const ii = pre.find("#ic" + i);
					const im = ii.find("image");
					im.setAttribute(
						"xlink:href",
						this.plugin.app.vault.getResourcePath(img[0])
					);
					hexagon.style.fill = "url(#ic" + i + ")";
					hexagon.style.fillOpacity =
						this.plugin.settings.iconOpacity.toString();
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
