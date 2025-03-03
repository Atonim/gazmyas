
class PositionCalculation {
    static calculatePosition (flags) {
        this.calculatePositionThreePointsAlgorithm(flags)
    }

    static calculatePositionThreePointsAlgorithm (flags) {
        // flags.sort((a, b) => a[0] - b[0])
        flags.sort((a, b) => {
            if (a[0] < b[0]) return -1
            if (a[0] > b[0]) return 1
            return 0
        })

        if (flags.length < 3) 
            throw new Error(`Слишком мало флагов (${flags.length}). Нельзявычислить позицию методом calculatePositionThreePointsAlgorithm`)

        const x1 = flags[0][0]
        const y1 = flags[0][1]
        const d1 = flags[0][2]

        const x2 = flags[1][0]
        const y2 = flags[1][1]
        const d2 = flags[1][2]

        const x3 = flags[2][0]
        const y3 = flags[2][1]
        const d3 = flags[2][2]
        
        const alpha1 = (y1 - y2) / (x2 - x1)
        const beta1 =
            (y2 * y2 - y1 * y1 + x2 * x2 - x1 * x1 + d1 * d1 - d2 * d2) /
            (2 * (x2 - x1))
        const alpha2 = (y1 - y3) / (x3 - x1)
        const beta2 =
            (y3 * y3 - y1 * y1 + x3 * x3 - x1 * x1 + d1 * d1 - d3 * d3) /
            (2 * (x3 - x1))
        const delta_beta = beta1 - beta2
        const delta_alpha = alpha2 - alpha1
        const X = alpha1 * (delta_beta / delta_alpha) + beta1
        const Y = delta_beta / delta_alpha
        console.log([X, Y])
        return [X, Y]
    }
}

module.exports = PositionCalculation // Экспорт