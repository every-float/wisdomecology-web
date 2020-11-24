// SpeedLayer
function createOverlay(origin) {
    let field = formatDate(origin)

    let xArr = field[0].map(function (item) { return item.x })
    let yArr = field.map(function (item) { return item[0].y })
    let xStep = xArr[1] - xArr[0]
    let yStep = yArr[1] - yArr[0]
    function scale(p) {
        let x = xArr[0] + xStep * p[0]
        let y = yArr[0] + yStep * p[1]
        return [y, x]
    }
    let vArr = field.map(function (item) {
        return item.map(function (p) {
            return p.v
        })
    })

    let zs = []
    for (let i = 0; i <= 40; i += 2) {
        zs.push(i)
    }

    let colours = d3.scaleLinear()
        .domain([zs[0], 15, zs[zs.length - 1]])
        .range([d3.rgb(0, 0, 0, 0.05), d3.rgb(200, 0, 150, 0.3), d3.rgb(200, 0, 150, 0.5)])

    let isoBands = []
    for (let i = 1; i < zs.length; i++) {
        let lowerBand = zs[i - 1]
        let upperBand = zs[i]

        let band = MarchingSquaresJS.IsoBands(vArr, lowerBand, upperBand - lowerBand)
        if (band.length) {
            let out = band.map(function (line) {
                return line.map(function (point) {
                    return scale(point)
                })
            })
            isoBands.push({ 'coords': out, 'color': colours(i), 'val': zs[i] })
        }
    }

    return {
        isoBands: isoBands,

        draw: function (canvas, map) {
            let ctx = canvas.getContext('2d')

            let right = map.latLngToContainerPoint([0, 180])
            let left = map.latLngToContainerPoint([0, -180])
            let diff = right.x - left.x

            let block = []
            if (right.x < canvas.width) {
                block.push(diff)
            }
            if (left.x > 0) {
                block.push(-diff)
            }

            let projection = function (diff) {
                return function (point) {
                    let p = map.latLngToContainerPoint(point)
                    return [p.x + diff, p.y]
                }
            }

            isoBands.forEach(function (group) {
                block.forEach(function (diff) {
                    let p = createPath(group.coords, projection(diff))
                    ctx.fillStyle = group.color
                    ctx.fill(p, 'evenodd')
                })
            })
        }
    }
}

function formatDate(data) {
    let field = data.field
    let dw = Math.abs(data.x1 - data.x0) / (data.w - 1)
    let dh = Math.abs(data.y1 - data.y0) / (data.h - 1)

    let out = []
    field.forEach(function (line, i) {
        line.forEach(function (point, j) {
            let v = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2))
            if (!out[j]) out[j] = []
            out[j][i] = {
                x: data.x0 + dw * i,
                y: data.y0 + dh * j,
                v: v,
            }
        })
    })
    return out
}

function createPath(group, projection) {
    let d = ''
    group.forEach(function (line) {
        line.forEach(function (p, i) {
            let point = projection(p)

            d += i === 0 ? 'M' : 'L'
            d += point[0] + ',' + point[1]
            if (i === line.length - 1) {
                d += 'Z'
            }
        })
    })
    return new Path2D(d)
}
