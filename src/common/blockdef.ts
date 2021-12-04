// Hexflower definition format (yaml)
import { App } from "obsidian";
import { AddError, ErrorInfo } from "./util";

export interface HfNavDef {
	name: string;
	n: string;
	ne: string;
	se: string;
	s: string;
	nw: string;
	sw: string;
	in: string;
	roll: string;
}

export interface HfDef {
	name: string;
	author: string;
	source: string;
	navigation: HfNavDef[];
	values: Record<number, string>;
	icons: Record<number, string>;
	current: number;

	errors: ErrorInfo[];
}

export const HfWithError = (scope: string, text: string): HfDef => {
	return <HfDef>{
		errors: AddError([], scope, text),
	};
};

const loadFromTemplate = (app: App, path: string): any => {
	const fl = app.vault.getMarkdownFiles().filter((f) => {
		return f.path == (path.endsWith(".md") ? path : path + ".md");
	});
	if (fl.length > 0) {
		let fm = app.metadataCache.getFileCache(fl[0])?.frontmatter;
		return fm;
	}
	return null;
};

export const HfParse = (app: App, src: any): HfDef => {
	if (!src || src == null) {
		return HfWithError("hfparse", "Bad hexflower specification");
	}
	let data = src;
	if (data.template && data.template.trim() != "") {
		const tpl = loadFromTemplate(app, data.template);
		if (tpl) {
			const name = data.name;
			data = tpl;
			data.name = name;
			data.errors = [];
		} else {
			return HfWithError(
				"hfparse",
				"Cannot find hexflower template " + data.template
			);
		}
	}

	const retv = <HfDef>{
		name: data.name,
		author: data.author ? data.author : "Unknown",
		source: data.source ? data.source : "",
		navigation: [],
		values: data.values ? data.values : [],
		icons: data.icons ? data.icons : [],
		current: data.current ? data.current : 10,
		errors: [],
	};
	if (data.navigation && data.navigation.length > 0) {
		retv.navigation = data.navigation.map((it: any) => {
			const nv = <HfNavDef>{
				name: it.name,
				n: it.n ? it.n : "",
				ne: it.ne ? it.ne : "",
				se: it.se ? it.se : "",
				s: it.s ? it.s : "",
				nw: it.nw ? it.nw : "",
				sw: it.sw ? it.sw : "",
				in: it.in ? it.in : "",
				roll: it.roll ? it.roll : "",
			};
			return nv;
		});
	} else {
		return HfWithError("hfparse", "No navigation hexes were defined");
	}
	return retv;
};
