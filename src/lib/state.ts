import { UnitMap, updatePlayerTraits } from "./database";

export function loadPlayers() {
	let player1 = JSON.parse(localStorage.getItem('player1')??"null")??{ 
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
		} as Player

	let player2 = JSON.parse(localStorage.getItem('player2')??"null")??{
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
		} as Player

	refreshState(player1)
	refreshState(player2)

	return [player1, player2]
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
