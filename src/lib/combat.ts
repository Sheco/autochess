import { updatePlayerTraits } from "./database";

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

function coordinatesToBoardUnits(units:BoardUnit[]) {
	return (c:Coordinate) => units.find(boardUnit => boardUnit.realCoord.x==c.x && boardUnit.realCoord.y==c.y)
}

let calculateDistance = (attacker:BoardUnit, defender:BoardUnit) => {
	let distance = Math.sqrt(
		Math.pow(attacker.realCoord.x- defender.realCoord.x, 2)+
		Math.pow(attacker.realCoord.y- defender.realCoord.y, 2)
	)
	return { target: defender, distance }
}
let targetting:{[key:string]: (c:BoardUnit, f:BoardUnit[]) => BoardUnit[]} = {
		random: (_:BoardUnit, target:BoardUnit[]) => !target.length? []:
			[target[Math.floor(Math.random()*target.length)]]
		,
		everyone: (_:BoardUnit, target:BoardUnit[]) => target,
		nearby: (attacker:BoardUnit, target:BoardUnit[]) => {
			let closest = target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => a.distance-b.distance)
				.map(({target}) => target)
				.slice(0, 2)
			return !closest.length? []: [closest[Math.floor(Math.random()*closest.length)]]
		},
		closest1: (attacker:BoardUnit, target:BoardUnit[]) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => a.distance-b.distance)
				.map(({target}) => target)
				.slice(0,1)
		,
		weakest1: (attacker:BoardUnit, target:BoardUnit[]) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a,b) => (a.target.hp-b.target.hp))
				.map(({target}) => target)
				.slice(0, 1)
		,
		farthest1: (attacker:BoardUnit, target:BoardUnit[]) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target)
				.slice(0,1)
		,
		farthest2: (attacker:BoardUnit, target:BoardUnit[]) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target)
				.slice(0,2)
		,
		farthest1_direct: (attacker:BoardUnit, target:BoardUnit[]) => {
			let [farthest1] = targetting.farthest1(attacker, target)
			if(!farthest1) return []
			let blocker = coordinatesBetween(attacker.realCoord, farthest1.realCoord)
				.map(coordinatesToBoardUnits(target))
				.filter(x => x)
				.shift()
			return [blocker??farthest1]
		}
}


export function setBattleCoordinates(player:Player) {
	for(let boardUnit of player.board.units) {
		boardUnit.realCoord.x = boardUnit.setCoord.x
		boardUnit.realCoord.y = player.mirrored? -boardUnit.setCoord.y-1: boardUnit.setCoord.y
	}
}

function initBattle(player1:Player, player2: Player) {
	for(let player of [player1, player2]) {
		updatePlayerTraits(player)
		setBattleCoordinates(player)
	}
}

function RollDice(dice:Dice) {
	return Array(dice.amount)
		.fill(0)
		.map(_ => Math.floor(Math.random()*dice.sides)+1+dice.modifier)
		.reduce((total, num) => total+num)
}

export function calculateDamage(attacker:BoardUnit,defender:BoardUnit) {
	let attackDice = [...attacker.unit.attack]
	let weaknessDice = attackDice.flatMap(die => defender.unit.weakness.filter(wdie => wdie.type==die.type))
	let dice:Dice[] = [...attackDice, ...weaknessDice]
	return dice.reduce((total, die) => {
		total.damage += RollDice(die)
		total.min += die.amount+die.modifier
		total.max += die.amount*die.sides+die.modifier
		return total
	}, {
		damage: 0,
		min: 0,
		max: 0,
		dice: dice,
	} as DamageRoll)
}

function attack(attackingPlayer:Player, attacker:BoardUnit, defendingPlayer:Player) {
	let attack = {
		attacker,
		attackingPlayer,
		attacks: []
	} as Attack
	if(!attacker.hp) {
		return attack
	}
	let targets = targetting[attacker.unit.targetting.id](attacker,
		defendingPlayer.board.units.filter(boardUnit => boardUnit.hp>0))
	if(!targets) {
		return attack
	}
	attack.attacks = targets.map(defender => {
		let roll = calculateDamage(attacker, defender)
		return {
			defender,
			defendingPlayer,
			roll,
		} as AttackRoll
	})
	return attack
}

interface Turn {
	boardUnit:BoardUnit,
	attacker:Player,
	defender:Player,
}

function *runCombat(attacker:Player, defender:Player)  {
	let attackerTurns:Turn[] = attacker.board.units
		.filter(boardUnit => boardUnit.hp>0)
		.map(boardUnit => ({
			boardUnit, attacker, defender
		}))
	let defenderTurns:Turn[] = defender.board.units
		.filter(boardUnit => boardUnit.hp>0)
		.map(boardUnit => ({
			boardUnit, attacker:defender, defender:attacker
		}))
	let units = [...attackerTurns, ...defenderTurns]
	let tick = () => {
		for(let unit of units) {
			unit.boardUnit.energy+=unit.boardUnit.unit.energypertick
		}
		return units
			.filter(u => u.boardUnit.energy==u.boardUnit.unit.energymax)
	}

	for(let i = 0; i < 20; i++) {
		for(let turn of tick()) {
			let a = attack(turn.attacker, turn.boardUnit, turn.defender)
			if(!a.attacks.length) continue
			yield a
			a.attacks.forEach(r => {
				r.defender.hp = Math.max(r.defender.hp-r.roll.damage, 0)
			})
			turn.boardUnit.energy=0

			let defenders = turn.defender.board.units.filter(boardUnit => boardUnit.hp>0)
			if(defenders.length==0) {
				return
			}
		}
	}
}

export function fight(player1:Player, player2:Player) {
	initBattle(player1, player2)
	let player2First = Math.random()*100>50
	if (player2First) [ player1, player2 ] = [player2, player1]
	return runCombat(player1, player2)
}


function abortableSleep() {
	let abortController = new AbortController()
	let sleep = async (wait:number) => new Promise((resolve, reject) => {
		let timeout = setTimeout(() => {
			abortController.signal.removeEventListener('abort', abort)
			resolve('ok')
		}, wait)
		let abort = () => {
			clearTimeout(timeout)
			reject('abort')
		}
		abortController.signal.addEventListener('abort', abort)
	})

	let abort = () => {
		abortController.abort()
		abortController = new AbortController()
	}

	return {
		sleep,
		abort
	}

}
export function createThrottledGenerator<T>(items:T[]|Generator<T>, wait:number) {
	let sleep = abortableSleep()
	async function *throttle() {
		for(let i of items) {
			yield i
			await sleep.sleep(wait)
		}
	}
	return {
		stop: sleep.abort,
		items: throttle(),
	} as ThrottledGenerator<T>
}

export function animatedFight(attacks:Attack[]|Generator<Attack>, speed:number) {
	let sleep = abortableSleep()
	async function *throttle() {
		for await (let attack of attacks) {
			attack.attacker.ui.style = "attacking-attack"
			attack.attacks.forEach(({defender}) => {
				defender.ui.style = "attacking-defend"
				defender.ui.damage = undefined
			})

			await sleep.sleep(500*(1/speed))
			attack.attacker.ui.style = "attacked-attack"
			attack.attacks.forEach(({defender,roll}) => {
				defender.ui.style = "attacked-defend"
				defender.ui.damage = roll
				defender.ui.hp -= defender.ui.damage.damage
			})
			yield attack
			await sleep.sleep(1000*(1/speed))
			attack.attacker.ui.style = undefined
			attack.attacks.forEach(({defender}) => {
				defender.ui.style = undefined
				defender.ui.damage = undefined
			})
		}
	}

	return {
		stop: sleep.abort,
		items: throttle()
	} as ThrottledGenerator<Attack>
}

export function fightStatus(player1:Player, player2:Player) {
	let player1Alive = player1.board.units.filter(boardUnit => boardUnit.hp>0).length>0
	let player2Alive = player2.board.units.filter(boardUnit => boardUnit.hp>0).length>0

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

export function createBoardUnit(unit:Unit, c:Coordinate): BoardUnit {
	return {
		...unit,
		unit,
		setCoord: {...c},
		realCoord: c,
		hp: unit.maxhp,
		energy: 0,
		mods: [],
		ui: { hp: unit.maxhp }
	}
}
