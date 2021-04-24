// const Two = require("./Presets/two.js")

function rotate(dot, angle) {
  let x = dot.x * cos(angle) - dot.y * sin(angle)
  let y = dot.x * sin(angle) + dot.y * cos(angle)
  dot.x = x
  dot.y = y
}
function rotateFrom(beg, dot, angle) {
  let x = beg.x + (dot.x - beg.x) * cos(angle) - (dot.y - beg.y) * sin(angle)
  let y = beg.y + (dot.y - beg.y) * cos(angle) + (dot.x - beg.x) * sin(angle)
  dot.x = x
  dot.y = y
}
function rotateVecFrom(beg,v,angle){
  let p1 = v._protAtr.pnts.f
  let p2 = v._protAtr.pnts.s
  let p3 = v._protAtr.sysBeg
  rotateFrom(beg,p3,angle)
  rotateFrom(p3,p1,angle) 
  rotateFrom(p3,p2,angle)
  let nv = new Vector(p1,p2,p3)
  v.clone(nv)
}

function angleVector(angle) {
  return Vector(cos(angle), sin(angle));
}

function AngleOfVector(Vec) {
  let V = Vec.norm
  let a = acos(V.x);
  if (V.y < 0) a = Math.PI * 2 - a;
  return a;
}

function orient(a, b, c) {
  return (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x)
}

function createAnchorPntsArr(element) {
  element.anchorPnts = new Two.Utils.Collection()
  for (let i = 0; i < element._collection.length; i++) {
    let arr = element._collection
    let elem = arr[i]
    if(typeof element.translation ==="undefined")element.translation = new Two.Vector(elem._matrix.elements[2],elem._matrix.elements[5])
    let nP = new Point(element.translation.x + elem.x, element.translation.y + elem.y)
    element.anchorPnts.push(deTwo.makeCircle(nP.x, nP.y, 5))
    element.anchorPnts[i].fill = "red"
    element.anchorPnts[i].p = nP
    element.anchorPnts[i].baseC = new Point(0, 0)
    element.anchorPnts[i].baseC.x = elem.x
    element.anchorPnts[i].baseC.y = elem.y
  }
  return element.anchorPnts
}

function rotateAnchorPntsArrOf(element) {
  let angleR = element.rotation
  let base = new Point(element.translation.x, element.translation.y)
  for (elem of element.anchorPnts) {
    elem.p.x = (element.translation.x - elem.baseC.x)
    elem.p.y = (element.translation.y - elem.baseC.y)
    rotateFrom(base, elem.p, angleR )
    elem.translation.x = elem.p.x
    elem.translation.y = elem.p.y
  }
}
function createCircAtP(p,color,ctx){
  let circ = ctx.makeCircle(p.x,p.y,6)
  circ.fill = color
  return circ
}