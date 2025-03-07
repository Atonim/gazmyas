const Flags = require('./flags')
const CalcPos = require('./positionCalculator')

class EnvirenmentAnalyzer {
    constructor(team) {

        this.time = 0
        this.team = team
        this.x = Infinity
        this.y = Infinity
        this.visibleFlags = []
        this.teammates = {}
        this.opponents = {}
    }

    analyzeVisibleInformation (information, side) {
        this.opponents = {}
        this.visibleFlags = []
        information = this.__parseTimeFrom(information)
        this.__parseVisible(information)

        // this.__parseVisibleFlagsFrom(information)
        // // console.log(this.visibleFlags)
        this.__calculateAgentPosition(side)
    }

    __parseTimeFrom (information) {
        if (information.length > 0) {
            this.time = information[0]
            information.splice(0, 1)
        }
        return information
    }
    __parseVisible (information) {
        for (const visibleObject of information) {
            let visibleObjectName = visibleObject.cmd.p.join('')
            // let objectInformation = {}

            this.__parseFlagFrom(visibleObject, visibleObjectName)
            this.__parsePlayerFrom(visibleObject, visibleObjectName)
        }
    }
    __parseFlagFrom (visibleObject, visibleObjectName) {
        if (Flags[visibleObjectName]) {
            const fX = Flags[visibleObjectName].x
            const fY = Flags[visibleObjectName].y
            const flag = [fX, fY].concat(visibleObject.p.slice(0, 2))
            this.visibleFlags.push(flag)
        }
    }
    __parsePlayerFrom (visibleObject, visibleObjectName) {
        if (visibleObjectName.startsWith('p')) {
            const playerTeam = visibleObject.cmd.p[1]
            const playerNumero = visibleObject.cmd.p[2]
            const playerLocation = visibleObject.p
            const playerPosition = CalcPos.calculateObjectPosition(this.visibleFlags, [this.x, this.y], playerLocation)
            if (playerTeam !== this.team) {
                this.opponents[playerNumero] = {x: playerPosition[0], y: playerPosition[1]}
                console.log(`OPPONENT PLAYER TEAM: ${playerTeam}, POSITION: ${playerPosition}`)
            }
        }
    }
    __calculateAgentPosition (side) {
        [this.x, this.y] = CalcPos.calculatePosition(this.visibleFlags)
        if (side === 'r') {
            [this.x, this.y] = [-this.x, -this.y]
        }
    }
}

module.exports = EnvirenmentAnalyzer // Экспорт