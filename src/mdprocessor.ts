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

	// let txt = HexflowerSmall;

	// const e = document.createElement("table");
	// el.appendChild(e);

	// txt = txt.replace("$N", hexd.directions.n);
	// txt = txt.replace("$NE", hexd.directions.ne);
	// txt = txt.replace("$NW", hexd.directions.nw);
	// txt = txt.replace("$S", hexd.directions.s);
	// txt = txt.replace("$SE", hexd.directions.se);
	// txt = txt.replace("$SW", hexd.directions.sw);
	// txt = txt.replace("$INSIDE", hexd.directions.in);
	// txt = txt.replace("$ROLL", hexd.roll);
	// txt = txt.replace("$CURR", hexd.current);
	// txt = txt.replace(
	// 	"$CURRVALUE",
	// 	'<span class="hfinfo">' + hexd.values[hexd.current - 1] + "</span>"
	// );
	// txt = txt.replace("$DICE", DiceImage);

	// for (let i = 1; i <= 19; i++) {
	// 	const name = i.toString();
	// 	if (hexd.current == i) {
	// 		txt = txt.replace(
	// 			"$" + name + " ",
	// 			'<span style="color:yellow" title="' +
	// 				hexd.values[i - 1] +
	// 				'">' +
	// 				name +
	// 				" </span>"
	// 		);
	// 	} else {
	// 		txt = txt.replace(
	// 			"$" + name + " ",
	// 			'<span title="' + hexd.values[i - 1] + '">' + name + " </span>"
	// 		);
	// 	}
	// }
	// console.log(txt);
	// el.innerHTML = txt;
};

// export const HexflowerProcessor = (
// 	el: HTMLElement,
// 	ctx: MarkdownPostProcessorContext
// ) => {
// 	console.log("Hexflowers");
// 	let nodeList = el.querySelectorAll("code");
// 	if (!nodeList.length) return;

// 	for (let index = 0; index < nodeList.length; index++) {
// 		const node = nodeList.item(index);

// 		console.log(node.innerText);
// 	}
// };
