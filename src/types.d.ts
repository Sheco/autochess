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

	interface Mods {
		attack?: Dice[]
		maxhp?: number
	}
	export interface BoardUnit {
		player?:Player,
		unit:Unit
		setx:number
		sety:number
		hp: number
		x:number
		y:number
		energy:number
		mods: Mods
		highlight?:string
		damage?:AttackRoll
	}

	interface TraitMods {
		target: Trait,
		values: Mods

	}
	interface TraitRank {
		trait: Trait
		message: string
		levels: {
			amount: number
			mods: TraitMods[]
		}[]
	}

	interface TraitRankActive extends TraitRank {
		active: number,
		level: number
		mods: TraitMods[]
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
		hand: Unit[],
		dimUnits?:boolean
	}

	export interface DamageRoll {
		damage:number,
		max:number,
		min:number,
		dice:Dice[],
	}
	interface AttackRoll extends DamageRoll {
		attacker: BoardUnit
		attackingPlayer: Player
		defender: BoardUnit
		defendingPlayer: Player
	}

	export interface Coordinate {
		x: number;
		y: number;
	}

	type AttackFunction = (attack:AttackRoll)=>Promise<void>

}
export {}
