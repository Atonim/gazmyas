
class PositionCalculation {
    static calculatePosition (flags) {
        flags = this.sortFlagsByDistance(flags)
        if (flags.length < 3) return [Infinity, Infinity]
        let points = this.preparePointsFromThree(flags)
        
        const [x1, y1, d1] = points[0]
        const [x2, y2, d2] = points[1]
        const [x3, y3, d3] = points[2]
        if (Math.round(x1) === Math.round(x2) || Math.round(x1) === Math.round(x3)) {
            return this.calculatePositionSameAbscissAlgorithm(points)
        } else if (Math.round(y1) === Math.round(y2) && Math.round(y2) === Math.round(y3)) {
            return this.calculatePositionSameOrdinateAlgorithm(points)
        } else {
            return this.calculatePositionThreePointsAlgorithm(points)
        }
    }
    static calculateObjectPosition (flags, player, obj) {
        flags = this.sortFlagsByDistance(flags)
        if (flags.length < 3) return [Infinity, Infinity]
        let points = this.preparePointsFrom(flags, player, obj)

        const [x1, y1, d1] = points[0]
        const [x2, y2, d2] = points[1]
        const [x3, y3, d3] = points[2]
        if (Math.round(x1) === Math.round(x2) || Math.round(x1) === Math.round(x3)) {
            return this.calculatePositionSameAbscissAlgorithm(points)
        } else if (Math.round(y1) === Math.round(y2) && Math.round(y2) === Math.round(y3)) {
            return this.calculatePositionSameOrdinateAlgorithm(points)
        } else {
            return this.calculatePositionThreePointsAlgorithm(points)
        }
    }

    static calculatePositionThreePointsAlgorithm (flags) {
        const [x1, y1, d1] = flags[0].slice(0, 3)
        const [x2, y2, d2] = flags[1].slice(0, 3)
        const [x3, y3, d3] = flags[2].slice(0, 3)
        
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
        // console.log([X, Y])
        return [X, Y]
    }

    static calculatePositionSameAbscissAlgorithm (flags) {
        const [x1, y1, d1] = flags[0].slice(0, 3)
        const [x2, y2, d2] = flags[1].slice(0, 3)
        const [x3, y3, d3] = flags[2].slice(0, 3)

        let Y = (y2 * y2 - y1 * y1 + d1 * d1 - d2 * d2) / (2 * (y2 - y1))
        let X1 = x1 - Math.sqrt(d1 * d1 - (Y - y1) * (Y - y1))
        let X2 = x1 + Math.sqrt(d1 * d1 - (Y - y1) * (Y - y1))
        let X = [X1, X2].sort((a, b) => 
            Math.abs(
                (a - x3) * (a - x3) - (Y - y3) * (Y - y3) - d3 * d3) - 
                ((b - x3) * (b - x3) - (Y - y3) * (Y - y3) - d3 * d3)
            )[0]
        // console.log(`Same Absciss Case, Y: ${Y}, X1: ${X1}, X2: ${X2}`)
        return [X, Y]
    }

    static calculatePositionSameOrdinateAlgorithm (flags) {
        const [x1, y1, d1] = flags[0].slice(0, 3)
        const [x2, y2, d2] = flags[1].slice(0, 3)
        const [x3, y3, d3] = flags[2].slice(0, 3)

        let X = (x2 * x2 - x1 * x1 + d1 * d1 - d2 * d2) / (2 * (x2 - x1))
        let Y1 = y1 - Math.sqrt(d1 * d1 - (X - x1) * (X - x1))
        let Y2 = y1 + Math.sqrt(d1 * d1 - (X - x1) * (X - x1))
        let Y = [Y1, Y2].sort((a, b) => 
            Math.abs(
                (X - x3) * (X - x3) - (a - y3) * (a - y3) - d3 * d3) - 
                ((X - x3) * (X - x3) - (b - y3) * (b - y3) - d3 * d3)
            )[0]
        // console.log(`Same Ordinate Case, X: ${X}, Y1: ${Y1}, Y2: ${Y2}`)
        return [X, Y]
    }

    static sortFlagsByDistance (flags) {
        flags.sort((a, b) => Math.abs(a[2]) - Math.abs(b[2]))
        // flags.sort((a, b) => {
        //     if (a[0] < b[0]) return -1
        //     if (a[0] > b[0]) return 1
        //     return 0
        // })
        return flags
    }
    static preparePointsFromThree (flags) {
        // console.log(flags)
        if (flags.length < 3) 
            throw new Error(`Слишком мало флагов (${flags.length}). Нельзя вычислить позицию методом calculatePositionThreePointsAlgorithm`)
        return flags.slice(0, 3)
    }
    static preparePointsFrom (flags, player, obj) {
        let points = []
        let i = 1
        while ( //Исключить случай, когда все 4 точки лежат на 1 прямой
                (Math.round(player[0]) === Math.round(flags[0][0]) 
            && Math.round(player[0]) === Math.round(flags[i][0]) )
            || (Math.round(player[1]) === Math.round(flags[0][1]) 
            && Math.round(player[1]) === Math.round(flags[i][1]) )
        ) {
                if (i < flags.length) {
                    i += 1
                } else {
                    break
                }
            }
        points.push(flags[0].slice(0, 2))
        points.push(player.slice(0, 2))
        points[1].push(obj[0])
        points.push(flags[i].slice(0, 2))
        const distanceObjectFlag1 = Math.sqrt(
            obj[0] * obj[0] 
             + flags[0][2] * flags[0][2] 
             - 2 * obj[0] * flags[0][2] * Math.cos(Math.abs(obj[1] - flags[0][3]) * (Math.PI / 180))
            )
        const distanceObjectFlag2 = Math.sqrt(
            obj[0] * obj[0]
             + flags[i][2] * flags[i][2]
             - 2 * obj[0] * flags[i][2] * Math.cos(Math.abs(obj[1] - flags[i][3]) * (Math.PI / 180))
            )
        points[0].push(distanceObjectFlag1)
        points[2].push(distanceObjectFlag2)
        return points
    }
}

module.exports = PositionCalculation // Экспорт