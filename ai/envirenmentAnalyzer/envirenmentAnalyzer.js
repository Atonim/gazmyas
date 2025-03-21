const Flags = require('./flags')
const CalcPos = require('./positionCalculator')

class EnvirenmentAnalyzer {
    constructor(team, side = 'l') {

        this.time = 0
        this.team = team
        this.fieldSide = side
        this.x = Infinity
        this.y = Infinity

        this.visibleFlags = []
        this.teammates = []
        this.opponents = []

        this.isBallSeen = false
        this.ballCoords = {x: NaN, y: NaN, d: NaN, a: NaN}
    }
    getPlayerCoords () {
        let [x, y] = [this.x, this.y]
        if (this.fieldSide === 'r') {
            return [-x, -y]
        }
        return [x, y]
    }
    changeCoordsBySide (coords) {
        if (this.fieldSide === 'r') {
            return [-coords[0], -coords[1]]
        }
        return [coords[0], coords[1]]
    }

    analyzeVisibleInformation (information) {
        this.opponents = []
        this.visibleFlags = []
        information = this.__parseTimeFrom(information)
        this.__parseVisible(information)
        
        this.__calculateAgentPosition()
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

            this.__parseFlagFrom(visibleObject, visibleObjectName)
            this.__parsePlayerFrom(visibleObject, visibleObjectName)
            this.__parseBallInfo(visibleObject, visibleObjectName)
        }
    }
    __parseFlagFrom (visibleObject, visibleObjectName) {
        if (Flags[visibleObjectName]) {
            const fX = Flags[visibleObjectName].x
            const fY = Flags[visibleObjectName].y
            const flag = [fX, fY].concat(visibleObject.p.slice(0, 2)).concat([visibleObjectName])
            this.visibleFlags.push(flag)
        }
    }
    __parsePlayerFrom (visibleObject, visibleObjectName) {
        if (visibleObjectName.startsWith('p')) {
            const playerTeam = visibleObject.cmd.p[1]
            const playerNumero = visibleObject.cmd.p[2]
            const playerLocation = visibleObject.p
            const playerPosition = this.changeCoordsBySide(
                CalcPos.calculateObjectPosition(
                    this.visibleFlags, 
                    this.getPlayerCoords(), 
                    playerLocation
                )
            )
            if (playerTeam !== this.team) {
                this.opponents.push({x: playerPosition[0], y: playerPosition[1]})
            }
        }
    }
    __parseBallInfo (visibleObject, visibleObjectName) {
        if (visibleObjectName.startsWith('b')) {
            this.ballCoords.d = visibleObject.p[0]
            this.ballCoords.a = visibleObject.p[1]
            this.isBallSeen = true
            const [x, y] = this.changeCoordsBySide(
                CalcPos.calculateObjectPosition(
                    this.visibleFlags,
                    this.getPlayerCoords(),
                    visibleObject.p
                )
            )
            this.ballCoords.x = x
            this.ballCoords.y = y
        }
    }
    
    __calculateAgentPosition () {
        [this.x, this.y] = this.changeCoordsBySide(
            CalcPos.calculatePlayerPosition(this.visibleFlags)
        )
    }
}

module.exports = EnvirenmentAnalyzer // Экспорт