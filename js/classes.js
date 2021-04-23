class Point{
    constructor(x,y){
        this._x = x
        this._y = y
    }
    get x(){
        return this._x
    }
    get y(){
        return this._y
    }
    set x(value){
        this._x = value
    }
    set y(value){
        this._y = value
    }
    sumX(value){
        this._x += value
    }
    sumY(value){}
}
class Dot extends Point{
    constructor(x,y){
        super(x,y)
        this._next = null
    }
    set next(dot){
        this._next = dot
    }
}
class Polygon{
    constructor(){

    }
}
class Vector{
    constructor(){
        if(arguments[0] instanceof Point){
            this._pnts = {
                f: arguments[0],
                s: arguments[1]
            }
            if(typeof arguments[2] !=="undefined")this._sysBeg = arguments[2]
            else this._sysBeg = new Point(0,0)
            for(let el in this._pnts){
                this._pnts[el].x-= (this._sysBeg.x)
                this._pnts[el].y= (this._pnts[el].y-this._sysBeg.y)*(-1)
            }
            this._Vy = this._pnts.s.y-this._pnts.f.y
            this._Vx = this._pnts.s.x-this._pnts.f.x

        }else{
            this._Vx = arguments[0]
            this._Vy = arguments[1]
        }
        this.additionalAngle = 0
        this.sysBegChangble = true
    }
    calcLength(){
        this._length = Math.sqrt(this._Vx*this._Vx+this._Vy*this._Vy)
    }
    recalcV(){
        this._Vy = this._pnts.s.y-this._pnts.f.y
        this._Vx = this._pnts.s.x-this._pnts.f.x
    }
    set end (pnt){
        this._pnts.s = pnt
        this._pnts.s.x-= this._sysBeg.x
        this._pnts.s.y= (this._pnts.s.y-this._sysBeg.y)*(-1)
        this.recalcV()
    }
    set beg (pts){
        this._pnts.f = pnt
        this._pnts.f.x-=  this._sysBeg.x
        this._pnts.f.y= (this._pnts.f.y-this._sysBeg.y)*(-1)
        this.recalcV()
    }
    set sysBeg(pnt){
        this._sysBeg = pnt
        this.recalcV()
    }
    chgSysBeg(x,y){
        this._sysBeg.x+=x
        this._sysBeg.y+=y
        if(!this.sysBegChangble){
            for(let el in this._pnts){
                this._pnts[el].x-= x
                this._pnts[el].y+= y
            }
            this.recalcV()
        }
    }
    get length(){
        this.calcLength()
        return this._length
    }
    get x(){
        return this._Vx
    }
    get y(){
        return this._Vy
    }
    get angle(){
        this._angle = AngleOfVector(this.norm)
        return this._angle + this.additionalAngle
    }
    reverse(what){
        if(typeof(what) === "undefined"){
            this._Vx = -this._Vx
            this._Vy = -this._Vy
        }else if(what == "x")this._Vx = -this._Vx
        else if(what == "y")this._V = -this._Vy
    }
    get norm(){
        let beg = new Point(0,0)
        let end = new Point(this._Vx/ this.length,this._Vy/this.length)
        return new Vector(beg,end, new Point(0,0))
    }
    сopy(vec){
        if(typeof vec._pnts !== "undefined"){
            this._pnts.f = vec._pnts.f
            this._pnts.s = vec._pnts.s
        }
        this._Vx = vec._Vx
        this._Vy = vec._Vy
        this._length = vec.length
    }
    orient(c){
        if(typeof this._pnts !=="undefined"){
            return orient(this._pnts.f,this._pnts.s,c)
        }else return "Данный вектор не подходит в этом случае"
    }
}