// const Two = require("./Presets/two.js")
let defineSetts = ["scaleInc",
  "fill",
  "stroke",
  "radius",
  "visible",
  "animating"
]
let transSetts = ["x", "y"]

defineSetts.forEach(function(key){
  Object.defineProperty(Two.Utils.Collection.prototype, ["_" + key], {
    value: Number(0),
    writable: true,
    configurable: true,
    enumerable: false
  })
  Object.defineProperty(Two.Utils.Collection.prototype, key, {
    set: function (x) {
      this.forEach((el) => {
        el[key] = x
      })
      this["_" + key] = x
    },
    get: function () {
      return this["_" + key]
    }
  })
})
transSetts.forEach(function(key){
  Object.defineProperty(Two.Utils.Collection.prototype, ["_" + key], {
    value: Number(0),
    writable: true,
    configurable: true,
    enumerable: false
  })
  Object.defineProperty(Two.Utils.Collection.prototype, key, {
    set: function (x) {
      this.forEach((el) => {
        el.translation[key] = x
      })
      this["_" + key] = x
    },
    get: function () {
      return this["_" + key]
    }
  })
})

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
  return dot
}

function rotateVecFrom(beg, v, angle) {
  let p1 = v.pf,
      p2 = v.ps,
      p3 = new Dot().clone(v._sysBeg) 
  rotateFrom(beg, p1, angle)
  rotateFrom(beg, p2, angle)
  v.clone( new Vector(p1, p2, p3))
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
  let ancArr = element.anchorPnts
  for (let i = 0; i < element._collection.length; i++) {
    let arr = element._collection
    let elem = arr[i]
    if (typeof element.translation === "undefined") element.translation = new Two.Vector(elem._matrix.elements[2], elem._matrix.elements[5])
    let nP = new Dot(element.translation.x + elem.x, element.translation.y + elem.y)
    ancArr.push(deTwo.makeCircle(nP.x, nP.y, 5))
    ancArr[i].fill = "red"
    ancArr[i].p = nP
    ancArr[i].animating = false
    ancArr[i].scaleInc = 0.1
    ancArr[i].baseC = new Dot(0, 0)
    ancArr[i].baseC.x = elem.x
    ancArr[i].baseC.y = elem.y
  }

  for (let i = 0; i < ancArr.length - 1; i++) {
    let arr = ancArr
    arr[i].next = arr[i + 1]
  }
  ancArr.first = ancArr[0]
  ancArr.last = ancArr[ancArr.length - 1]

  ancArr.last.next = ancArr.first
  console.log(ancArr)
  return ancArr
}

function rotateAnchorPntsArrOf(element) {
  let angleR = element.rotation
  let base = new Dot(element.translation.x, element.translation.y)
  for (elem of element.anchorPnts) {
    elem.p.x = (element.translation.x - elem.baseC.x)
    elem.p.y = (element.translation.y - elem.baseC.y)
    rotateFrom(base, elem.p, angleR)
    elem.translation.x = elem.p.x
    elem.translation.y = elem.p.y
  }
}

function createCircAtP(p, color, ctx) {
  let circ = ctx.makeCircle(p.x, p.y, 6)
  circ.fill = color
  return circ
}

function createGradient(ctx) {
  let fColor = new Two.Stop(0, getRandCSSColor(), 1)
  let sColor = new Two.Stop(0.5, getRandCSSColor(), 0.8)
  let tColor = new Two.Stop(1, getRandCSSColor(), 1)
  let grad = ctx.makeLinearGradient(-100,
    -50,
    100,
    50, fColor, sColor, tColor)
  return grad
}