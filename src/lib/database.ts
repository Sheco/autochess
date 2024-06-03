let targetting:Targetting[] = [
	{
		id: 'closest1',
		name: 'El enemigo más cercano',
		targets: 1,
	},
	{
		id: 'nearby',
		name: 'Uno de los dos enemigos mas cercanos',
		targets: 1,
	},
	{
		id: 'farthest1',
		name: 'El enemigo más lejano',
		targets: 1,
	},
	{
		id: 'farthest2',
		name: 'Los 2 enemigos más lejanos',
		targets: 2,
	},
	
	{
		id: 'farthest1_direct',
		name: 'Un enemigo no bloqueado',
		targets: 1,
	},
	{
		id: 'weakest1',
		name: 'El énemigo con menos HP',
		targets: 1,
	},
	{
		id: 'everyone',
		name: 'Todos los enemigos',
		targets: 1,
	},
	{
		id: 'random',
		name: 'Un enemigo al azar',
		targets: 1,
	}
]

let TargettingMap = Object.fromEntries(targetting.map(t => [ t.id, t ]))

export let NoUnit = {
	id: '',
	name: '',
	info: '',
	hp: 0,
	defense: 0,
	energymax: 0,
	energypertick: 0,
	traits: [],
	targetting: TargettingMap.closest1,
	cost: 0,
	attack: { amount: 1, sides: 1, modifier: 1 },
	teamTraits: [],
}

let Traits:Trait[] = [
	{
		id: 'unit',
		name: '',
		icon: '*️',
	},
	{
		id: 'fire',
		name: 'Fuego',
		icon: '🔥',
		
	},
	{
		id: 'earth',
		name: 'Tierra',
		icon: '⛰️',
	},
	{
		id: 'metal',
		name: 'Metal',
		icon: '⚙️',
	},
	{
		id: 'water',
		name: 'Agua',
		icon: '💧',
	},
	{
		id: 'wood',
		name: 'Madera',
		icon: '🪵',
	},
	{
		id: 'female',
		name: 'Mujer',
		icon: '♀️',
	},
	{
		id: 'male',
		name: 'Hombre',
		icon: '♂️',
	},
	{
		id: 'guardian',
		name: 'Guardian',
		icon: '🛡️'
	},
]
let Types:Type[] = [
	{
		id: 'fire',
		name: 'Fuego',
		icon: '🔥',
		
	},
	{
		id: 'earth',
		name: 'Tierra',
		icon: '⛰️',
	},
	{
		id: 'metal',
		name: 'Metal',
		icon: '⚙️',
	},
	{
		id: 'water',
		name: 'Agua',
		icon: '💧',
	},
	{
		id: 'wood',
		name: 'Madera',
		icon: '🪵',
	},
	{
		id: 'cut',
		name: 'Cortante',
		icon: '🪓',
	},
	{
		id: 'pierce', 
		name: 'Penetrante',
		icon: '🗡️',
	},
	{
		id: 'blunt',
		name: 'Contundente',
		icon: '🔨',
	}

]
export let TypeMap = Object.fromEntries(Types.map(c => [ c.id, c ]))
export let TraitMap = Object.fromEntries(Traits.map(c => [ c.id, c ]))

export let boardTraitRanks:TraitRank[] = [
	{ 
		trait: TraitMap.fire, 
		message: 'Al quemarse, el Fuego produce cenizas, que enriquecen y fertilizan la Tierra.<br>Las unidades de tierra tendrán más vida.',
		levels: [
			{
				amount: 1,
				mods: [
					{ 
						target: TraitMap.earth,
						values: { maxhp: 2 },
					}
				]
			},
			{
				amount: 2,
				mods: [
					{
						target: TraitMap.earth,
						values: { maxhp: 4},
					},
					{
						target: TraitMap.fire,
						values: {
							attack: [{ type: TraitMap.fire, amount: 1, sides: 4, modifier: 0}],
						}
					}
				]
			},
		],
	},
	{
		trait: TraitMap.earth, 
		message: 'Dentro de la Tierra, los minerales y metales se forman y se extraen.<br>Las unidades de metal tendrán mas vida.',
		levels: [
			{
				amount: 1,
				mods: [
					{ 
						target: TraitMap.metal,
						values: { maxhp: 2 },
					}
				]
			},
			{
				amount: 2,
				mods: [
					{
						target: TraitMap.metal,
						values: { maxhp: 4},
					},
					{
						target: TraitMap.earth,
						values: {
							attack: [{ type: TraitMap.earth, amount: 1, sides: 4, modifier: 0}],
						}
					}
				]
			},
		],
	},
	{
		trait: TraitMap.wood,
		message: 'La Madera, representada por árboles y plantas, es el combustible que alimenta el Fuego.<br>Las unidades de fuego harán más daño',
		levels: [
			{
				amount: 1,
				mods: [
					{
						target: TraitMap.fire,
						values: {
							attack: [{ type: TraitMap.fire, amount: 1, sides: 4, modifier: 0}]
						}
					}
				]
			},
			{
				amount: 2,
				mods: [
					{
						target: TraitMap.wood,
						values: {
							attack: [{ type: TraitMap.wood, amount: 1, sides: 4, modifier: 0}]
						}
					},
					{
						target: TraitMap.fire,
						values: {
							attack: [{ type: TraitMap.fire, amount: 1, sides: 4, modifier: 0}]
						}
					}
				]
			},
		],
	},
	{
		trait: TraitMap.water, 
		message: 'El Agua nutre las semillas y plantas, permitiendo que crezcan y se conviertan en Madera.<br>Las unidades de madera tendrán más vida.',
		levels: [
			{
				amount: 1,
				mods: [
					{
						target: TraitMap.wood,
						values: { maxhp: 2 },
					}
				]
			},
			{
				amount: 2,
				mods: [
					{
						target: TraitMap.wood,
						values: { maxhp: 4},
					},
					{
						target: TraitMap.water,
						values: {
							attack: [{ type: TraitMap.water, amount: 1, sides: 4, modifier: 0}],
						}
					}
				]
			},
		],
	},
	{
		trait: TraitMap.metal, 
		message: 'El Metal, especialmente en forma de minerales, puede atraer y condensar agua. Además, en un sentido simbólico, el metal puede representar la pureza y la estructura que permite la conducción y el flujo del agua.<br>Las unidades de agua tendrán más vida.',
		levels: [
			{
				amount: 1,
				mods: [
					{
						target: TraitMap.water,
						values: { maxhp: 4 },
					}
				]
			},
			{
				amount: 2,
				mods: [
					{
						target: TraitMap.water,
						values: { maxhp: 4},
					},
					{
						target: TraitMap.metal,
						values: {
							attack: [{ type: TraitMap.metal, amount: 1, sides: 4, modifier: 0}],
						}
					}
				]
			},
		],
	}
]

export function updatePlayerTraits(player:Player) {
	let countUnitTraits = (trait:Trait) => player.board
		.reduce((total, curr) => {
			// get a list of unique units
			if(!total.find(u => u.id==curr.id))
				total.push(curr)
			return total
		}, [] as BoardUnit[])
		.reduce((total, curr) => total+(curr.traits.map(t=>t.id).includes(trait.id)? 1: 0), 0)
	player.traits = boardTraitRanks.map(traitrank => (
		{ ...traitrank, 
			active: countUnitTraits(traitrank.trait),
			level: 0 
		} as TraitRankActive))
		.filter(traitrank => traitrank.active>0)
		.map(traitrank => {
			// create a copy of the levels sorted by amount descending
			// to get the first biggest level matching
			traitrank.level = traitrank.levels.findLastIndex(rank => traitrank.active>=rank.amount)
			traitrank.mods = traitrank.levels[traitrank.level].mods
			return traitrank
		})
	player.board = player.board.map(bu => {
		bu.mods = player.traits.flatMap(trait => trait.mods) // get all mods
			// that target this unit's type
			.filter(trait => bu.traits.map(t => t.id).includes(trait.target.id))
			.map(mod => mod.values)
			// and sum them all up
			.reduce((total, mod) => {
				if(mod.maxhp) {
					if(total.maxhp===undefined) total.maxhp=0
					total.maxhp+=mod.maxhp
				}
				if(mod.attack) {
					if(total.attack===undefined) total.attack = []
					total.attack.push(...mod.attack)
				}
				return total
			},{})
		return bu
	})
}

export let Units:Unit[] = [ 
	{ 
		id: 'mermaid',
		name: 'Sirena',
		info: `Es una bella chica de cabello azul con cola de pez. Ataca invocando una ola magica desde atras del enemigo.`,
		maxhp: 15,
		attack: [
			{ type: TypeMap.water, amount: 2, sides: 4, modifier: 1 }
		],
		weakness: [
			{ type: TypeMap.earth, amount: 1, sides: 4, modifier: 0 }
		],
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.unit, TraitMap.water, TraitMap.female],
		targetting: TargettingMap.farthest1,
		cost: 1,
	},
	{ 
		id: 'waterelemental',
		name: 'Elemental de agua',
		info: `Es una creatura de agua viva, con grandes poderes mágicos. Ataca invocando un remolino de agua rasgador.`,
		maxhp: 20,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.unit, TraitMap.water, TraitMap.guardian],
		targetting: TargettingMap.nearby,
		cost: 1,
		attack: [
			{ type: TypeMap.water, amount: 1, sides: 4, modifier: 3 },
		],
		weakness: [
			{ type: TypeMap.earth, amount: 1, sides: 4, modifier: 0 },
		],
	},
	{ 
		id: 'gunner',
		name: 'Pistolero',
		info: `Es un rebelde sín causa que resuelve las problemas a balazos.\nAtaca disparando su pistola.`,
		maxhp: 15,
		energymax: 3,
		energypertick: 1,
		traits: [TraitMap.unit, TraitMap.metal, TraitMap.male],
		targetting: TargettingMap.farthest1_direct,
		cost: 1,
		attack: [
			{ type: TypeMap.metal, amount: 1, sides: 4, modifier: 4 },
		],
		weakness: [
			{ type: TypeMap.fire, amount: 1, sides: 4, modifier: 0 },
		],
	},
	{ 
		id: 'metalelemental',
		name: 'Elemental de metal',
		info: `Es un soldado con armadura de oro.\nAtaca dando un espadazo.`,
		maxhp: 20,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.unit, TraitMap.metal, TraitMap.guardian],
		targetting: TargettingMap.closest1,
		cost: 1,
		attack: [
			{ type: TypeMap.metal, amount: 1, sides: 4, modifier: 3 },
		],
		weakness: [
			{ type: TypeMap.fire, amount: 1, sides: 4, modifier: 0 },
		],
	},
	{
		id: 'firemage',
		name: 'Mago de fuego',
		info: `Es un mago elemental de fuego.\nAtaca lanzando una bola de fuego.`,
		maxhp: 15,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.unit, TraitMap.fire, TraitMap.female],
		targetting: TargettingMap.farthest1_direct,
		cost: 1,
		attack: [
			{ type: TypeMap.fire, amount: 1, sides: 8, modifier: 2 },
		],
		weakness: [
			{ type: TypeMap.water, amount: 1, sides: 4, modifier: 0 },
		],
	},
	{
		id: 'fireelemental',
		name: 'Elemental de fuego',
		info: `Es una creatura de fuego vivo.\nAtaca dando un puñetazo ardiente.`,
		maxhp: 20,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.unit, TraitMap.fire, TraitMap.guardian],
		targetting: TargettingMap.closest1,
		cost: 1,
		attack: [
			{ type: TypeMap.fire, amount: 1, sides: 4, modifier: 3 },
		],
		weakness: [
			{ type: TypeMap.water, amount: 1, sides: 4, modifier: 0 },
		],
	},
	{
		id: 'archer',
		name: 'Arquero',
		info: `Es un soldado con arco y flecha.\nAtaca disparando una lluvia de flechas.`,
		maxhp: 15,
		energymax: 3,
		energypertick: 1,
		traits: [TraitMap.unit, TraitMap.wood, TraitMap.male],
		targetting: TargettingMap.farthest2,
		cost: 1,
		attack: [
			{ type: TypeMap.wood, amount: 1, sides: 4, modifier: 1 },
		],
		weakness: [
			{ type: TypeMap.metal, amount: 1, sides: 4, modifier: 0 },
		],
	},
	{
		id: 'woodelemental',
		name: 'Elemental de madera',
		info: `Es una criatura humanoide de madera viva, por algun motivo solo puede decir "yo soy noob". Ataca con un latigo de raices.`,
		maxhp: 20,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.unit, TraitMap.wood, TraitMap.guardian],
		targetting: TargettingMap.nearby,
		cost: 1,
		attack: [
			{ type: TypeMap.wood, amount: 1, sides: 4, modifier: 3 },
		],
		weakness: [
			{ type: TypeMap.metal, amount: 1, sides: 4, modifier: 0 },
		],
	},
	{
		id: 'earthelemental',
		name: 'Elemental de tierra',
		info: `Creatura magica de tierra viva.\nAtaca haciendo temblar la tierra.`,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.unit, TraitMap.earth, TraitMap.guardian],
		targetting: TargettingMap.everyone,
		maxhp: 20,
		cost: 1,
		attack: [
			{ type: TypeMap.earth, amount: 1, sides: 4, modifier: 0 },
		],
		weakness: [
			{ type: TypeMap.wood, amount: 1, sides: 4, modifier: 0 },
		],
	},
	{
		id: 'druid',
		name: 'Druida',
		info: `Es un hechicero que controla las fuerzas de la naturaleza.\nAtaca lanzando un mini-meteorito.`,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.unit, TraitMap.earth,TraitMap.male],
		targetting: TargettingMap.random,
		maxhp: 15,
		cost: 1,
		attack: [
			{ type: TypeMap.earth, amount: 1, sides: 10, modifier: 1 },
		],
		weakness: [
			{ type: TypeMap.wood, amount: 1, sides: 4, modifier: 0 },
		],
	},
		
]

export let UnitMap = Object.fromEntries(Units.map(card => [ card.id, card ]))

let costFrequency = [ 0, 29, 22, 18, 12, 10 ]
export let Pool = Units.flatMap(card => Array(costFrequency[card.cost]).fill(card))


