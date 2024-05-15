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

function coordinatesToBoardUnits(field:Field) {
	return (c:Coordinate) => field.find(boardUnit => boardUnit.x==c.x && boardUnit.y==c.y)
}

let calculateDistance = (attacker:BoardUnit, defender:BoardUnit) => {
	let distance = Math.sqrt(
		Math.pow(attacker.x- defender.x, 2)+
		Math.pow(attacker.y- defender.y, 2)
	)
	return { target: defender, distance }
}
let targetting:{[key:string]: (c:BoardUnit, f:Field) => BoardUnit[]} = {
		random: (_:BoardUnit, target:Field) => !target.length? []:
			[target[Math.floor(Math.random()*target.length)]]
		,
		everyone: (_:BoardUnit, target:Field) => target,
		nearby: (attacker:BoardUnit, target:Field) => {
			let closest = target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => a.distance-b.distance)
				.map(({target}) => target) 
				.slice(0, 2)
			return !closest.length? []: [closest[Math.floor(Math.random()*closest.length)]]
		},
		closest1: (attacker:BoardUnit, target:Field) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => a.distance-b.distance)
				.map(({target}) => target) 
				.slice(0,1)
		,
		weakest1: (attacker:BoardUnit, target:Field) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a,b) => (a.target.hp-b.target.hp))
				.map(({target}) => target)
				.slice(0, 1)
		,
		farthest1: (attacker:BoardUnit, target:Field) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,1)
		, 
		farthest2: (attacker:BoardUnit, target:Field) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,2)
		, 
		farthest1_direct: (attacker:BoardUnit, target:Field) => {
			let [farthest1] = targetting.farthest1(attacker, target)
			if(!farthest1) return []
			let blocker = coordinatesBetween(attacker, farthest1)
				.map(coordinatesToBoardUnits(target))
				.filter(x => x)
				.shift()
			return [blocker??farthest1]
		}
}

function Attack(attacker:Player, boardUnit:BoardUnit, defender:Player) {
	let output:string[] = []
	let damage:DamageRoll = {
			damage:0,
			max:0,
			min:0,
			roll:'',
	}
	if(!boardUnit.hp) {
		return {
			output,
			damage,
		}
	}
	let targets = targetting[boardUnit.unit.targetting.id](boardUnit, 
		defender.field.filter(boardUnit => boardUnit.hp>0))
	if(!targets) {
		//log.push(`<b>${turn.player.name}</b>: ${turn.boardUnit.unit.name} esta fuera de combate.`)
		return {
			output,
			damage,
		}
	}
	for(let targetUnit of targets) {
		let damage = calculateDamage(boardUnit.unit, targetUnit.unit, attacker.field)
		output.push(`<span class="text-${attacker.color}">${boardUnit.unit.name}</span>(${boardUnit.hp}) ataca a <span class="text-${defender.color}">${targetUnit.unit.name}</span>(${targetUnit.hp}): <b>${damage.damage}</b> (${damage.roll})`)
		targetUnit.hp = Math.max(targetUnit.hp-damage.damage, 0)
		if (targetUnit.hp==0) {
			output.push(`* <span class="text-${defender.color}">${targetUnit.unit.name}</b></span> <span class="text-warning">ha caido</span>`)
		}
	}
	return {
		output,
		damage
	}
}

interface Turn {
	boardUnit:BoardUnit,
	attacker:Player,
	defender:Player,
}

export function combatRound(attacker:Player, defender:Player)  {
	let output = []
	output.push(`<b class="text-${attacker.color}">${attacker.name}</b> tiene preferencia.`)
	let attackerUnits:Turn[] = attacker.field
		.filter(boardUnit => boardUnit.hp>0)
		.map(boardUnit => ({
			boardUnit, attacker, defender
		}))
	let defenderUnits:Turn[] = defender.field
		.filter(boardUnit => boardUnit.hp>0)
		.map(boardUnit => ({
			boardUnit, attacker:defender, defender:attacker
		}))
	let units = [...attackerUnits, ...defenderUnits]
	let tick = () => {
		output.push('Tick')
		for(let unit of units) {
			unit.boardUnit.energy+=unit.boardUnit.unit.energypertick
		}
	}
	let unitsReady = () => units
		.filter(u => u.boardUnit.energy==u.boardUnit.unit.energymax)

	let total = {
		[attacker.name]: {
			dmgmax: 0,
			dmg: 0,
		},
		[defender.name]: {
			dmgmax: 0,
			dmg: 0,
		}
	}
	
	for(let i = 0; i < 20; i++) {
		tick()
		for(let turn of unitsReady()) {
			let attack = Attack(turn.attacker, turn.boardUnit, turn.defender)
			if (!attack.damage)
				continue
			total[turn.attacker.name].dmgmax += attack.damage.max
			total[turn.attacker.name].dmg += attack.damage.damage
			output.push(...attack.output)
			turn.boardUnit.energy=0
		}
	}
	output.push('')
	return output
}

function setBattleCoordinates(player:Player) {
	for(let boardUnit of player.field) {
		boardUnit.x = boardUnit.setx
		boardUnit.y = player.mirrored? -boardUnit.sety-1: boardUnit.sety
	}
}

function resetUnits(player:Player) {
	for(let boardUnit of player.field) {
		boardUnit.energy = 0
		boardUnit.hp = boardUnit.unit.hp
	}
}

export function initBattle(player1:Player, player2: Player) {
	for(let player of [player1, player2]) {
		resetUnits(player)
		setBattleCoordinates(player)
	}
}

export function fight(player1:Player, player2:Player) {
	let log = [`Combate entre <span class="text-${player1.color}">${player1.name}</span> y <span class="text-${player2.color}">${player2.name}</span>`]
	initBattle(player1, player2)
	let player1Alive = true
	let player2Alive = true

	let homeFirst = Math.random()*100>50
	if (homeFirst)
		log.push(...combatRound(player1, player2))
	else
		log.push(...combatRound(player2, player1))
	player1Alive = player1.field.filter(boardUnit => boardUnit.hp>0).length>0
	player2Alive = player2.field.filter(boardUnit => boardUnit.hp>0).length>0

	let showFieldHP = (player:Player) => {
		log.push('Unidades vivas:')
		for(let unit of player.field) {
			if(unit.hp===0)
				continue
			log.push(`${unit.unit.name}: ${unit.hp}/${unit.unit.hp}`)
		}
	}
	if (player1Alive && player2Alive) {
		log.push("Empate!")
		return {
			winner: undefined,
			loser: undefined,
			log
		}
	} else if (player1Alive) {
		showFieldHP(player1)
		log.push(`<b class="text-${player1.color}">${player1.name}</b> es el ganador`)
		return {
			winner: player1,
			loser: player2,
			log
		}
	} else  {
		showFieldHP(player2)
		log.push(`<b class="text-${player2.color}">${player2.name}</b> es el ganador`)
		return {
			winner: player2,
			loser: player1,
			log
		}
	}
}

export function calculateCombatTraits(attacker:Unit, defender:Unit) {
	return attacker.combatTraits.map(effect => effect(defender))
}
export function calculateTeamTraits(attacker:Unit,field:Field) {
	return attacker.teamTraits.map(effect => effect(field))
}

function resetEffects(unit:BoardUnit, field:Field) {
	unit.effects = calculateTeamTraits(unit.unit, field).flatMap(x=>x)
}

export function calculateDamage(attacker:Unit,defender:Unit,field:Field=[]) {
	// ahora el daño se calculara asi:
	// obtenemos todos los effectos que apliquen de la unidad
	let teamEffects = calculateTeamTraits(attacker,field)
	let combatEffects = calculateCombatTraits(attacker, defender)
		
	let effects = [...teamEffects.flatMap(x=>x), ...combatEffects.flatMap(x=>x)]
	// buscamos efectos de attack.modifier
	let attackModBonus = 0
	for (let effect of effects) {
		if(effect.type != "attack.modifier") continue;
		if(effect.active) {
			//console.log(`- Agregar efecto ${effect.value} (${effect.message})`)
			attackModBonus+=effect.value
		} 
	}
	// obtenemos el dado unit.attack y lo tiramos
	let damage = RollDice(attacker.attack)+attackModBonus
	let min = attacker.attack.amount+attacker.attack.modifier+attackModBonus
	let max = attacker.attack.amount*attacker.attack.sides+attacker.attack.modifier+attackModBonus
	//console.log(`${attacker.unit.name} ataca a ${defender?.unit.name} con ${attacker.unit.attack.amount}d${attacker.unit.attack.sides}+${attacker.unit.attack.modifier}`)
	min = Math.max(min, 0)
	//console.log(`Dmg: ${damage} Min: ${min}, Max: ${max}, effects: ${effectDamage}`)
	
	return {
		damage,
		min,
		max,
		roll: `${attacker.attack.amount}d${attacker.attack.sides}+${attacker.attack.modifier}+${attackModBonus}`
	} as DamageRoll
}
