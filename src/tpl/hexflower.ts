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
		this.view = createDiv();
		this.refresh();
		this.plugin.registerEvent(
			this.plugin.app.workspace.on("hexflower:update-colors", () => {
				this.updateColors();
			})
		);
		this.plugin.registerEvent(
			this.plugin.app.workspace.on("hexflower:update-settings", () => {
				this.refresh();
			})
		);
	}

	refresh() {
		const pre = this.view;
		pre.empty();

		pre.innerHTML = HexflowerImage.trim();
		pre.className += "hexblock";

		for (let i = 1; i <= 19; i++) {
			// hex labels
			let tmp = pre.find("#h" + i);
			if (tmp) {
				if (!this.plugin.settings.showNumbers) {
					tmp.style.fill = "none";
				} else if (i == this.data.current) {
					tmp.style.fill = this.plugin.settings.selectedHexColor;
					tmp.setAttribute("data-selected", "true");
				} else {
					tmp.style.fill = this.plugin.settings.textHexColor;
					tmp.removeAttribute("data-selected");
				}
			}

			const hexagon = pre.find("#hf" + i);

			// hex selection
			if (hexagon) {
				if (i == this.data.current) {
					hexagon.style.stroke =
						this.plugin.settings.selectedHexColor;
					hexagon.style.strokeWidth = "3";
				} else {
					hexagon.style.stroke = "none";
				}
				if (this.plugin.settings.showValueTooltips) {
					hexagon.setAttribute("aria-label", this.data.values[i - 1]);
				} else {
					hexagon.removeAttribute("aria-label");
				}
			}

			// hex icons
			if (
				this.data.icons &&
				this.plugin.settings.showIcons &&
				this.data.icons[i - 1]
			) {
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
			} else {
				hexagon.style.fill = "transparent";
			}
		}

		const lines = pre.findAll("line");
		lines.forEach((l) => {
			if (!l.getAttribute("data-finish-line"))
				l.style.stroke = this.plugin.settings.lineHexColor;
		});
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
