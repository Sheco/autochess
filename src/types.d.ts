declare global {
	export interface Trait {
		id: string;
		name: string;
		icon: string;
	}

	interface Type {
		id: string,
		name: string,
		icon: string,
	}

	interface Targetting {
		id: string;
		name: string;
		targets: number;
	}
	interface Dice {
		type: Type,
		amount: number,
		sides: number,
		modifier: number,
	}

	export interface Effect {
		target: Trait,
		type: string,
		value: number
	}
	export interface CombatEffect extends Effect {
		active: boolean
		message: test
	}

	export type CombatTraitFunction = (defender:BoardUnit) => CombatEffect[]
	export type TeamTraitFunction = (board:Board) => Effect[]

	export interface EffectFunctionArgs {
		attacker: Unit
		defender?: Unit
		board?: Board
	}

	export type EffectFunction = (args:EffectFunctionArgs) => Effect

	export interface Unit {
		id: string;
		name: string;
		info: string;
		maxhp: number,
		energymax: number;
		energypertick: number;
		traits: Trait[];
		targetting: Targetting;
		cost: number;
		attack: Dice[];
		weakness: Dice[];
	}

	/*
	interface Mods {
		attack?: Dice[]
		maxhp?: number
	}
	*/

	interface AttributeMod {
		attribute: string,
		value: number
	}
	interface DiceMod {
		attribute: string,
		dice: Dice[]
	}
	type Mod = AttributeMod|DiceMod

	export interface BoardUnit extends Unit {
		unit: Unit,
		player?:Player,
		setCoord:Coordinate
		realCoord:Coordinate
		hp: number
		energy:number
		mods: Mod[]
		ui: {
			style?:string
			damage?:DamageRoll
			hp:number
		}
	}

	interface TraitMod {
		target: Trait,
		mods: Mod[]

	}
	interface TraitRank {
		trait: Trait
		message: string
		levels: {
			amount: number
			mods: TraitMod[]
		}[]
	}

	interface TraitRankActive extends TraitRank {
		active: number,
		level: number
		mods: TraitMod[]
	}
	export type Board = BoardUnit[]
	export interface Player {
		id: string,
		name: string,
		hp: number,
		board: Board,
		mirrored: boolean,
		color: string,
		finished: boolean,
		maxgold: number,
		gold: number,
		rolls: number,
		traits: TraitRankActive[],
		hand: Board,
		dimUnits?:boolean
	}

	export interface DamageRoll {
		damage:number,
		max:number,
		min:number,
		dice:Dice[],
	}

	interface AttackRoll {
		defender: BoardUnit
		defendingPlayer: Player
		roll: DamageRoll
	}

	interface Attack {
		attacker: BoardUnit
		attackingPlayer: Player
		attacks: AttackRoll[]
	}

	export interface Coordinate {
		x: number;
		y: number;
	}

	interface ThrottledGenerator<T> {
		stop: () => void,
		items: AsyncGenerator<T>
	}
	type AttackFunction = (attack:AttackRoll)=>Promise<void>

}
export {}
