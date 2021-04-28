// const Two = require("./Presets/two")

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
    clone(p) {
        this._x = p.x
        this._y = p.y
        return this
    }
    reverse(what) {
        switch (what) {
            case "x":
                this._x *= -1
                break
            case "y":
                this._y *= -1
                break
            default:
                this._x *= -1
                this._y *= -1
        }
        return this
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
        this._x = p._x
        this._y = p._y
        this._next = p._next
        return this
    }
    get created() {
        return typeof this.elem !== "undefined"
    }
    move(x, y) {
        this.x += x
        this.y += y
        if (this.created) {
            this.elem.translation.x += x
            this.elem.translation.y += y
        }
    }
    moveTo(p) {
        this._x = p.x
        this._y = p.y
        if (this.created) {
            this.elem.translation.x = p.x
            this.elem.translation.y = p.y
        }
    }
    set fill(color) {
        if (this.created) this.elem.fill = color
    }
    get fill() {
        if (this.created) return this.elem.fill
        return false
    }
    createOn(ctx) {
        this.elem = ctx.makeCircle(this._x, this._y, 10)
        if (arguments.length < 2) return this.elem
        if (arguments[1].show == true) this.showOn(arguments[1].group)
        return this.elem
    }
    showOn(group) {
        group.add(this.elem)
    }
}
class Line {
    constructor(p1, p2) {
        this.pf = new Dot().clone(p1)
        this.ps = new Dot().clone(p2)
        this.pf.next = this.ps
        this.ps.next = this.pf
        this.calcV()
        this.length
    }
    calcV() {
        this.Vx = this.ps.x - this.pf.x
        this.Vy = this.ps.y - this.pf.y
    }
    get length() {
        this.calcV()
        this._length = Math.hypot(this.Vx, this.Vy)
        return this._length
    }
    get x() {
        this.calcV()
        return this.Vx
    }
    get y() {
        this.calcV()
        return this.Vy
    }
    clone(line) {
        this.pf = new Dot().clone(line.pf)
        this.ps = new Dot().clone(line.ps)
        this.pf.next = this.ps
        this.ps.next = this.pf
        this.calcV()
        this.length
    }
    get middle() {
        return new Point(this.pf.x + (this.ps.x - this.pf.x) / 2, this.pf.y + (this.ps.y - this.pf.y) / 2)
    }
    get created() {
        return typeof this.elem !== "undefined"
    }
    move(x, y) {
        this.pf.x += x
        this.pf.y += y
        this.ps.x += x
        this.ps.y += y
        if (this.created) {
            this.elem.translation.x += x
            this.elem.translation.y += y
        }
        this.length
    }
    moveTo(p) {
        let pm = this.middle
        let dif = new Point().clone(p).substrPoint(pm)
        this.pf.x += dif.x
        this.pf.y += dif.y
        this.ps.x += dif.x
        this.ps.y += dif.y
        if (this.created) {
            this.elem.translation.x = p.x
            this.elem.translation.y = p.y
        }
        this.length
    }
    set fill(color) {
        if (this.created) this.elem.fill = color
    }
    get fill() {
        if (this.created) return this.elem.fill
        return false
    }
    createOn(ctx) {
        // let x1 = this.pf.x
        //     let x2 = 
        //     let y1 = 
        //     let y2 = 
        this.elem = ctx.makeLine(this.pf.x, this.pf.y, this.ps.x, this.ps.y)
        this.elem.linewidth = 5
        this.elem.stroke = getRandCSSColor()
        if (arguments.length < 2) return this.elem
        if (arguments[1].show == true) this.showOn(arguments[1].group)
        return this.elem
    }
    showOn(group) {
        group.add(this.elem)
    }
}
class Polygon {
    constructor(pnts) {
        this._ancrsCollection = []
        this._lineCollection = []
        this._vecArr = []
        this._axisArr = []
        this._elemCollection = new Two.Utils.Collection()
        for (let el of pnts) {
            this._ancrsCollection.push(new Dot().clone(el))
        }
        for (let el of this._ancrsCollection) {
        }
        createCircLinkArr(this._ancrsCollection)
        this._ancrsCollection.forEach(el => {
            this._lineCollection.push(new Line(el, el.next))
            this._vecArr.push(new Vector(el, el.next))
            let axis = new Vector(  new Dot(el.x, el.y),
            new Dot(el.next.x, el.next.y))
            rotateVecFrom(el, axis, Math.PI / 2)
            this._axisArr.push(axis)
        })
        this.middle = this.calcBox().mid
        this.middle.createOn(deTwo,{show:1,group:UI})
        this.middle.parent = this
        this.middle.elem.parent = this
        this.middle.elem.radius = 20
        deTwo.update()
        console.log(this.middle);
        this.middle._pVecs = []
        this.middle._lVecs = []
        for (let el of this._ancrsCollection) {
            let v =new Vector(this.middle,el)
            this.middle._pVecs.push(v)
            v.createOn(deTwo,{show:1,group:UI})
        }
        for (let el of this._lineCollection) {
            let v =new Vector(this.middle,el.middle)
            this.middle._lVecs.push(v)
            v.createOn(deTwo,{show:1,group:UI})
        }
    }
    setDrag(svg){
        let poly = this
        this.middle.elem._renderer.elem.addEventListener("mousedown",function(){
            poly.middle.elem.mousedown = true
        })
        this.middle.elem._renderer.elem.addEventListener("mouseup",function(){
            poly.middle.elem.mousedown = false
        })
        return poly.middle.elem
    }
    get lines() {
        return this._lineCollection
    }
    get points() {
        return this._ancrsCollection
    }
    getPointCord(p) {
        return new Dot()
    }
    calcAnch(){
    }
    move(x,y){
        console.log(x,y);
        this._ancrsCollection.forEach(el => {
            el.move(x,y)
        })
        this._lineCollection.forEach((el ,i,arr)=> {
            let dot = new Dot()
            el.move(x +this.middle._lVecs[i],y)
        })
        this._vecArr.forEach(el => {
            el.move(x,y)
        })
        this.middle._pVecs.forEach(el => {
            el.move(x,y)
        })
        this.middle._lVecs.forEach(el => {
            el.move(x,y)
        })
    }
    moveTo(p){
        this.middle.moveTo(p)
        // this.move(dif.x,dif.y)
        this._ancrsCollection.forEach((el,i) => {
            let vx = this.middle._pVecs[i].x
            let vy = this.middle._pVecs[i].y
            let dot = new Dot(p.x + vx,p.y + vy)
            this._vecArr[i].moveTo(dot)
            this.middle._pVecs[i].moveTo(dot)    
            el.moveTo(dot)
        })
        this._lineCollection.forEach((el,i)=> {
            let vx = this.middle._lVecs[i].x
            let vy = this.middle._lVecs[i].y
            let dot = new Dot(p.x + vx,p.y + vy)
            this.middle._lVecs[i].moveTo(dot)    
            el.moveTo(dot)
        })
    }
    calcBox() {
        let cordsx1 = [],
            cordsy1 = []
        for (let elem of this._ancrsCollection) {
            cordsx1.push(elem.x)
            cordsy1.push(elem.y)
        }
        function sor(a, b) {
            return a - b
        }
        let x1 = (cordsx1.sort(sor))[0],
            y1 = (cordsy1.sort(sor))[0],
            x2 = cordsx1[cordsx1.length - 1],
            y2 = cordsy1[cordsy1.length - 1]
        let box = {
            pf: new Dot(x1, y1),
            ps: new Dot(x2, y2),
            mid: new Dot( x1 + (x2 - x1) / 2,
                            y1 + (y2 - y1) / 2)

        }
        return box
    }
    SATCollision(poly) {
        const polys = [this, poly]
        let collision = false
        polys.forEach(polygon => {
            polygon._axisArr.forEach(el => {
                function getProjectPoints(vectors) {
                    el.arranged = []
                    let pmin = Number.MAX_VALUE
                    let pmax = Number.MIN_SAFE_INTEGER
                    Object.defineProperty(el.arranged, "max", {
                        value: pmax,
                        enumerable: false,
                        writable: true
                    })
                    Object.defineProperty(el.arranged, "min", {
                        value: pmin,
                        enumerable: false,
                        writable: true
                    })
                    for (let i = 0; i < vectors.length; i++) {
                        let dot = vectors[i]
                        let p1 = new Dot().clone(el.beg),
                            v1 = new Vector().clone(dot),
                            dot1
                        if (p1 != v1.beg) {
                            let subV = new Vector(p1, v1.beg)
                            dot1 = dotProduct(el.norm, subV)
                        } else {
                            dot1 = 0
                        }
                        el.arranged.push(dot1)
                        let projectedDot = new Dot(dot1, 0).sumPoint(p1)
                        rotateFrom(p1, projectedDot, el.angle)
                        pmin = Math.min(pmin, dot1)
                        pmax = Math.max(pmax, dot1)
                        // projectedDot.createOn(deTwo, {
                        //     show: true,
                        //     group: UI
                        // })
                        // projectedDot.elem.fill = "blue"
                        // projectedDot.elem.radius = 5
                    }
                    el.arranged = el.arranged.filter(el => {
                        return Math.abs(el) > 0.0001
                    })
                    el.arranged.max = pmax
                    el.arranged.min = pmin
                    return el.arranged
                }
                const firstPoints = getProjectPoints(polys[0]._vecArr)
                const secondPoints = getProjectPoints(polys[1]._vecArr)
                el.pointsPair = [firstPoints, secondPoints]
                // console.log(el.pointsPair);
                if ((el.pointsPair[0].min - el.pointsPair[1].max > 0) || (el.pointsPair[1].min - el.pointsPair[0].max > 0)) {
                    el.gapCheck = true
                } else el.gapCheck = false
                // console.log(el.firstCheck);
            })

            collision = polygon._axisArr.every((el) => {
                return !el.gapCheck
            })
         })
        return collision
    }
    createOn(ctx) {
        for (let i = 0; i < this._ancrsCollection.length; i++) {
            this._elemCollection.push(this._lineCollection[i].createOn(ctx))
            this._elemCollection.push(this._ancrsCollection[i].createOn(ctx))
        }
        if (arguments.length < 2) return this._elemCollection
        if (arguments[1].show == true) this.showOn(arguments[1].group)
        return this._elemCollection
    }
    showOn(group) {
        group.add(this._elemCollection)
    }
}
class Vector {
    constructor() {
        let f = arguments[0],
            s = arguments[1]
        // sysBeg = arguments[2]
        if (f instanceof(Point || Dot)) {
            this._pnts = {
                f: new Dot().clone(f),
                s: new Dot().clone(s)
            }
            // if (typeof sysBeg !== "undefined") this._sysBeg = new Point().clone(sysBeg)
            // else this._sysBeg = new Point(0, 0)
            // for (let el in this._pnts) {
            //     this._pnts[el].x -= (this._sysBeg.x)
            //     this._pnts[el].y =(this._pnts[el].y - this._sysBeg.y)*(-1)
            // }
            this._Vy = this._pnts.s.y - this._pnts.f.y
            this._Vx = this._pnts.s.x - this._pnts.f.x
            this._protAtr = {
                // sysBeg: new Point().clone(this._sysBeg),
                pnts: {
                    f: new Dot().clone(f),
                    s: new Dot().clone(s)
                }
            }

        } else {
            this._Vx = f
            this._Vy = s
            this._pnts = {}
            // this._sysBeg = {}
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
        // this._pnts.s.x -= this._sysBeg.x
        // this._pnts.s.y = (this._pnts.s.y - this._sysBeg.y) * (-1)
        this.recalcV()
        // this._protAtr.pnts.s = new Dot(pnt.x - this._sysBeg.x, (this._pnts.s.y - this._sysBeg.y) * (-1))
    }
    get beg() {
        return this._pnts.f
    }
    set beg(pnt) {
        this._pnts.f = new Dot().clone(pnt)
        // this._pnts.f.x -= this._sysBeg.x
        // this._pnts.f.y = (this._pnts.f.y - this._sysBeg.y) * (-1)
        this.recalcV()
        // this._protAtr.pnts.f = new Dot(pnt.x - this._sysBeg.x, (this._pnts.f.y - this._sysBeg.y) * (-1))
    }
    get end() {
        return this._pnts.s
    }
    // set sysBeg(pnt) {
    //     let dif = new Point().clone(this._sysBeg).substrPoint(pnt)
    //     this._sysBeg = new Point().clone(pnt)
    //     if (this.sysBegChangble) {
    //         for (let el in this._pnts) {
    //             this._pnts[el].x += dif.x
    //             this._pnts[el].y -= dif.y
    //         }
    //     }
    //     // this._protAtr. = new Dot().clone(pnt)
    //     this.recalcV()
    // }
    lockOn(vec) {
        this.end = vec.pf
    }
    // chgSysBeg(x, y) {
    //     this._sysBeg.x += x
    //     this._sysBeg.y += y
    //     if (this.sysBegChangble) {
    //         this.chgBeg(x, y)
    //         this.chgEnd(x, y)
    //     }
    //     this.recalcV()
    // }
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
        // return new Dot(this._pnts.f.x + this._sysBeg.x, this._sysBeg.y - this._pnts.f._y)
        return new Dot().clone(this._pnts.f)
    }
    get ps() {
        return new Dot().clone(this._pnts.s)
        // return new Dot(this._pnts.s.x + this._sysBeg.x, this._sysBeg.y - this._pnts.s._y)
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
        return new Vector(beg, end)
    }
    get created() {
        return typeof this.elem !== "undefined"
    }
    move(x, y) {
        this._pnts.f.move(x,y)
        this._pnts.s.move(x,y)
        if (this.created) {
            this.elem.translation.x += x
            this.elem.translation.y += y
        }
        this.length
    }
    moveTo(p) {
        let x = this.x,
            y = this.y
        this._pnts.f.moveTo(p)
        this._pnts.s.moveTo(p)
        this._pnts.s.move(x,y)
        if (this.created) {
            this.elem.translation.x = p.x
            this.elem.translation.y = p.y
        }
        this.length
    }
    set fill(color) {
        if (this.created) this.elem.fill = color
    }
    get fill() {
        if (this.created) return this.elem.fill
        return false
    }
    clone(vec) {
        if (typeof vec._pnts !== "undefined") {
            this._pnts.f = new Dot().clone(vec._pnts.f)
            this._pnts.s = new Dot().clone(vec._pnts.s)
            // this._sysBeg = new Point().clone(vec._sysBeg)
            this._protAtr = {
                // sysBeg: new Point().clone(vec._protAtr.sysBeg),
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
            a1 = new Two.Anchor(0, 0, 0, 0, 0, 0, Two.Commands.move),
            a2 = new Two.Anchor(this.x * 2, this.y * 2, 0, 0, 0, 0, Two.Commands.close),
            anchors = [a1, a2]
        // p1 = new Dot(this._sysBeg.x, this._sysBeg.y)
        this.elem = ctx.makePath(anchors)
        this.elem.translation.x = pf.x
        this.elem.translation.y = pf.y
        this.elem._collection[0].x = 0
        this.elem._collection[0].y = 0
        this.elem.linewidth = 3
        // this.elem.base = createCircAtP(p1, "blue", ctx)
        this.elem.beg = this._pnts.f.createOn(ctx)
        this.elem.end = this._pnts.s.createOn(ctx)
        this.elem.beg.fill = "red"
        this.elem.end.fill = "yellow"
        this.elemCollection = new Two.Utils.Collection(this.elem.beg, this.elem.end, this.elem)
        if (arguments.length < 2) return this.elem
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
        elem.moveTo(pos)
        switch (num) {
            case 0:
                this.elem.translation.x = pos.x
                this.elem.translation.y = pos.y
                break
            case 1:
                this.elem._collection[1].x = this.x
                this.elem._collection[1].y = this.y
                break
        }
    }
    update() {
        this.updateDot(0, this.pf)
        this.updateDot(1, this.ps)
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

// let line = new Line(new Dot(0,0) ,new Dot(10,0))
// let dot = new Dot (10,-5)
// console.log(distanceToLine(line,dot));