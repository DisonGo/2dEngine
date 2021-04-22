let raph = Raphael("mainCan", aWidth, aHeight)

let w = 20
let p1 = raph.circle(0 + aWidth / 2, 0 + aHeight / 2, 30).attr({
    fill: "black",
    cursor:"grab"
})
p1.id = "cur"
let p2 = raph.circle(0 + aWidth / 2, 0 + aHeight / 2, 5).attr({
    fill: "black"
})

function buildLine(p1, p2) {
    let point1 = transCircToPoint(p1)
    let point2 = transCircToPoint(p2)
    let svgPath = connectPointsPath(point1, point2)
    if (typeof p1.line === "undefined") {
        p1.line = raph.path(svgPath).attr({
            stroke: "black",
            fill: "green",
            "stroke-width": 3
        })
    } else {
        p1.line.remove()
        p1.line = raph.path(svgPath).attr({
            stroke: "black",
            fill: "green",
            "stroke-width": 3
        })
    }
    p1.line.insertBefore(p1)
    p2.line = p1.line
}function transCircToPoint(circ) {
    return new Point(circ.attr().cx, circ.attr().cy)
}p1.drag(function() {
    let ar = arguments
    let x = ar[2]
    let y = ar[3]
    this.attr({
        cx: x,
        cy: y,
        fill: `rgb(${(x/2)%256},${(y/2)%256},${(x*y/2)%256})`
    })
    // this.box.attr({
    //     x: x - this.attrs.r,
    //     y: y - this.attrs.r,
    // })

    let pp1 = transCircToPoint(this)
    let pp2 = transCircToPoint(p2)
    this.line.angle = Raphael.angle(pp1.x,pp1.y,pp2.x,pp2.y);
    // let newP = raph.path(this.line.getSubpath(this.line.length/2,this.line.length/2+20)).attr({text:"lol"})
    // this.txt.forEach(function(){
    //     this.remove()
    // })
    this.txt = raph.print(10, 10, this.line.length,"Courier New",40).attr({fill:"red"})
    // console.log(newP);
    buildLine(p1, p2)
},function(){
    this.line.length = this.line.getTotalLength()
    this.txt = raph.print(10, 10, "2",raph.getFont("1"),20).attr({fill:"red"})
    console.log(this.txt);
    this.attr({cursor:"grabbing"})
    console.log(this.line);
    // let box = this.getBBox()
    // let x = box.x
    // let y = box.y
    // let w = box.width
    // let h = box.height
    // this.box = raph.rect(x,y,w,h).attr({
    //     stroke:"red",
    //     cx: box.cx,
    //     cy: box.cy,
    //     cursor: this.attrs.cursor
    // })
    // this.box.insertBefore(this)

    this.toFront()
},function(){
    this.attr({
        cursor:"grab"
    })
    // this.box.remove()
})

for (let i = 0; i < 10; i++) {
    raph.circle(aWidth / 2, aHeight / 2, i * w).attr({
        stroke: getRandCSSColor(),
        "stroke-width": w
    })
}
raph.forEach((e) => {
    let randTime = getRandom(100,2000)
    setInterval(() => {
        let atr = e.attr()
        let rand = getRandom(1,20)
        let randMs = getRandom(300,5000)
        let r = getRandom(20,300)
        e.animate({
                stroke: getRandCSSColor(),
                "stroke-width": rand,
                r: r
            }, randMs, "bounce")
        }, randTime)
    e.click(() => {
        let atr = e.attr()
        let r = getRandom(50, 500)
        let randMs = getRandom(300,5000)
        atr.stroke = getRandCSSColor()
        e.attr(atr)
        e.animate({
            stroke: getRandCSSColor(),
            r: r
        }, randMs, "bounce")
    })
})
p1.toFront()
let p1 = new Point(0, 0)
let p2 = new Point(1, 1)
alert(Raphael.angle(p1.x, p1.y, p2.x, p2.y))