const Flags = require('./flags')
const CalcPos = require('./positionCalculator')

class EnvirenmentAnalyzer {
    constructor() {

        this.time = 0
        this.x = 0
        this.y = 0
        this.visibleFlags = []
    }

    analyzeVisibleInformation (information) {
        this.visibleFlags = []
        information = this.__parseTimeFromInformation(information)
        this.__parseVisibleFlagsFromInformation(information)
        // console.log(this.visibleFlags)
        this.__calculatePlayerPosition()

    }

    __parseTimeFromInformation (information) {
        if (information.length > 0) {
            this.time = information[0]
            information.splice(0, 1)
        }
        return information
    }
    __parseVisibleFlagsFromInformation (information) {
        for (const visible_object of information) {
            let visible_object_name = visible_object.cmd.p.join('')
            // Object.keys(Flags).indexOf(visible_object_name)

            if (Flags[visible_object_name]) {
                const fX = Flags[visible_object_name].x
                const fY = Flags[visible_object_name].y
                const flag = [fX, fY].concat(visible_object.p)
                this.visibleFlags.push(flag)
            }
        }
    }
    __calculatePlayerPosition () {
        console.log(CalcPos.calculatePosition(this.visibleFlags))
    }
}

module.exports = EnvirenmentAnalyzer // Экспорт