let Vector = function (x, y) {
    this.x = x
    this.y = y
}

Vector.polar = function (r, theta) {
    return new Vector(r * Math.cos(theta), r * Math.sin(theta))
}

Vector.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
}

Vector.prototype.copy = function () {
    return new Vector(this.x, this.y)
}

Vector.prototype.setLength = function (length) {
    let current = this.length()
    if (current) {
        let scale = length / current
        this.x *= scale
        this.y *= scale
    }
    return this
}

Vector.prototype.setAngle = function (theta) {
    let r = length()
    this.x = r * Math.cos(theta)
    this.y = r * Math.sin(theta)
    return this
}

Vector.prototype.getAngle = function () {
    return Math.atan2(this.y, this.x)
}

Vector.prototype.d = function (v) {
    let dx = v.x - this.x
    let dy = v.y - this.y
    return Math.sqrt(dx * dx + dy * dy)
}



/**
 * Represents a vector field based on an array of data,
 * with specified grid coordinates, using bilinear interpolation
 * for values that don't lie on grid points.
 */

/**
 * 
 * @param field 2D array of Vectors
 * 
 * next params are corners of region.
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 */
let VectorField = function (field, x0, y0, x1, y1) {
    this.x0 = x0
    this.x1 = x1
    this.y0 = y0
    this.y1 = y1
    this.field = field
    this.w = field.length
    this.h = field[0].length
    this.maxLength = 0
    let mx = 0
    let my = 0
    for (let i = 0; i < this.w; i++) {
        for (let j = 0; j < this.h; j++) {
            if (field[i][j].length() > this.maxLength) {
                mx = i
                my = j
            }
            this.maxLength = Math.max(this.maxLength, field[i][j].length())
        }
    }
    mx = (mx / this.w) * (x1 - x0) + x0
    my = (my / this.h) * (y1 - y0) + y0
}

/**
 * Reads data from raw object in form:
 * {
 *   x0: -126.292942,
 *   y0: 23.525552,
 *   x1: -66.922962,
 *   y1: 49.397231,
 *   gridWidth: 501.0,
 *   gridHeight: 219.0,
 *   field: [
 *     0,0,
 *     0,0,
 *     ... (list of vectors)
 *   ]
 * }
 *
 * If the correctForSphere flag is set, we correct for the
 * distortions introduced by an equirectangular projection.
 */
VectorField.read = function (data, correctForSphere) {
    let field = []
    let w = data.gridWidth
    let h = data.gridHeight
    let n = 2 * w * h
    let i = 0
    // OK, "total" and "weight"
    // are kludges that you should totally ignore,
    // unless you are interested in the average
    // vector length on vector field over lat/lon domain.
    let total = 0
    let weight = 0
    for (let x = 0; x < w; x++) {
        field[x] = []
        for (let y = 0; y < h; y++) {
            let vx = data.field[i++]
            let vy = data.field[i++]
            let v = new Vector(vx, vy)
            // Uncomment to test a constant field:
            // v = new Vector(10, 0);
            if (correctForSphere) {
                let ux = x / (w - 1)
                let uy = y / (h - 1)
                let lon = data.x0 * (1 - ux) + data.x1 * ux
                let lat = data.y0 * (1 - uy) + data.y1 * uy
                let m = Math.PI * lat / 180
                let length = v.length()
                if (length) {
                    total += length * m
                    weight += m
                }
                v.x /= Math.cos(m)
                v.setLength(length)
            }
            field[x][y] = v
        }
    }
    let result = new VectorField(field, data.x0, data.y0, data.x1, data.y1)
    //window.console.log('total = ' + total);
    //window.console.log('weight = ' + weight);
    if (total && weight) {

        result.averageLength = total / weight
    }
    return result
}

VectorField.prototype.inBounds = function (x, y) {
    return x >= this.x0 && x < this.x1 && y >= this.y0 && y < this.y1
    // return x >= this.x0 && x <= this.x1 && y >= this.y0 && y <= this.y1;
}


VectorField.prototype.bilinear = function (coord, a, b) {
    let na = Math.floor(a)
    let nb = Math.floor(b)
    let ma = Math.ceil(a)
    let mb = Math.ceil(b)
    let fa = a - na
    let fb = b - nb

    return this.field[na][nb][coord] * (1 - fa) * (1 - fb) +
        this.field[ma][nb][coord] * fa * (1 - fb) +
        this.field[na][mb][coord] * (1 - fa) * fb +
        this.field[ma][mb][coord] * fa * fb
}


VectorField.prototype.getValue = function (x, y, opt_result) {
    let a = (this.w - 1 - 1e-6) * (x - this.x0) / (this.x1 - this.x0)
    let b = (this.h - 1 - 1e-6) * (y - this.y0) / (this.y1 - this.y0)
    let vx = this.bilinear('x', a, b)
    let vy = this.bilinear('y', a, b)
    if (opt_result) {
        opt_result.x = vx
        opt_result.y = vy
        return opt_result
    }
    return new Vector(vx, vy)
}


VectorField.prototype.vectValue = function (vector) {
    return this.getValue(vector.x, vector.y)
}

VectorField.constant = function (dx, dy, x0, y0, x1, y1) {
    let field = new VectorField([[]], x0, y0, x1, y1)
    field.maxLength = Math.sqrt(dx * dx + dy * dy)
    field.getValue = function () {
        return new Vector(dx, dy)
    }
    return field
}


/**
 * Listens to mouse events on an element, tracks zooming and panning,
 * informs other components of what's going on.
 */
let Animator = function () {
    this.listeners = []
    this.dx = 0
    this.dy = 0
    this.scale = 1
    this.stop = false
}

Animator.prototype.add = function (listener) {
    this.listeners.push(listener)
}

Animator.prototype.notify = function (message) {
    if (this.stop) {
        return
    }
    for (let i = 0; i < this.listeners.length; i++) {
        let listener = this.listeners[i]
        if (listener[message]) {
            listener[message].call(listener, this)
        }
    }
}

Animator.prototype.start = function (opt_millis) {
    let millis = opt_millis || 20
    let self = this
    function go() {
        let start = new Date()
        self.notify('animate')
        let time = new Date() - start
        setTimeout(go, Math.max(10, millis - time))
    }
    go()
}


let Particle = function (x, y, age) {
    this.x = x
    this.y = y
    this.oldX = -1
    this.oldY = -1
    this.age = age
    this.rnd = Math.random()
}


/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} scale The scale factor for the projection.
 * @param {number} offsetX
 * @param {number} offsetY
 * @param {number} longMin
 * @param {number} latMin
 * @param {VectorField} field
 * @param {number} numParticles
 */
let MotionDisplay = function (canvas, field, map) {
    this.canvas = canvas;
    this.projection = function (x, y, opt_v) {
        let v = opt_v || new Vector()
        let p = map.latLngToContainerPoint([y, x])
        if (p.x < 0 || p.x > canvas.width) {
            let right = map.latLngToContainerPoint([0, 180]);
            let left = map.latLngToContainerPoint([0, -180]);
            let rightFix = (-left.x) / 10
            if (right.x < canvas.width + rightFix) {
                let diff = canvas.width - right.x
                if (p.x < left.x + diff + rightFix) {
                    p.x = right.x + (p.x - left.x)
                }
            }
            let leftFix = (right.x - canvas.width) / 10
            if (left.x > 0 - leftFix) {
                if (p.x > right.x - left.x - leftFix) {
                    p.x = left.x - (right.x - p.x)
                }
            }
        }
        v.x = p.x
        v.y = p.y
        return v
    }
    this.field = field
    this.first = true
    this.maxLength = field.maxLength
    this.x0 = this.field.x0
    this.x1 = this.field.x1
    this.y0 = this.field.y0
    this.y1 = this.field.y1

    // 粒子宽度
    this.lineWidth = 1
    // 粒子长度
    this.backgroundAlpha = 'rgba(0, 0, 0, 0.92)'
    // 例子颜色
    this.color = 'rgba(255, 255, 255, 1)'
    // 粒子速度
    this.speedScale = 1
    // 粒子数目
    this.numParticles = 4000

    this.makeNewParticles(null, true)
}

MotionDisplay.prototype.makeNewParticles = function (animator) {
    this.particles = []
    for (let i = 0; i < this.numParticles; i++) {
        this.particles.push(this.makeParticle(animator))
    }
}

MotionDisplay.prototype.makeParticle = function (animator) {
    let dx = animator ? animator.dx : 0
    let dy = animator ? animator.dy : 0
    let scale = animator ? animator.scale : 1
    let safecount = 0
    for (; ;) {
        let a = Math.random()
        let b = Math.random()
        let x = a * this.x0 + (1 - a) * this.x1
        let y = b * this.y0 + (1 - b) * this.y1
        let v = this.field.getValue(x, y)
        if (this.field.maxLength == 0) {
            return new Particle(x, y, 1 + 40 * Math.random())
        }
        let m = v.length() / this.field.maxLength
        // The random factor here is designed to ensure that
        // more particles are placed in slower areas; this makes the
        // overall distribution appear more even.
        if ((v.x || v.y) && (++safecount > 10 || Math.random() > m * .9)) {
            let proj = this.projection(x, y)
            let sx = proj.x * scale + dx
            let sy = proj.y * scale + dy
            if (++safecount > 10 || !(sx < 0 || sy < 0 || sx > this.canvas.width || sy > this.canvas.height)) {
                return new Particle(x, y, 1 + 40 * Math.random())
            }
        }
    }
}

MotionDisplay.prototype.animate = function (animator) {
    this.moveThings(animator)
    this.draw(animator)
}

MotionDisplay.prototype.moveThings = function (animator) {
    let speed = .01 * this.speedScale / animator.scale
    for (let i = 0; i < this.particles.length; i++) {
        let p = this.particles[i]
        if (p.age > 0 && this.field.inBounds(p.x, p.y)) {
            let a = this.field.getValue(p.x, p.y)
            p.x += speed * a.x
            p.y += speed * a.y
            if (p.x < this.x0) {
                p.x = this.x1 - (this.x0 - p.x)
            }
            if (p.x > this.x1) {
                p.x = this.x0 + (p.x - this.x1)
            }
            p.age--
        } else {
            this.particles[i] = this.makeParticle(animator)
        }
    }
}

MotionDisplay.prototype.draw = function (animator) {
    let g = this.canvas.getContext('2d')
    let w = this.canvas.width
    let h = this.canvas.height
    let dx = animator.dx
    let dy = animator.dy
    let scale = animator.scale

    let prev = g.globalCompositeOperation
    g.globalCompositeOperation = 'destination-in'
    g.fillStyle = this.backgroundAlpha
    g.fillRect(dx, dy, w * scale, h * scale)
    g.globalCompositeOperation = prev

    let proj = new Vector(0, 0)
    g.lineWidth = this.lineWidth
    g.strokeStyle = this.color
    for (let i = 0; i < this.particles.length; i++) {
        let p = this.particles[i]
        if (!this.field.inBounds(p.x, p.y)) {
            p.age = -2
            continue
        }
        this.projection(p.x, p.y, proj)
        proj.x = proj.x * scale + dx
        proj.y = proj.y * scale + dy
        if (proj.x < 0 || proj.y < 0 || proj.x > w || proj.y > h) {
            p.age = -2
        }
        if (p.oldX != -1) {
            g.beginPath()
            g.moveTo(proj.x, proj.y)
            g.lineTo(p.oldX, p.oldY)
            g.stroke()
        }
        p.oldX = proj.x
        p.oldY = proj.y
    }
}
