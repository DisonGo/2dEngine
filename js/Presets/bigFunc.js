function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandCSSColor() {
    return "rgb(" + Math.floor(getRandom(0, 255)) + "," + Math.floor(getRandom(0, 255)) + "," + Math.floor(getRandom(0, 255)) + ")"
}

function log(any) {
    console.log(any);
}

function updateSizes() {
    aHeight = document.documentElement.clientHeight;
    aWidth = document.documentElement.clientWidth;
}

function resizeBody() {
    document.body.style.height = aHeight + "px";
    document.body.style.width = aWidth + "px";
}

function switchBool(x) {
    if (x) {
        x = false
    } else x = true
    return x
}

function cos(a) {
    return Math.cos(a)
}

function sin(a) {
    return Math.sin(a)
}

function tg(a) {
    return Math.tan(a)
}

function ctg(x) {
    return 1 / Math.tan(x);
}

function arcctg(x) {
    return Math.PI / 2 - Math.atan(x);
}

function atg(a) {
    return Math.atan(a)
}

function acos(a) {
    return Math.acos(a)
}
function asin(a) {
    return Math.asin(a)
}

function transorm_obj_to_bin_vector(obj) {
    let newVector = [];
    let newSubVec = [];
    for (let i = 0; i < obj.lenght; i++) {
        if (obj.charCodeAt(i) != 10) {
            if (obj.charCodeAt(i) == 32) newSubVec.push(0)
            else newSubVec.push(1)
        } else {
            newVector.push(newSubVec)
            newSubVec = [];
        }
    }
    return newVector;
}