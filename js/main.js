// mainCan.style.height = aHeight + "px"
let params = {
    type: Two.Types.svg,
    width: aWidth,
    height: aHeight,
    autostart: true
}

let cPos = new Dot(0,0)
    cPos.checkPos =  function (e) {
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
let centerP = new Dot(aWidth / 2, aHeight / 2),
    vec = new Vector(centerP, new Dot(aWidth / 2, aHeight / 2 + 10), centerP),
    ancVec = new Vector().clone(vec),
    testRotVec = new Vector(new Dot(aWidth / 2 + 100, aHeight / 2 + 100), new Dot(aWidth / 2 + 20, aHeight / 2 + 10), new Dot(aWidth / 2 - 20, aHeight / 2 - 10))
    deTwo = new Two(params)

    // vec.sysBegChangble = false 

deTwo.frameCount = 60
deTwo.appendTo(mainCan)

let svg = deTwo.renderer.domElement
svg.id = "svg"

let background = deTwo.makeGroup(),
    topmost = deTwo.makeGroup(),
    UI = deTwo.makeGroup()

background.id = "Background"
UI.id = "UI"
topmost.id = "Top"

let rect = deTwo.makeRoundedRectangle(aWidth / 2, aHeight / 2, 160, 80, 20),
    star = deTwo.makeStar(centerP.x, centerP.y, 400, 700, 50),
    centerSvg = deTwo.makeCircle(centerP.x, centerP.y, 2),
    testCirc = deTwo.makeCircle(aWidth / 2 + 10, aHeight / 2, 10)
rect.visible = false
star.fill = createGradient(deTwo)
star.ancVec = ancVec

// vec.createOn(deTwo,{show:true,group:UI})

background.add(star, testCirc)
UI.add(centerSvg)
topmost.add(rect)

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

star.shotSet = {
    time: 50,
    speed: 400,
    width: 15,
    length: 5,
    r: 2,
    color: "red",
    anc:    new Vector(new Dot(star.translation.x + star.outerRadius / 2, star.translation.y),
            new Dot(star.translation.x + star.outerRadius / 2 + 5, star.translation.y),
            new Dot(star.translation.x + star.outerRadius / 2, star.translation.y))
}
star.shotSet.anc.createOn(deTwo,{show:true,group:UI})
star.anchorPnts.last.animating = true
star.anchorPnts.cur = star.anchorPnts.last
star.anchorPnts.scaleInc = 0.1
star.anchorPnts.r = 20
star.tick = function () {
    star.ancVec.lockOn(vec)
    star.shotSet.anc.lockOn(vec)
    star.shotSet.anc.update()
    star.rotation = star.ancVec.angle
    rotateVecFrom(centerP, star.shotSet.anc, 0.005)
    rotateAnchorPntsArrOf(star)
    let cur = star.anchorPnts.find((el) => {
        if (el.animating) return el
    })
    if (typeof cur !== "undefined") {
        if (cur.scale > 3) {
            cur.scaleInc *= -1
        }
        if (cur.scale < 0.1) {
            // console.log(cur.id, cur.next.id);
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
    let set = star.shotSet,
        svec = set.anc,
        pos = star.translation,
        particle = deTwo.makeRoundedRectangle(svec.pf.x, svec.pf.y, set.width, set.length, set.r)
    star.shotParticles.add(particle)
    particle.rotation = svec.angle
    particle.fill = set.color
    particle.tick = function () {
        let part = particle,
            a = part.rotation,
            vx = cos(a) * set.speed / frames,
            vy = sin(a) * set.speed / frames
        part.translation.x += vx
        part.translation.y += vy
        if(checkOut(part)) star.shotParticles.remove(part)
    }
    deTwo.bind("update", particle.tick)
}, star.shotSet.time)
let frames = 60

rect.tick = function () {
    let angle = vec.angle,
        vx = cos(angle) * speed / frames,
        vy = sin(angle) * speed / frames
    if (vec.length > 5 + new Vector(vx, vy).length) {
        vec.chgBeg(vx, vy)
        rect.translation.x = vec.pf.x
        rect.translation.y = vec.pf.y
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
        let newPart = deTwo.makeCircle(rect.translation.x, rect.translation.y, rect.width / 10),
            fColor = new Two.Stop(0, getRandCSSColor(), 1),
            sColor = new Two.Stop(0.5, getRandCSSColor(), 0.7),
            tColor = new Two.Stop(1, getRandCSSColor(), 1),
            grad = deTwo.makeLinearGradient(-10,
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


testCirc.tick = function () {
    rotateFrom(centerP, testCirc.p, rot)
    testCirc.translation.x = testCirc.p.x
    testCirc.translation.y = testCirc.p.y
}
// testRotVec.createOn(deTwo,{show:true,group:UI})
testRotVec.tick = function(){
    rotateVecFrom(centerP,testRotVec,0.02)
    // testRotVec.update()
}

function changeAnchorAngle() {
    vec.end = new Dot(cPos.x, cPos.y)
    let angle = vec.angle
    rect.rotation = angle
}
function checkOut(elem) {
    return(elem.translation.x<0||elem.translation.y<0||elem.translation.x>aWidth||elem.translation.y>aHeight)
}
let statusBox = document.getElementById("statusDiv")
statusBox.target = star.shotSet.anc
function setStatusTarget(targ){
    statusBox.target = targ
}
let speedFactor = 10,
    speed = 20

deTwo.update()

deTwo.bind("update", rect.tick)
deTwo.bind("update", testCirc.tick)
deTwo.bind("update", star.tick)
deTwo.bind("update", testRotVec.tick)
deTwo.bind("update", (frameCount)=>{
    statusBox.update(statusBox.target)
})
svg.addEventListener("mousemove", changeAnchorAngle)
svg.addEventListener("wheel", function (e) {
    let delta = (e.deltaY)
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
statusBox.update = function (vectr){
    let obj = {
        first: `x:\t${Math.round(vectr._pnts.f.x)} \ty:\t${Math.round(vectr._pnts.f.y)}`,
        second: `x:\t${Math.round(vectr._pnts.s.x)} \ty:\t${Math.round(vectr._pnts.s.y)}`,
        base: `x:\t${Math.round(vectr._sysBeg.x)} \ty:\t${Math.round(vectr._sysBeg.y)}`,
        vX: Math.round(vectr.x),
        vY: Math.round(vectr.y),
    }
    statusBox.innerHTML = ""
    for(let key in obj){
        statusBox.innerHTML += key + ":\t" + obj[key] + "\n"
    }
    // console.log(this.innerHTML);
}
svg.addEventListener("click", function (e) {
    cPos.checkPos(e, this)
    vec.additionalAngle += Math.PI / 2
})