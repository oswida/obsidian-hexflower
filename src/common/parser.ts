import { App, MarkdownView } from "obsidian";

interface HexflowerBlock {
	fullContent: string;
	filePosition: number;
	length: number;
}

const currentFileContent = async (app: App): Promise<string | null> => {
	const activeView = app.workspace.getActiveViewOfType(MarkdownView);
	if (activeView) {
		return await app.vault.read(activeView.file);
	}
	return null;
};

const updateCurrentFileContent = async (app: App, data: string) => {
	const activeView = app.workspace.getActiveViewOfType(MarkdownView);
	if (activeView) {
		await app.vault.modify(activeView.file, data);
	}
};

export const FindHexflowerText = async (
	app: App,
	name: string
): Promise<HexflowerBlock | null> => {
	const content = await currentFileContent(app);
	if (content) {
		const regHex = new RegExp(
			"```hexflower[^`]*name:\\s*" + name + "[^`]*```"
		);
		const result = regHex.exec(content);
		return {
			fullContent: result[0],
			filePosition: result.index,
			length: result[0].length,
		} as HexflowerBlock;
	}
	return null;
};

export const ReplaceInCurrentFile = async (
	app: App,
	start: number,
	end: number,
	newdata: string
) => {
	const content = await currentFileContent(app);
	const part1 = content.substr(0, start);
	const part2 = content.substr(end);
	const result = part1 + newdata + part2;
	updateCurrentFileContent(app, result);
};

export interface NavigationBlock {
	name: string;
	n: string;
	ne: string;
	se: string;
	s: string;
	sw: string;
	nw: string;
	in: string;
	roll: string;
}
