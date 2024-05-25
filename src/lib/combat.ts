function RollDice(dice:Dice) {
	return Array(dice.amount)
		.fill(0)
		.map(_ => Math.floor(Math.random()*dice.sides)+1+dice.modifier)
		.reduce((total, num) => total+num)
}

function coordinatesBetween(point1:Coordinate, point2:Coordinate) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    
    // Calculate the number of points to interpolate (including both endpoints)
    const numPoints = Math.max(Math.abs(dx), Math.abs(dy));
	let coordinates = Array(numPoints).fill(null).map((_, i) => {
        const x = Math.round(point1.x + i * (dx / numPoints));
        const y = Math.round(point1.y + i * (dy / numPoints));
        return { x, y };
    })
	return coordinates.slice(1)
}

function coordinatesToBoardUnits(board:Board) {
	return (c:Coordinate) => board.find(boardUnit => boardUnit.x==c.x && boardUnit.y==c.y)
}

let calculateDistance = (attacker:BoardUnit, defender:BoardUnit) => {
	let distance = Math.sqrt(
		Math.pow(attacker.x- defender.x, 2)+
		Math.pow(attacker.y- defender.y, 2)
	)
	return { target: defender, distance }
}
let targetting:{[key:string]: (c:BoardUnit, f:Board) => BoardUnit[]} = {
		random: (_:BoardUnit, target:Board) => !target.length? []:
			[target[Math.floor(Math.random()*target.length)]]
		,
		everyone: (_:BoardUnit, target:Board) => target,
		nearby: (attacker:BoardUnit, target:Board) => {
			let closest = target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => a.distance-b.distance)
				.map(({target}) => target) 
				.slice(0, 2)
			return !closest.length? []: [closest[Math.floor(Math.random()*closest.length)]]
		},
		closest1: (attacker:BoardUnit, target:Board) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => a.distance-b.distance)
				.map(({target}) => target) 
				.slice(0,1)
		,
		weakest1: (attacker:BoardUnit, target:Board) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a,b) => (a.target.hp-b.target.hp))
				.map(({target}) => target)
				.slice(0, 1)
		,
		farthest1: (attacker:BoardUnit, target:Board) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,1)
		, 
		farthest2: (attacker:BoardUnit, target:Board) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,2)
		, 
		farthest1_direct: (attacker:BoardUnit, target:Board) => {
			let [farthest1] = targetting.farthest1(attacker, target)
			if(!farthest1) return []
			let blocker = coordinatesBetween(attacker, farthest1)
				.map(coordinatesToBoardUnits(target))
				.filter(x => x)
				.shift()
			return [blocker??farthest1]
		}
}


interface Turn {
	boardUnit:BoardUnit,
	attacker:Player,
	defender:Player,
}

function setBattleCoordinates(player:Player) {
	for(let boardUnit of player.board) {
		boardUnit.x = boardUnit.setx
		boardUnit.y = player.mirrored? -boardUnit.sety-1: boardUnit.sety
	}
}

export function resetUnits(player:Player) {
	for(let boardUnit of player.board) {
		boardUnit.energy = 0
		boardUnit.hp = boardUnit.unit.maxhp+(boardUnit.mods.maxhp??0)
	}
}

export function initBattle(player1:Player, player2: Player) {
	for(let player of [player1, player2]) {
		resetUnits(player)
		setBattleCoordinates(player)
	}
}

function *attack(attackingPlayer:Player, attacker:BoardUnit, defendingPlayer:Player): Generator<AttackRoll> {
	if(!attacker.hp) {
		return
	}
	let targets = targetting[attacker.unit.targetting.id](attacker, 
		defendingPlayer.board.filter(boardUnit => boardUnit.hp>0))
	if(!targets) {
		//log.push(`<b>${turn.player.name}</b>: ${turn.boardUnit.unit.name} esta fuera de combate.`)
		return
	}
	for(let defender of targets) {
		let damage = calculateDamage(attacker, defender)
		//output.push(`<span class="text-${attacker.color}">${boardUnit.unit.name}</span>(${boardUnit.hp}) ataca a <span class="text-${defender.color}">${targetUnit.unit.name}</span>(${targetUnit.hp}): <b>${damage.damage}</b> (${damage.dice})`)
		defender.hp = Math.max(defender.hp-damage.damage, 0)
		let roll = {
			attacker, 
			attackingPlayer,
			defender, 
			defendingPlayer,
			...damage}
		yield roll
	}
}

export function *runCombat(attacker:Player, defender:Player): Generator<AttackRoll>  {
	let attackerUnits:Turn[] = attacker.board
		.filter(boardUnit => boardUnit.hp>0)
		.map(boardUnit => ({
			boardUnit, attacker, defender
		}))
	let defenderUnits:Turn[] = defender.board
		.filter(boardUnit => boardUnit.hp>0)
		.map(boardUnit => ({
			boardUnit, attacker:defender, defender:attacker
		}))
	let units = [...attackerUnits, ...defenderUnits]
	let tick = () => {
		for(let unit of units) {
			unit.boardUnit.energy+=unit.boardUnit.unit.energypertick
		}
	}
	let unitsReady = () => units
		.filter(u => u.boardUnit.energy==u.boardUnit.unit.energymax)

	for(let i = 0; i < 20; i++) {
		tick()
		for(let turn of unitsReady()) {
			for(let roll of attack(attacker, turn.boardUnit, turn.defender)) {
				yield roll
			}
			turn.boardUnit.energy=0

			let defenders = turn.defender.board.filter(boardUnit => boardUnit.hp>0)
			if(defenders.length==0) {
				return
			}
		}
	}
}

// TODO agregar un callback de ondamage() para cachar cada uno
// de los attackRolls y poder sincronizar con la UI
export function fight(player1:Player, player2:Player): Generator<AttackRoll> {
	initBattle(player1, player2)
	let player2First = Math.random()*100>50
	if (player2First) [ player1, player2 ] = [player2, player1]
	return runCombat(player1, player2)
}

export function fightStatus(player1:Player, player2:Player) {
	let player1Alive = player1.board.filter(boardUnit => boardUnit.hp>0).length>0
	let player2Alive = player2.board.filter(boardUnit => boardUnit.hp>0).length>0

	let winner:Player|undefined = undefined
	let loser:Player|undefined = undefined
	if (!player1Alive) {
		winner = player2
		loser = player1
	} else if (!player2Alive) {
		winner = player1
		loser = player2
	}
	return {
		winner,
		loser,
	}
}

export function calculateDamage(attacker:BoardUnit,defender:BoardUnit) {
	// obtenemos el dado unit.attack y lo tiramos
	let damage = 0
	let min = 0
	let max = 0
	let dice:Dice[] = []
	for(let die of [...attacker.unit.attack, ...attacker.mods.attack??[]]) {
		// tira los dados de ataque
		damage += RollDice(die)
		min += die.amount+die.modifier
		max += die.amount*die.sides+die.modifier
		dice.push(die)

		// tira los dados de debilidad del defensor
		for(let wdie of defender.unit.weakness.filter(wdie => wdie.type==die.type)) {
			damage += RollDice(wdie)
			min += wdie.amount+wdie.modifier
			max += wdie.amount*wdie.sides+wdie.modifier
			dice.push(wdie)
		}
		//console.log(`${attacker.unit.name} ataca a ${defender?.unit.name} con ${attacker.unit.attack.amount}d${attacker.unit.attack.sides}+${attacker.unit.attack.modifier}`)
		//console.log(`Dmg: ${damage} Min: ${min}, Max: ${max}, effects: ${effectDamage}`)
	}
	
	return {
		damage,
		min,
		max,
		dice
	} as DamageRoll
}

export function createBoardUnit(unit:Unit, c:Coordinate): BoardUnit {
	return {
		unit,
		setx: c.x,
		sety: c.y,
		x: c.x,
		y: c.y,
		hp: unit.maxhp,
		energy: 0,
		mods: {},
	}
}
