import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { HfNavDef } from "common/blockdef";

const HexMoveMap: Record<string, any> = {
	"1": {
		n: 3,
		ne: 4,
		se: 5,
		s: 2,
		sw: 8,
		nw: 19,
		in: 1,
	},
	"2": {
		n: 1,
		ne: 5,
		se: 6,
		s: 3,
		sw: 13,
		nw: 16,
		in: 2,
	},
	"3": {
		n: 2,
		ne: 6,
		se: 7,
		s: 1,
		sw: 17,
		nw: 12,
		in: 3,
	},
	"4": {
		n: 4,
		ne: 8,
		se: 9,
		s: 5,
		sw: 1,
		nw: 18,
		in: 4,
	},
	"5": {
		n: 4,
		ne: 9,
		se: 10,
		s: 6,
		sw: 2,
		nw: 1,
		in: 5,
	},
	"6": {
		n: 5,
		ne: 10,
		se: 11,
		s: 7,
		sw: 3,
		nw: 2,
		in: 6,
	},
	"7": {
		n: 6,
		ne: 11,
		se: 12,
		s: 7,
		sw: 18,
		nw: 3,
		in: 7,
	},
	"8": {
		n: 8,
		ne: 8,
		se: 13,
		s: 9,
		sw: 4,
		nw: 8,
		in: 8,
	},
	"9": {
		n: 8,
		ne: 13,
		se: 14,
		s: 10,
		sw: 5,
		nw: 4,
		in: 9,
	},
	"10": {
		n: 9,
		ne: 14,
		se: 15,
		s: 11,
		sw: 6,
		nw: 5,
		in: 10,
	},
	"11": {
		n: 10,
		ne: 15,
		se: 16,
		s: 12,
		sw: 7,
		nw: 6,
		in: 11,
	},
	"12": {
		n: 11,
		ne: 16,
		se: 3,
		s: 12,
		sw: 19,
		nw: 7,
		in: 12,
	},
	"13": {
		n: 13,
		ne: 2,
		se: 17,
		s: 14,
		sw: 9,
		nw: 8,
		in: 13,
	},
	"14": {
		n: 13,
		ne: 17,
		se: 18,
		s: 15,
		sw: 10,
		nw: 9,
		in: 14,
	},
	"15": {
		n: 14,
		ne: 18,
		se: 19,
		s: 16,
		sw: 11,
		nw: 10,
		in: 15,
	},
	"16": {
		n: 15,
		ne: 19,
		se: 2,
		s: 16,
		sw: 12,
		nw: 11,
		in: 16,
	},
	"17": {
		n: 19,
		ne: 3,
		se: 8,
		s: 18,
		sw: 14,
		nw: 13,
		in: 17,
	},
	"18": {
		n: 17,
		ne: 7,
		se: 4,
		s: 19,
		sw: 15,
		nw: 14,
		in: 18,
	},
	"19": {
		n: 18,
		ne: 12,
		se: 1,
		s: 17,
		sw: 16,
		nw: 15,
		in: 19,
	},
};

// Returns newHex and roll value
export const RollHex = (
	current: number,
	navigation: HfNavDef,
	roll: number | null
): number[] => {
	let dr = roll;
	if (!dr) {
		dr = new DiceRoll(navigation.roll).total;
	}
	var curHex = HexMoveMap[current.toString()];
	if (!curHex) {
		return [current, 0];
	}
	let direction = "in";
	Object.keys(navigation).forEach((it, idx) => {
		let value = Object.values(navigation)[idx];
		value = value ? value.toString() : "";
		if (it != "name" && it != "roll" && value) {
			const parts = value.split(",");
			parts.forEach((part: any) => {
				const num = Number.parseInt(part);
				if (!Number.isNaN(num)) {
					if (dr == num) {
						direction = it;
					}
				}
			});
		}
	});
	const nextHex = curHex[direction];
	return [nextHex, dr];
};
