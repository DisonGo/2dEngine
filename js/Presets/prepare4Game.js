"use strict";
let aHeight = document.documentElement.clientHeight;
let aWidth = document.documentElement.clientWidth;
console.log(aHeight);
document.body.style.height = aHeight + "px";
document.body.style.width = aWidth + "px";
document.body.style.overflow = "hidden";

