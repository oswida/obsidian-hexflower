import { MarkdownPostProcessorContext, parseYaml } from "obsidian";
import { HexView } from "./hexview";

export function rollHexflower() {
	alert("roll");
}

export const HexflowerHandler = (
	source: string,
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext
) => {
	const hexdata = parseYaml(source);
	const hv = new HexView(hexdata);
	el.appendChild(hv.view);
};
