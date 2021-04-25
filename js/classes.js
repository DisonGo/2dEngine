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
    sumY(value) {
        this._y += value
    }
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
    clone(p) {
        this._x = p.x
        this._y = p.y
        this._next = p.next
        return this
    }
    sumPoint(p) {
        this._x += p.x
        this._y += p.y
        return this
    }
    substrPoint(p) {
        this._x -= p.x
        this._y -= p.y
        return this
    }
}
class Polygon {
    constructor() {

    }
}
class Vector {
    constructor() {
        let f = arguments[0],
            s = arguments[1],
            sysBeg = arguments[2]
        if (f instanceof(Point || Dot)) {
            this._pnts = {
                f: new Dot().clone(f),
                s: new Dot().clone(s)
            }
            if (typeof sysBeg !== "undefined") this._sysBeg = new Dot().clone(sysBeg)
            else this._sysBeg = new Dot(0, 0)
            for (let el in this._pnts) {
                this._pnts[el].x -= (this._sysBeg.x)
                this._pnts[el].y = (this._pnts[el].y - this._sysBeg.y) * (-1)
            }
            this._Vy = this._pnts.s.y - this._pnts.f.y
            this._Vx = this._pnts.s.x - this._pnts.f.x
            this._protAtr = {
                sysBeg: new Dot().clone(this._sysBeg),
                pnts: {
                    f: new Dot().clone(f),
                    s: new Dot().clone(s)
                }
            }

        } else {
            this._Vx = f
            this._Vy = s
            this._pnts = {}
            this._sysBeg = {}
            this._protAtr = {}
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
        this._pnts.s = new Dot().clone(pnt)
        this._pnts.s.x -= this._sysBeg.x
        this._pnts.s.y = (this._pnts.s.y - this._sysBeg.y) * (-1)
        this.recalcV()
        // this._protAtr.pnts.s = new Dot(pnt.x - this._sysBeg.x, (this._pnts.s.y - this._sysBeg.y) * (-1))
    }
    get beg() {
        return this._pnts.f
    }
    set beg(pnt) {
        this._pnts.f = new Dot().clone(pnt)
        this._pnts.f.x -= this._sysBeg.x
        this._pnts.f.y = (this._pnts.f.y - this._sysBeg.y) * (-1)
        this.recalcV()
        // this._protAtr.pnts.f = new Dot(pnt.x - this._sysBeg.x, (this._pnts.f.y - this._sysBeg.y) * (-1))
    }
    get end() {
        return this._pnts.s
    }
    set sysBeg(pnt) {
        let dif = new Dot().clone(this._sysBeg).substrPoint(pnt)
        this._sysBeg = new Dot().clone(pnt)
        if (this.sysBegChangble) {
            for (let el in this._pnts) {
                this._pnts[el].x += dif.x
                this._pnts[el].y -= dif.y
            }
        }
        // this._protAtr. = new Dot().clone(pnt)
        this.recalcV()
    }
    lockOn(vec) {
        this.end = vec.pf
    }
    chgSysBeg(x, y) {
        this._sysBeg.x += x
        this._sysBeg.y += y
        if (this.sysBegChangble) {
            this.chgBeg(x, y)
            this.chgEnd(x, y)
        }
        this.recalcV()
    }
    chgBeg(x, y) {
        this._pnts.f.x += x
        this._pnts.f.y -= y
        this.recalcV()
    }
    chgEnd(x, y) {
        this._pnts.s.x += x
        this._pnts.s.y -= y
        this.recalcV()
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
        switch (what) {
            case "x":
                this._Vx *= -1
                break
            case "y":
                this._Vy *= -1
                break
            default:
                this._Vx *= -1
                this._Vy *= -1
        }
    }
    get norm() {
        let beg = new Dot(0, 0),
            end = new Dot(this._Vx / this.length, this._Vy / this.length)
        beg.next = end
        return new Vector(beg, end, new Dot(0, 0))
    }
    clone(vec) {
        if (typeof vec._pnts !== "undefined") {
            this._pnts.f = new Dot().clone(vec._pnts.f)
            this._pnts.s = new Dot().clone(vec._pnts.s)
            this._sysBeg = new Dot().clone(vec._sysBeg)
            this._protAtr = {
                sysBeg: new Dot().clone(vec._protAtr.sysBeg),
                pnts: {
                    f: new Dot().clone(vec._protAtr.pnts.f),
                    s: new Dot().clone(vec._protAtr.pnts.s)
                }
            }
        }
        this._Vx = vec._Vx
        this._Vy = vec._Vy
        this._length = vec.length
        this.additionalAngle = vec.additionalAngle
        this.sysBegChangble = vec.sysBegChangble
        return this
    }
    createOn(ctx) {
        let pf = this.pf,
            ps = this.ps,
            a1 = new Two.Anchor(pf.x, pf.y, 0, 0, 0, 0, Two.Commands.move),
            a2 = new Two.Anchor(ps.x, ps.y, 0, 0, 0, 0, Two.Commands.close),
            anchors = [a1, a2],
            p1 = new Dot(this._sysBeg.x, this._sysBeg.y)
        this.elem = ctx.makePath(anchors)
        this.elem.linewidth = 3
        this.elem.base = createCircAtP(p1, "blue", ctx)
        this.elem.beg = createCircAtP(pf, "red", ctx)
        this.elem.end = createCircAtP(ps, "yellow", ctx)
        this.elemCollection = new Two.Utils.Collection(this.elem.base, this.elem.beg, this.elem.end, this.elem)
        if (arguments[1].show == true) this.showOn(arguments[1].group)
        return this.elem
    }
    showOn(group) {
        group.add(this.elemCollection)
    }
    /**
     * Updates properties of elem collection of vector.
     * {@param} prop property updating
     */
    updateDot(num, pos) {
        let elem = this.elemCollection[num]
        elem.translation.x = pos.x
        elem.translation.y = pos.y
        switch (num) {
            case 0:
                this.sysBeg = pos
                break
            case 1:
                this.beg = pos
                this.elem._collection[0].x = elem.translation.x - this._sysBeg.x
                this.elem._collection[0].y = elem.translation.y - this._sysBeg.y
                this.elem.translation.x = pos.x
                this.elem.translation.y = pos.y
                break
            case 2:
                this.end = pos
                this.elem._collection[1].x = elem.translation.x - this._sysBeg.x
                this.elem._collection[1].y = elem.translation.y - this._sysBeg.y
                break
        }
    }
    update() {
        this.updateDot(0, this._sysBeg)
        this.updateDot(1, this.pf)
        this.updateDot(2, this.ps)
    }
    removeFrom(group) {
        group.remove(this.elemCollection)
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