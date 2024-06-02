import { UnitMap, updatePlayerTraits } from "./database";

export function loadPlayer(id:string) {
	let defaults:{[key:string]:Player} = {
		1: { 
			id: 'player1',
			name: 'Azul',
			hp: 3,
			mirrored: false,
			color: 'primary',
			finished: false,
			maxgold: 5,
			gold: 5,
			rolls: 2,
			traits: [],
			hand: [],
			board: [],
		},
		2: {
			id: 'player2',
			name: 'Rojo',
			hp: 3,
			mirrored: true,
			color: 'danger',
			finished: false,
			maxgold: 5,
			gold: 5,
			rolls: 2,
			hand: [],
			traits: [],
			board: [ ]
		}
	}
	let player:Player = JSON.parse(localStorage.getItem('player'+id)??"null")??defaults[id]
	refreshState(player)
	return player
}

export function refreshState(player:Player) {
	for(let bu of player.board) {
		bu.unit = UnitMap[bu.unit.id]
	}
	updatePlayerTraits(player)
}

export function rememberPlayerState(player:Player) {
	let copy = Object.assign({}, player)
	copy.traits = []
	copy.board = copy.board.map(bu  => {
		bu.damage = undefined
		bu.mods = {}
		let obj:{unit:{id:string}} = bu
		obj.unit = { id: obj.unit.id }
		return bu
	})
	localStorage.setItem(player.id, JSON.stringify(copy))
}
