class Point {
    constructor(x, y) {
        this._x = x
        this._y = y
    }
    get x() {
        return Number(this._x)
    }
    get y() {
        return Number(this._y)
    }
    set x(value) {
        this._x = value
    }
    set y(value) {
        this._y = value
    }
    sumX(value) {
        this._x += value
    }
    sumY(value) {}
}
class Dot extends Point {
    constructor(x, y) {
        super(x, y)
        this._next = null
    }
    set next(dot) {
        this._next = dot
    }
    get next() {
        return this._next
    }
}
class Polygon {
    constructor() {

    }
}
class Vector {
    constructor() {
        if (arguments[0] instanceof(Point || Dot)) {
            this._pnts = {
                f: new Dot(arguments[0].x, arguments[0].y),
                s: new Dot(arguments[1].x, arguments[1].y)
            }
            if (typeof arguments[2] !== "undefined") this._sysBeg = new Dot(arguments[2].x, arguments[2].y)
            else this._sysBeg = new Dot(0, 0)
            for (let el in this._pnts) {
                this._pnts[el].x -= (this._sysBeg.x)
                this._pnts[el].y = (this._pnts[el].y - this._sysBeg.y) * (-1)
            }
            this._Vy = this._pnts.s.y - this._pnts.f.y
            this._Vx = this._pnts.s.x - this._pnts.f.x
            this._protAtr = {
                sysBeg: new Dot(this._sysBeg.x, this._sysBeg.y),
                pnts: {
                    f: new Dot(arguments[0].x, arguments[0].y),
                    s: new Dot(arguments[1].x, arguments[1].y)
                }
            }

        } else {
            this._Vx = arguments[0]
            this._Vy = arguments[1]
        }
        this.additionalAngle = 0
        this.sysBegChangble = true
    }
    calcLength() {
        this._length = Math.sqrt(this._Vx * this._Vx + this._Vy * this._Vy)
    }
    recalcV() {
        this._Vy = this._pnts.s.y - this._pnts.f.y
        this._Vx = this._pnts.s.x - this._pnts.f.x
    }
    set end(pnt) {
        this._pnts.s = new Dot(pnt.x, pnt.y)
        this._pnts.s.x -= this._sysBeg.x
        this._pnts.s.y = (this._pnts.s.y - this._sysBeg.y) * (-1)
        this.recalcV()
        this._protAtr.pnts.s = new Dot(pnt.x - this._sysBeg.x, (this._pnts.s.y - this._sysBeg.y) * (-1))
    }
    set beg(pnt) {
        this._pnts.f = new Dot(pnt.x, pnt.y)
        this._pnts.f.x -= this._sysBeg.x
        this._pnts.f.y = (this._pnts.f.y - this._sysBeg.y) * (-1)
        this.recalcV()
        this._protAtr.pnts.f = new Dot(pnt.x - this._sysBeg.x, (this._pnts.f.y - this._sysBeg.y) * (-1))
    }
    set sysBeg(pnt) {
        this._sysBeg = new Dot(pnt.x, pnt.y)
        this._protAtr.pnts.f = new Dot(pnt.x, pnt.y)
        this.recalcV()
    }
    chgSysBeg(x, y) {
        this._sysBeg.x += x
        this._sysBeg.y += y
        if (!this.sysBegChangble) {
            for (let el in this._pnts) {
                this._pnts[el].x -= x
                this._pnts[el].y += y
            }
            this.recalcV()
        }
    }
    get pf() {
        return new Dot(this._pnts.f.x + this._sysBeg.x, this._sysBeg.y - this._pnts.f.y)
    }
    get ps() {
        return new Dot(this._pnts.s.x + this._sysBeg.x, this._sysBeg.y - this._pnts.s.y)
    }
    get length() {
        this.calcLength()
        return this._length
    }
    get x() {
        return this._Vx
    }
    get y() {
        return this._Vy
    }
    get angle() {
        this._angle = AngleOfVector(this)
        return this._angle + this.additionalAngle
    }
    reverse(what) {
        if (typeof (what) === "undefined") {
            this._Vx = -this._Vx
            this._Vy = -this._Vy
        } else if (what == "x") this._Vx = -this._Vx
        else if (what == "y") this._V = -this._Vy
    }
    get norm() {
        let beg = new Dot(0, 0)
        let end = new Dot(this._Vx / this.length, this._Vy / this.length)
        return new Vector(beg, end, new Dot(0, 0))
    }
    clone(vec) {
        if (typeof vec._pnts !== "undefined") {
            this._pnts.f = new Dot(vec._pnts.f.x, vec._pnts.f.y)
            this._pnts.s = new Dot(vec._pnts.s.x, vec._pnts.s.y)
            this._sysBeg = new Dot(vec._sysBeg.x, vec._sysBeg.y)
            this._protAtr = {
                sysBeg: new Dot(vec._protAtr.sysBeg.x, vec._protAtr.sysBeg.y),
                pnts: {
                    f: new Dot(vec._protAtr.pnts.f.x, vec._protAtr.pnts.f.y),
                    s: new Dot(vec._protAtr.pnts.s.x, vec._protAtr.pnts.s.y)
                }
            }
        }
        this._Vx = vec._Vx
        this._Vy = vec._Vy
        this._length = vec.length
    }
    createOn(ctx) {
        let pf = this.pf,
            ps = this.ps
        let a1 = new Two.Anchor(pf.x, pf.y, 0, 0, 0, 0,Two.Commands.move)
        let a2 = new Two.Anchor(ps.x, ps.y, 0, 0, 0, 0,Two.Commands.close)
        let anchors = [a1,a2]
        let p1 = new Dot(this._sysBeg.x, this._sysBeg.y)
        this.elem = ctx.makePath(anchors)
        this.elem.linewidth = 3
        this.elem.beg = createCircAtP(p1, "blue", ctx)
        this.elem.end = createCircAtP(ps, "yellow", ctx)
        if(arguments[1].show==true) this.showOn(arguments[1].group)
        return this.elem
    }
    showOn(group){
        group.add(this.elem)
        group.add(this.elem.beg)
        group.add(this.elem.end)
    }
    removeFrom(group){
        group.remove(this.elem)
        group.remove(this.elem.beg)
        group.remove(this.elem.end)
    }
    turnVis() {
        if (typeof this.elem !== "undefined") {
            if (this.elem.visible) {
                this.elem.visible = false
                this.elem.beg.visible = false
                this.elem.end.visible = false
            } else {
                this.elem.visible = true
                this.elem.beg.visible = true
                this.elem.end.visible = true
            }
        }
    }
    orient(c) {
        if (typeof this._pnts !== "undefined") {
            return orient(this._pnts.f, this._pnts.s, c)
        } else return "Данный вектор не подходит в этом случае"
    }
}