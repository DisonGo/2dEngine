// mainCan.style.height = aHeight + "px"
let params = {
    type: Two.Types.svg,
    width: aWidth,
    height: aHeight,
    autostart: true
}
let deTwo = new Two(params)
deTwo.frameCount = 60
deTwo.appendTo(mainCan)
let rect = deTwo.makeRectangle(aWidth / 2, aHeight / 2, 160, 80, 10)
rect.id = "Player"
let circ = deTwo.makeCircle(aWidth / 2, aHeight / 2, 10)
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
    let angleR = rect.rotation
    let p1 = new Point(0,0)
    let p2 = new Point(rect._collection[0].x,rect._collection[0].y)
    let pVec = new Vector( p1,p2)
    // log(pVec)
    let x = rect._collection[0].x* cos(angleR) + rect.translation.x 
    let y = rect._collection[0].y* sin(angleR) + rect.translation.y 
    circ.translation.x = x
    circ.translation.y = y
    // rect.parent._renderer.elem.appendChild(rect._renderer.elem)
}
setInterval(() => {
    // console.log(vec._sysBeg)
}, 1000);
rect.trail = new Two.Utils.Collection()
rect.spawnTrail = setInterval(function () {
    if (rect.moving) {
        let newPart = deTwo.makeCircle(rect.translation.x, rect.translation.y, rect.width / 10)
        let fColor = new Two.Stop(0, getRandCSSColor(), 1)
        let sColor = new Two.Stop(0.5, getRandCSSColor(), 0.7)
        let tColor = new Two.Stop(1, getRandCSSColor(), 1)
        newPart.fill = deTwo.makeLinearGradient(-100,
            -50,
            100,
            50, fColor, sColor, tColor)
        newPart.noStroke()
        rect.trail.push(newPart)
    }
    
    // console.log(new Point(x,y), angle) 
}, 100)
circ.fill = "black"
rect.stroke = getRandCSSColor()
let fColor = new Two.Stop(0, getRandCSSColor(), 1)
let sColor = new Two.Stop(0.5, getRandCSSColor(), 0.8)
let tColor = new Two.Stop(1, getRandCSSColor(), 1)
let grad = deTwo.makeLinearGradient(-100,
    -50,
    100,
    50, fColor, sColor, tColor)
rect.fill = grad
let svg = deTwo.renderer.domElement
svg.addEventListener("mousemove", function (e) {
    let x = e.clientX - this.getBoundingClientRect().x
    let y = e.clientY - this.getBoundingClientRect().y
    cPos.x = x
    cPos.y = y
})
let vec = new Vector(new Point(aWidth / 2, aHeight / 2), new Point(aWidth / 2, aHeight / 2+10), new Point(aWidth / 2, aHeight / 2))
let cPos = {
    x: 0,
    y: 0
}
// rect.rotation = AngleOfVector(vec)

function changeAnchorAngle() {
    vec.end = new Point(cPos.x, cPos.y)
    let angle = vec.angle
    rect.rotation = angle
}
let speedFactor = 10
let speed = 20
let frames = 60
deTwo.update()
deTwo.bind("update",rect.tick)
svg.addEventListener("mousemove", changeAnchorAngle)
svg.addEventListener("wheel", function (e) {
    let delta = (e.deltaY) / 100 + 1
    console.log(delta)
    if (speed > speedFactor) {
        if (!delta) {
            speed += speedFactor - 1
        } else [
            speed -= speedFactor - 1
        ]
    } else {
        speed = speedFactor + 1
    }
})
rect._renderer.elem.addEventListener("click",function(){
    vec.additionalAngle += Math.PI/2
})
