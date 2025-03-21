class PositionCalculator {
    static calculatePlayerPosition(flags) {
        let points = flags.sort((a, b) => a[2] - b[2])
        if (points.length === 0) {
            return [NaN, NaN]
        } else if (points.length < 3) {
            const [x1, y1, d1, a1] = flags[0]            
            return this.solveBy1(x1, y1, d1, a1)
        }
        // console.log(points)

        const [x1, y1, d1, a1] = this.parseFlag(points[0])
        let i = 1, j = 2
        while (points[i][0] === x1 || points[i][1] === y1) {
            i += 1
            if (i >= points.length) {
                i = 1
                console.log(`calculatePlayerPosition i is overflowed`)
                return this.solveBy1(x1, y1, d1, a1)
            }
        }
        while (points[j][0] === x1 || points[j][1] === y1 || i === j) {
            j += 1
            if (j >= points.length) {
                j = 2
                console.log(`calculatePlayerPosition j is overflowed`)
                return this.solveBy1(x1, y1, d1, a1)
            }
        }
        const [x2, y2, d2, a2] = points[i]
        const [x3, y3, d3, a3] = points[j]

        // const [x2, y2, d2, a2] = this.parseFlag(flags[1])
        // const [x3, y3, d3, a3] = this.parseFlag(flags[2])
        // console.log(x1, y1, d1, x2, y2, d2, x3, y3, d3)
        return this.solveBy3(x1, y1, d1, x2, y2, d2, x3, y3, d3)
    }

    static calculateObjectPosition(flags, playerCoords, objectInfo) {
        let points = flags.sort((a, b) => a[2] - b[2])
        if (points.length === 0) {
            return [NaN, NaN]
        } else if (points.length < 3) {
            const [x2, y2] = playerCoords, [d2, a2] = objectInfo            
            return this.solveBy1(x2, y2, d2, a2)
        }
        
        const [x2, y2] = playerCoords, [d2, a2] = objectInfo
        let i = 0, j = 1
        while (points[i][0] === x2 || points[i][1] === y2) {
            i += 1
            if (i >= points.length) {
                i = 0
                console.log(`calculateObjectPosition i is overflowed`)
                return this.solveBy1(x2, y2, d2, a2)
            }
        }
        while (points[j][0] === x2 || points[j][1] === points[i][1] || i === j) {
            j += 1
            if (j >= points.length) {
                j = 1
                console.log(`calculateObjectPosition j is overflowed`)
                return this.solveBy1(x2, y2, d2, a2)
            }
        }
        const [x1, y1, d1, a1] = points[i]
        const [x3, y3, d3, a3] = points[j]
        const da1 = Math.sqrt(
            d2 * d2 
             + d1 * d1 
             - 2 * d2 * d1 * Math.cos(Math.abs(a2 - a1) * (Math.PI / 180))
        )
        const da3 = Math.sqrt(
            d2 * d2 
             + d3 * d3 
             - 2 * d2 * d3 * Math.cos(Math.abs(a2 - a3) * (Math.PI / 180))
        )
        // console.log(x1, y1, da1, x2, y2, d2, x3, y3, da3)
        return this.solveBy3(x1, y1, da1, x2, y2, d2, x3, y3, da3)
    }

    static parseFlag (flag) {
        let x = flag[0]
        let y = flag[1]
        let d = flag[2]
        let a = flag[3]
        return [x, y, d, a]
    }

    static solveBy3 (x1, y1, d1, x2, y2, d2, x3, y3, d3) {
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
		return [X, Y]
	}

    static solveBy1 (x1, y1, d1, a1) {
        // console.log(x1, y1, a1, d1 * Math.cos(a1 * Math.PI / 180), d1 * Math.sin(a1 * Math.PI / 180))
        console.log(`Bad visual information. Calculating position by 1 flag`)
        const x = x1 + d1 * Math.sin(a1 * Math.PI / 180)
        const y = y1 - d1 * Math.cos(a1 * Math.PI / 180)
        return [x, y]
    }

    static check() {
        console.log("Connected")
    }
}

module.exports = PositionCalculator