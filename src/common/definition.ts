// Hexflower definition format (yaml)

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
	values: string[];
	icons: Record<number, string>[];
	current: number;
}

export const HfParse = (data: any): HfDef => {
	const retv = <HfDef>{
		name: data.name,
		author: data.author ? data.author : "Unknown",
		source: data.source ? data.source : "",
		navigation: [],
		values: data.values ? data.values : [],
		icons: data.icons ? data.icons : [],
		current: data.current ? data.current : 10,
	};
	if (data.navigation) {
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
	}
	return retv;
};

/*
name: Siege Events
source: https://penpaperanddice.home.blog/2019/11/20/to-the-battlements/
navigation:
  - name: Nav one
    n: 12
    ne: 2,3
    se: 4,5
    s: 6
    sw: 8,9
    nw: 10
    in: 23
    roll: 2d6
  - name: Nav to
    n: 12
    ne: 2,3
    se: 4,5
    s: 6
    sw: 8,9
    nw: 11,14
    in: null
    roll: 1d6+1d8
values:
  - Fire! The supplies are in danger
  - Poisoning! The water supplies are spoiled.
  - Sappers! The walls are under attack from underground.
  - Disease! Death spreads in the keep.
  - Sabotage! Tools and weapons are ruined.
  - Assassins! The officers are under attack.
  - Deserters! Mutineers have found a way out.
  - Treason! The gates are opened from the inside.
  - Mutiny! The besieged demand resolution.
  - Volunteers from the civilians have bolstered our ranks.
  - Poisoning! The water supplies are spoiled.
  - Sabotage! Tools and weapons are ruined.
  - Famine! Food is spoiled.
  - Deserters! Mutineers have found a way out.,
  - Sappers! The walls are under attack from underground.
  - Fire! The supplies are in danger
  - Mutiny! The besieged demand resolution.
  - Famine! Food is spoiled.
  - Deserters! Mutineers have found a way out.
current: 11
*/
