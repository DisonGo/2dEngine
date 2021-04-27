// mainCan.style.height = aHeight + "px"
let params = {
    type: Two.Types.svg,
    width: aWidth,
    height: aHeight,
    autostart: true
}

let cPos = new Dot(0, 0)
cPos.checkPos = function (e) {
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
let centerP = new Point(aWidth / 2, aHeight / 2)
let deTwo = new Two(params)
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

function testPlace() {
    let starDot1 = new Dot(aWidth / 4, aHeight / 2),
        starDot2 = new Dot(aWidth * 3 / 4, aHeight / 2),
        starVec1 = new Vector(starDot1, centerP, centerP),
        starVec2 = new Vector(starDot2, centerP, centerP),
        vec = new Vector(centerP,
            new Dot(aWidth / 2, aHeight / 2 + 10),
            centerP),
        testRotVec = new Vector(new Dot(aWidth / 2 + 10, aHeight / 2 + 10),
            new Dot(aWidth / 2 + 20, aHeight / 2 + 400),
            new Dot(aWidth / 2 - 20, aHeight / 2 - 10))

    // vec.sysBegChangble = false 

    let rect = deTwo.makeRoundedRectangle(aWidth / 2, aHeight / 2, 160, 80, 20),
        star1 = deTwo.makeStar(centerP.x * 3 / 2, centerP.y, 300, 500, 20),
        centerSvg = deTwo.makeCircle(centerP.x, centerP.y, 2),
        testCirc = deTwo.makeCircle(aWidth / 2 + 10, aHeight / 2, 10)
    star2 = deTwo.makeStar(centerP.x / 2, centerP.y, 300, 500, 20)
    rect.visible = false
    star1.fill = createGradient(deTwo)
    star2.fill = createGradient(deTwo)
    star1.ancVec = starVec2
    star2.ancVec = starVec1
    let starArr = new Two.Utils.Collection(star1, star2)
    vec.createOn(deTwo, {
        show: true,
        group: UI
    })

    background.add(star1, star2, testCirc)
    UI.add(centerSvg)
    topmost.add(rect)

    centerSvg.fill = "black"
    rect.id = "Player"
    rect.stroke = getRandCSSColor()
    rect.fill = createGradient(deTwo)
    testCirc.p = new Dot(testCirc.translation.x, testCirc.translation.y)

    let rot = 0.1

    deTwo.update()

    topmost.add(createAnchorPntsArr(rect))

    rect.anchorPnts.visible = false
    // star1.anchorPnts.fill = createGradient(deTwo)
    // star1.anchorPnts.fill = createGradient(deTwo)
    {
        starArr.forEach(el => {
            background.add(createAnchorPntsArr(el))
            el.anchorPnts.fill = createGradient(deTwo)
            el.shotSet = {
                time: 50,
                speed: 400,
                width: 15,
                length: 5,
                r: 2,
                color: "red",
                anc: new Vector(new Dot(el.translation.x + el.outerRadius / 2, el.translation.y),
                    new Dot(el.translation.x + el.outerRadius / 2 + 5, el.translation.y),
                    centerP)
            }
            el.shotSet.anc.createOn(deTwo, {
                show: true,
                group: UI
            })
            el.ancVec.createOn(deTwo, {
                show: true,
                group: UI
            })
            el.anchorPnts.last.animating = true
            el.anchorPnts.cur = el.anchorPnts.last
            el.anchorPnts.scaleInc = 0.1
            el.anchorPnts.r = 20
            el.tick = function (frameCount) {
                el.ancVec.lockOn(vec)
                el.shotSet.anc.lockOn(vec)
                el.shotSet.anc.update()
                el.rotation = el.ancVec.angle
                rotateVecFrom(el.translation, el.shotSet.anc, 0.005)
                rotateAnchorPntsArrOf(el)
                let cur = el.anchorPnts.find((elem) => {
                    if (elem.animating) return elem
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
                el.partArr.tick(frameCount)
                el.ancVec.update()
            }
            el.shotParticles = deTwo.makeGroup()
            el.partArr = new Two.Utils.Collection()
            el.partArr.tick = function (frameCount) {
                el.partArr.forEach(elem => {
                    let part = elem,
                        a = part.rotation,
                        vx = cos(a) * el.shotSet.speed / frames,
                        vy = sin(a) * el.shotSet.speed / frames
                    part.translation.x += vx
                    part.translation.y += vy
                    if (checkOut(part)) {
                        el.shotParticles.remove(part)
                        el.partArr.splice(el.partArr.indexOf(part), 1)
                    }
                })
            }

            el.shotParticles

            background.add(el.shotParticles)

            el.shotInt = setInterval(() => {
                let set = el.shotSet,
                    svec = set.anc,
                    particle = deTwo.makeRoundedRectangle(svec.pf.x, svec.pf.y, set.width, set.length, set.r)
                el.shotParticles.add(particle)
                el.partArr.push(particle)
                particle.rotation = svec.angle
                particle.fill = set.color
            }, el.shotSet.time)
        })

    } //stars
    let frames = 60 
    //
    {
        rect.tick = function (frameCount) {
            let angle = vec.angle,
                speed = vec.length * 2
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
            vec.update()
            rect.trail.tick(frameCount)
        }


        rect.trail = new Two.Utils.Collection()
        rect.trail.deleteArr = []
        rect.trail.tick = function (frameCount) {
            rect.trail.forEach((el) => {
                el.tick(frameCount)
                if (rect.trail.length > rect.trail.maxLength) {
                    let elem = rect.trail.shift()
                    elem.deleting = true
                    rect.trail.deleteArr.push(elem)
                }
            })
            rect.trail.deleteArr.forEach((el) => {
                el.tick(frameCount)
                if (el.scale <= 0) rect.trail.deleteArr.splice(rect.trail.deleteArr.indexOf(el), 1)
            })
        }
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
                newPart.tick = function (frameCount) {
                    if (!this.deleting) {
                        if (this.scale > 2) {
                            this.scaleInc *= -1
                        }
                        if (this.scale < 1) {
                            this.scaleInc *= -1
                        }
                        this.scale += this.scaleInc
                    } else {
                        this.scale -= Math.abs(this.scaleInc)
                    }
                }
                rect.trail.push(newPart)
                background.add(newPart)
            }
        }, 100)
    } //rect


    testCirc.tick = function () {
        rotateFrom(centerP, testCirc.p, rot)
        testCirc.translation.x = testCirc.p.x
        testCirc.translation.y = testCirc.p.y
    }
    // testRotVec.createOn(deTwo, {
    //     show: true,
    //     group: UI
    // })
    testRotVec.tick = function () {
        rotateVecFrom(centerP, testRotVec, 0.002)
        // testRotVec.update()
    }

    function changeAnchorAngle() {
        vec.end = new Dot(cPos.x, cPos.y)
        let angle = vec.angle
        rect.rotation = angle
    }

    svg.addEventListener("mousemove", changeAnchorAngle)
    deTwo.bind("update", rect.tick)
    deTwo.bind("update", testCirc.tick)
    deTwo.bind("update", star1.tick)
    deTwo.bind("update", star2.tick)
    deTwo.bind("update", testRotVec.tick)
    deTwo.bind("update", statusBox.update)

    statusBox.target = star1.shotSet.anc
}

function checkOut(elem) {
    return (elem.translation.x < 0 || elem.translation.y < 0 || elem.translation.x > aWidth || elem.translation.y > aHeight)
}

let speedFactor = 10,
    speed = 20



deTwo.update()

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
}) // console.log(this.innerHTML);
svg.addEventListener("click", function (e) {
    cPos.checkPos(e, this)
    vec.additionalAngle += Math.PI / 2
})

let statusBox = document.getElementById("statusDiv")

function setStatusTarget(targ) {
    statusBox.target = targ
}
statusBox.update = function (frameCount) {
    if (typeof statusBox.target !== "undefined") {
        let vectr = statusBox.target
        let obj = {
            first: `x:\t${Math.round(vectr._pnts.f.x)} \ty:\t${Math.round(vectr._pnts.f.y)}`,
            second: `x:\t${Math.round(vectr._pnts.s.x)} \ty:\t${Math.round(vectr._pnts.s.y)}`,
            base: `x:\t${Math.round(vectr._sysBeg.x)} \ty:\t${Math.round(vectr._sysBeg.y)}`,
            vX: Math.round(vectr.x),
            vY: Math.round(vectr.y),
        }
        let str = ""
        for (let key in obj) {
            str += key + ":\t" + obj[key] + "\n"
        }
        statusBox.innerHTML = str
    }
    // console.log(this.innerHTML);
}
// testPlace()

let testRect = deTwo.makeRectangle()
let polys = []
let sides = 3

let quan = 1
for(let i= 0;i<quan;i++){
    let pnts = []
    for(let i= 0;i<sides;i++){
        let x = getRandom(100,1000)
        let y = getRandom(200,700)
        pnts.push(new Dot(x,y))
    }
    let center = new Point(aWidth,aHeight)
    let poly = new Polygon(pnts,centerP) 
    poly.createOn(deTwo,{show:true,group:UI})
    polys.push(poly)
    poly.SATCollision(pnts)
}
// console.log(poly.lines,poly.points);