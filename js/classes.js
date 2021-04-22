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
        this._y = value
    }
    set y(value){
        this._x = value
    }
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
            this._Vy = arguments[1].y-arguments[0].y
            this._Vx = arguments[1].x-arguments[0].x
            this._pnts = {
                f: arguments[0],
                s: arguments[1]
            }
        }else{
            this._Vy = arguments[0]
            this._Vx = arguments[1]
        }
    }
    calcLength(){
        this._length = Math.sqrt(this._Vx*this._Vx+this._Vy*this._Vy)
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
    reverse(what){
        if(typeof(what) === "undefined"){
            this._Vx = -this._Vx
            this._Vy = -this._Vy
        }else if(what == "x")this._Vx = -this._Vx
        else if(what == "y")this._V = -this._Vy
    }
    get norm(){
        return new Vector(this._Vx/ this.length,this._Vy/this.length)
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