// mainCan.style.height = aHeight + "px"
let params = {
    type: Two.Types.svg,
    width: aWidth,
    height: aHeight,
    autostart: true
}

let cPos = {
    x: 0,
    y: 0,
    checkPos: function (e) {
        let x, y
        // console.log(arguments);
        if (typeof arguments[1] === "undefined") {
            x = e.clientX - e.target.getBoundingClientRect().x
            y = e.clientY - e.target.getBoundingClientRect().y
        } else {
            x = e.clientX - arguments[1].getBoundingClientRect().x
            y = e.clientY - arguments[1].getBoundingClientRect().y
        }
        this.x = x
        this.y = y
    }
}
let centerP = new Dot(aWidth / 2, aHeight / 2)

let vec = new Vector(centerP, new Dot(aWidth / 2, aHeight / 2 + 10), centerP)

let ancVec = new Vector(centerP, vec._pnts.s, centerP)

let deTwo = new Two(params)
deTwo.frameCount = 60
deTwo.appendTo(mainCan)
let svg = deTwo.renderer.domElement
svg.id = "svg"

let background = deTwo.makeGroup()
let topmost = deTwo.makeGroup()
let UI = deTwo.makeGroup()
background.id = "Background"
UI.id = "UI"
topmost.id = "Top"

let rect = deTwo.makeRoundedRectangle(aWidth / 2, aHeight / 2, 160, 80, 20)
rect.visible = false
let star = deTwo.makeStar(centerP.x, centerP.y, 400, 700, 50)
star.fill = createGradient(deTwo)
let centerSvg = deTwo.makeCircle(centerP.x, centerP.y, 2)
let testCirc = deTwo.makeCircle(aWidth / 2 + 10, aHeight / 2, 10)
background.add(star, testCirc)
UI.add(centerSvg)
topmost.add(rect)
star.ancVec = ancVec

centerSvg.fill = "black"
rect.id = "Player"
rect.stroke = getRandCSSColor()
rect.fill = createGradient(deTwo)
testCirc.p = new Dot(testCirc.translation.x, testCirc.translation.y)
let rot = 0.1

deTwo.update()

background.add(createAnchorPntsArr(star))
topmost.add(createAnchorPntsArr(rect))
rect.anchorPnts.visible = false
star.anchorPnts.fill = createGradient(deTwo)
console.log(star.anchorPnts);
testCirc.tick = function () {
    rotateFrom(centerP, testCirc.p, rot)
    testCirc.translation.x = testCirc.p.x
    testCirc.translation.y = testCirc.p.y
}
star.shotSet = {
    time: 20,
    speed: 200,
    width: 15,
    length: 5,
    r: 2,
    color: "red",
    anc: new Vector(new Dot(star.translation.x + star.outerRadius / 2, star.translation.y),
        new Dot(star.translation.x + star.outerRadius / 2 + 1, star.translation.y),
        new Dot(star.translation.x + star.outerRadius / 2, star.translation.y))
}
star.anchorPnts.last.animating = true
star.anchorPnts.cur = star.anchorPnts.last
star.anchorPnts.scaleInc = 0.1
star.anchorPnts.r = 20
star.tick = function () {
    star.ancVec.end = new Dot(rect.translation.x, rect.translation.y)
    star.rotation = star.ancVec.angle
    rotateVecFrom(star.ancVec._sysBeg, star.shotSet.anc, star.rotation)
    rotateAnchorPntsArrOf(star)
    let cur = star.anchorPnts.find((el) => {
        if (el.animating) return el
    })
    if (typeof cur !== "undefined") {
        if (cur.scale > 3) {
            cur.scaleInc *= -1
        }
        if (cur.scale < 0.1) {
            console.log(cur.id, cur.next.id);
            cur.scaleInc *= -1
            cur.animating = false
            cur.next.animating = true
        }
        cur.scale += cur.scaleInc
    }
}
star.shotParticles = deTwo.makeGroup()
star.shotParticles.id = "shotPart"

background.add(star.shotParticles)

star.shotInt = setInterval(() => {
    let set = star.shotSet
    let svec = set.anc
    let pos = star.translation
    let particle = deTwo.makeRoundedRectangle(svec._pnts.f.x, svec._pnts.f.y, set.width, set.length, set.r)
    star.shotParticles.add(particle)
    particle.rotation = star.rotation
    particle.fill = set.color
    particle.tick = function () {
        let part = particle
        let a = part.rotation
        let vx = cos(a) * set.speed / frames;
        let vy = sin(a) * set.speed / frames;
        part.translation.x += vx
        part.translation.y += vy
    }
    deTwo.bind("update", particle.tick)
}, star.shotSet.time)
let frames = 60

rect.tick = function () {
    let angle = vec.angle
    let vx = cos(angle) * speed / frames;
    let vy = sin(angle) * speed / frames;
    if (vec.length > 5 + new Vector(vx, vy).length) {
        vec.chgSysBeg(vx, vy)
        rect.translation.x = vec._sysBeg.x
        rect.translation.y = vec._sysBeg.y
        rect.moving = true
        changeAnchorAngle()
    } else {
        rect.moving = false
    }
    rotateAnchorPntsArrOf(rect)
}


rect.trail = new Two.Utils.Collection()
rect.trail.maxLength = 5
rect.spawnTrail = setInterval(function () {
    if (rect.moving) {
        let newPart = deTwo.makeCircle(rect.translation.x, rect.translation.y, rect.width / 10)
        let fColor = new Two.Stop(0, getRandCSSColor(), 1)
        let sColor = new Two.Stop(0.5, getRandCSSColor(), 0.7)
        let tColor = new Two.Stop(1, getRandCSSColor(), 1)
        let grad = deTwo.makeLinearGradient(-10,
            -5,
            10,
            5, fColor, sColor, tColor)
        newPart.fill = grad
        newPart.grad = grad
        newPart.noStroke()
        newPart.up = true
        newPart.scaleInc = 0.02
        newPart.deleting = false
        deTwo.bind("update", function (frameCount) {
            if (!newPart.deleting) {
                if (newPart.scale > 2) {
                    newPart.scaleInc *= -1
                }
                if (newPart.scale < 1) {
                    newPart.scaleInc *= -1
                }
                newPart.scale += newPart.scaleInc
            }
        })
        rect.trail.push(newPart)
        background.add(newPart)
        if (rect.trail.length > rect.trail.maxLength) {
            let elem = rect.trail.shift()
            elem.deleting = true
            deTwo.bind("update", function (fc) {
                elem.scale -= Math.abs(elem.scaleInc)
                if (elem.scale < 0) {
                    deTwo.remove(elem.grad)
                    background.remove(elem)
                }
            })
        }
    }
}, 100)
clearInterval(star.shotInt)

function changeAnchorAngle() {
    vec.end = new Dot(cPos.x, cPos.y)
    let angle = vec.angle
    rect.rotation = angle
}

function checkOut() {

}
let speedFactor = 10
let speed = 20

deTwo.update()

deTwo.bind("update", rect.tick)
deTwo.bind("update", testCirc.tick)
deTwo.bind("update", star.tick)

svg.addEventListener("mousemove", changeAnchorAngle)
svg.addEventListener("wheel", function (e) {
    let delta = (e.deltaY)
    // console.log(delta)
    if (speed > speedFactor) {
        if (delta < 0) {
            speed += speedFactor - 1
        } else [
            speed -= speedFactor - 1
        ]
    } else {
        speed = speedFactor + 1
    }
})
svg.addEventListener("mousemove", function (e) {
    cPos.checkPos(e, this)
})
svg.addEventListener("click", function (e) {
    cPos.checkPos(e, this)
    vec.additionalAngle += Math.PI / 2
    if (typeof window.lastVec !== "undefined") window.lastVec.removeFrom(UI)
    window.lastVec = vec
    vec.createOn(deTwo, {
        show: true,
        group: UI
    })
})