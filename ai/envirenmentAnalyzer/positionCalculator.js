
class PositionCalculation {
    static calculatePosition (flags) {
        flags = this.sortFlagsByDistance(flags)
        let coords = []
        if (flags[0][0] === flags[1][0]) {
            coords = this.calculatePositionSameAbscissAlgorithm(flags)
        } else if (flags[0][1] === flags[1][1] && flags[1][1] === flags[2][1]) {
            // coords = this.calculatePositionSameOrdinateAlgorithm(flags)
        } else {
            coords = this.calculatePositionThreePointsAlgorithm(flags)
        }
        // console.log(`Coords: (${coords})`)
        return coords
    }

    static calculatePositionThreePointsAlgorithm (flags) {

        if (flags.length < 3) 
            throw new Error(`Слишком мало флагов (${flags.length}). Нельзя вычислить позицию методом calculatePositionThreePointsAlgorithm`)

        const x1 = flags[0][0]
        const y1 = flags[0][1]
        const d1 = flags[0][2]

        const x2 = flags[1][0]
        const y2 = flags[1][1]
        const d2 = flags[1][2]

        const x3 = flags[2][0]
        const y3 = flags[2][1]
        const d3 = flags[2][2]
        // console.log(x1, x2, x3, y1, y2, y3, d1, d2, d3)
        
        let alpha1 = (y1 - y2) / (x2 - x1)
        let beta1 =
            (y2 * y2 - y1 * y1 + x2 * x2 - x1 * x1 + d1 * d1 - d2 * d2) /
            (2 * (x2 - x1))
        let alpha2 = (y1 - y3) / (x3 - x1)
        let beta2 =
            (y3 * y3 - y1 * y1 + x3 * x3 - x1 * x1 + d1 * d1 - d3 * d3) /
            (2 * (x3 - x1))
        let delta_beta = beta1 - beta2
        let delta_alpha = alpha2 - alpha1
        let X = alpha1 * (delta_beta / delta_alpha) + beta1
        let Y = delta_beta / delta_alpha
        console.log(alpha1, alpha2)
        console.log(beta1, beta2)
        // console.log([X, Y])
        return [X, Y]
    }

    static calculatePositionSameAbscissAlgorithm (flags) {
        if (flags.length < 3) 
            throw new Error(`Слишком мало флагов (${flags.length}). Нельзя вычислить позицию методом calculatePositionThreePointsAlgorithm`)

        const x1 = flags[0][0]
        const y1 = flags[0][1]
        const d1 = flags[0][2]

        const x2 = flags[1][0]
        const y2 = flags[1][1]
        const d2 = flags[1][2]

        const x3 = flags[2][0]
        const y3 = flags[2][1]
        const d3 = flags[2][2]

        let Y = (y2 * y2 - y1 * y1 + d1 * d1 - d2 * d2) / (2 * (y2 - y1))
        let X1 = x1 - Math.sqrt(d1 * d1 - (Y - y1) * (Y - y1))
        let X2 = x1 + Math.sqrt(d1 * d1 - (Y - y1) * (Y - y1))
        let X = [X1, X2].sort((a, b) => 
            ((a - x3) * (a - x3) - (Y - y3) * (Y - y3) - d3 * d3) - ((b - x3) * (b - x3) - (Y - y3) * (Y - y3) - d3 * d3)
            )[1]
        return [X, Y]
    }

    static calculatePositionSameOrdinateAlgorithm (flags) {
        if (flags.length < 3) 
            throw new Error(`Слишком мало флагов (${flags.length}). Нельзя вычислить позицию методом calculatePositionThreePointsAlgorithm`)

        const x1 = flags[0][0]
        const y1 = flags[0][1]
        const d1 = flags[0][2]

        const x2 = flags[1][0]
        const y2 = flags[1][1]
        const d2 = flags[1][2]

        const x3 = flags[2][0]
        const y3 = flags[2][1]
        const d3 = flags[2][2]

        let X = (x2 * x2 - x1 * x1 + d1 * d1 - d2 * d2) / (2 * (x2 - x1))
        let Y1 = y1 - Math.sqrt(d1 * d1 - (X - x1) * (X - x1))
        let Y2 = y1 + Math.sqrt(d1 * d1 - (X - x1) * (X - x1))
        let Y = [Y1, Y2].sort((a, b) => 
            ((X - x3) * (X - x3) - (a - y3) * (a - y3) - d3 * d3) - ((X - x3) * (X - x3) - (b - y3) * (b - y3) - d3 * d3)
            )[1]
        return [X, Y]
    }

    static sortFlagsByDistance (flags) {
        flags.sort((a, b) => a[3] - b[3])
        // flags.sort((a, b) => {
        //     if (a[0] < b[0]) return -1
        //     if (a[0] > b[0]) return 1
        //     return 0
        // })
        return flags
    }
}

module.exports = PositionCalculation // Экспорт