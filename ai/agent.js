const Msg = require('./msg')
const readline = require('readline')
const Flags = require('./flags')
const CalcPos = require('./positionCalculator')
//const Manager = require('./manager')
//const { DT } = require('./decisionTree')

class Agent {
	constructor() {
		this.position = 'l' // По умолчанию ~ левая половина поля
		this.run = false // Игра начата
		this.act = null // Действия
		this.rl = readline.createInterface({
			// Чтение консоли
			input: process.stdin,
			output: process.stdout,
		})
		this.rl.on('line', (input) => {
			// Обработка строки из кон—
			if (this.run) {
				// Если игра начата
				// Движения вперед, вправо, влево, удар по мячу

				if ('w' == input) this.act = { n: 'dash', v: 100 }
				if ('d' == input) this.act = { n: 'turn', v: 20 }
				if ('a' == input) this.act = { n: 'turn', v: -20 }
				if ('s' == input) this.act = { n: 'kick', v: 100 }
			}
		})
	}
  msgGot(msg) {
		// Получение сообщения
		let data = msg.toString('utf8') // ПРиведение
		this.processMsg(data) // Разбор сообщения
		this.sendCmd() // Отправка команды
	}
	setSocket(socket) {
		// Настройка сокета
		this.socket = socket
	}
	socketSend(cmd, value) {
		// Отправка команды
		this.socket.sendMsg(`(${cmd} ${value})`)
	}
	processMsg(msg) {
		// Обработка сообщения
		let data = Msg.parseMsg(msg) // Разбор сообщения
		if (!data) throw new Error('Parse error\n' + msg)
		// Первое (hear) — начало игры
		if (data.cmd == 'hear') this.run = true
		if (data.cmd == 'init') this.initAgent(data.p) //MHMnmaflM3auMH
		this.analyzeEnv(data.msg, data.cmd, data.p) // Обработка
	}
	initAgent(p) {
		if (p[0] == 'r') this.position = 'r' // Правая половина поля
		if (p[1]) this.id = p[1] // id игрока
		//this.dt = Object.create(DT[this.role]).init()
	}
	analyzeEnv(msg, cmd, p) {
		// console.log(`msg\n`, msg)
		// console.log(`cmd\n`, cmd)
		// console.log(`p\n`, p)

		if (cmd === 'see') {
			// console.log(`msg\n`, msg)
			// console.log(`cmd\n`, p[1].cmd.p)
			// console.log(`p\n`, p)

			if (p.length > 0) {
				let time = p[0]
				p.splice(0, 1)
			}

			let visible_flags = []

			for (const visible_object of p) {
				let visible_object_name = visible_object.cmd.p.join('')
				// Object.keys(Flags).indexOf(visible_object_name)

				if (Flags[visible_object_name]) {
					const fX = Flags[visible_object_name].x
					const fY = Flags[visible_object_name].y
					const flag = [fX, fY].concat(visible_object.p)
					visible_flags.push(flag)
				}
			}
			console.log(visible_flags)
			CalcPos.calculatePosition(visible_flags)

		}
		//if (this.team === 'Losers') return
		//const mgr = Object.create(Manager).init(cmd, p, this.team, this.x, this.y)
		
		//mgr.init(cmd, p, this.team)

		//if (mgr.stopRunning()) {
		//	this.run = false
		//	this.dt.state.next = 0
		//}
		// Анализ сообщения
		//if (cmd === 'see') {
		//	const pos = mgr.getLocation()
		//	[this.x, this.y] = [pos.x, pos.y]

		//	if (this.run) this.act = mgr.getAction(this.dt)
		//}
	}
	sendCmd() {
		if (this.run) {
			// Игра начата
			if (this.act) {
        if (this.act.n == 'kick')
          this.socketSend(this.act.n, this.act.v + " 0")
        else
          this.socketSend(this.act.n, this.act.v)
      }
      
			this.act = null // Сброс команды
		}
	}
}


//class Agent {
//	constructor(team, role = 'player') {
//		this.position = 'l' // По умолчанию ~ левая половина поля
//		this.run = false // Игра начата
//		this.act = null // Действия
//		this.rl = readline.createInterface({
//			// Чтение консоли
//			input: process.stdin,
//			output: process.stdout,
//		})
//		this.x = null
//		this.y = null
//		this.role = role
//		this.team = team
//		this.actionIdx = 0

//		this.rl.on('line', input => {
//			// Обработка строки из кон—
//			if (this.run) {
//				// Если игра начата
//				// Движения вперед, вправо, влево, удар по мячу

//				if ('w' == input) this.act = { n: 'dash', v: 100 }
//				if ('d' == input) this.act = { n: 'turn', v: 20 }
//				if ('a' == input) this.act = { n: 'turn', v: -20 }
//				if ('s' == input) this.act = { n: 'kick', v: 100 }
//			}
//		})
//	}
//  msgGot(msg) {
//		// Получение сообщения
//		let data = msg.toString('utf8') // ПРиведение
//		this.processMsg(data) // Разбор сообщения
//		this.sendCmd() // Отправка команды
//	}
//	setSocket(socket) {
//		// Настройка сокета
//		this.socket = socket
//	}
//	async socketSend(cmd, value) {
//		// Отправка команды
//		await this.socket.sendMsg(`(${cmd} ${value})`)
//	}
//	processMsg(msg) {
//		// Обработка сообщения
//		let data = Msg.parseMsg(msg) // Разбор сообщения
//		if (!data) throw new Error('Parse error\n' + msg)
//		// Первое (hear) — начало игры
//		if (data.cmd == 'hear' && data.p[2] === 'play_on') this.run = true
//		if (data.cmd == 'init') this.initAgent(data.p) //MHMnmaflM3auMH
//		this.analyzeEnv(data.msg, data.cmd, data.p) // Обработка
//	}
//	initAgent(p) {
//		if (p[0] == 'r') this.position = 'r' // Правая половина поля
//		if (p[1]) this.id = p[1] // id игрока
//		this.dt = Object.create(DT[this.role]).init()
//	}
//  analyzeEnv(msg, cmd, p) {
//		if (this.team === 'Losers') return
//		const mgr = Object.create(Manager).init(cmd, p, this.team, this.x, this.y)
		
//		mgr.init(cmd, p, this.team)

//		if (mgr.stopRunning()) {
//			this.run = false
//			this.dt.state.next = 0
//		}
//		// Анализ сообщения
//		if (cmd === 'see') {
//			const pos = mgr.getLocation()
//			[this.x, this.y] = [pos.x, pos.y]

//			if (this.run) this.act = mgr.getAction(this.dt)
//		}
//	}
//	sendCmd() {
//		if (this.run) {
//			// Игра начата
//			if (this.act) this.socketSend(this.act.n, this.act.v)
//			this.act = null // Сброс команды
//		}
//	}
//}

module.exports = Agent // Экспорт игрока