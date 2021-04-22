 avHeig = document.documentElement.clientHeight;
 avWid = window.innerWidth;
let eventsCount = 1;
let transitions = {
    0:1,
    1:10,
    2:1
}
function setTimeList(list){
    let n;
    for(let key in list)n++;
    eventsTimeList.lenght = n;
    for(let i=0;i<n;i++)eventsTimeList[i]= list[i];
}
let eventsTimeList = {
    0:1,
    lenght:1
}
setTimeList(transitions)
 let scaleK = 0.6;
 log(avHeig)
 class blockLoad {
     constructor(heig, wid, color, cords) {
         this.height = heig;
         this.width = wid;
         this.color = color;
         this.position = cords;
         this.curRotate = 315;
         this.transition = 1;
     }
 }
 let EventsNum = 3;
 let loader = {
     blocks: [],
     blocksNode: [],
     duration: 0,
     numOfEvents: EventsNum,
     curEvent: 0,
     position: {
         0: {
             x: avWid / 2 - avWid / 100,
             y: avHeig / 2 - avWid / 100
         },
         1: {
             x: avWid / 2,
             y: avHeig / 2 - avWid / 100
         },
         2: {
             x: avWid / 2 - avWid / 100,
             y: avHeig / 2
         },
         3: {
             x: avWid / 2,
             y: avHeig / 2
         }
     },
     positionsUpd: {
         0: {
             x: avWid / 4,
             y: aHeight / 4
         },
         1: {
             x: avWid / 2 + avWid / 4,
             y: aHeight / 4
         },
         2: {
             x: avWid / 4,
             y: avHeig / 2 + avHeig / 4
         },
         3: {
             x: avWid / 2 + avWid / 4,
             y: avHeig / 2 + avHeig / 4
         }
     },
     timeOfEvents: eventsTimeList,
     eventFuncs: [],
     updBlocks: function () {
         for (let i = 0; i < loader.blocks.length; i++) {
             loader.blocksNode[i].style.height = loader.blocks[i].height + "px"
             loader.blocksNode[i].style.width = loader.blocks[i].width + "px"
             loader.blocksNode[i].style.background = loader.blocks[i].color + "px"
             loader.blocksNode[i].style.transition = loader.blocks[i].transition + "px"
         }
     },
     updBlockI: function (i) {
         loader.blocksNode[i].style.height = loader.blocks[i].height + "px"
         loader.blocksNode[i].style.width = loader.blocks[i].width + "px"
         loader.blocksNode[i].style.background = loader.blocks[i].color + "px"
         loader.blocksNode[i].style.transition = loader.blocks[i].transition + "px"
     }
 }
 document.body.style.transition = loader.timeOfEvents[0] + "s";
 log(loader.positionsUpd)
 log(avWid)
 for (let i = 0; i < 4; i++) {
     loader.blocks.push(new blockLoad(avWid / 100, avWid / 100, getRandCSSColor(), loader.position[i]))
     let newBlock = document.createElement("DIV"); /**/
     newBlock.style.height = loader.blocks[i].height + "px";
     newBlock.style.width = loader.blocks[i].width + "px";
     newBlock.style.background = loader.blocks[i].color;
     newBlock.style.top = loader.blocks[i].position.y + "px";
     newBlock.style.left = loader.blocks[i].position.x + "px";
     newBlock.style.transition = loader.blocks[i].transition + "s";
     newBlock.style.position = "absolute";
     newBlock.style.verticalAlign = "center"
     newBlock.style.fontSize = avWid / 200 + "px";
     newBlock.style.textAlign = "center";
     newBlock.style.mixBlendMode = "difference"
     loader.blocksNode.push(newBlock);
     newBlock.addEventListener("click", function () {
         loader.blocks[i].curRotate += 45;
         /*loader.blocks[i].transition = getRandom(0,2);
         loader.blocksNode[i].style.transition = loader.blocks[i].transition+"s";*/
         loader.blocksNode[i].style.transform = "rotate(" + loader.blocks[i].curRotate + "deg)"
     })
     document.body.insertBefore(newBlock, document.body.firstChild);
 }

 function event_1 () {
     for (let i = 0; i < 4; i++) {
         loader.blocks[i].width = Math.sqrt(Math.pow(avHeig / (1 / scaleK), 2) / 2);
         loader.blocks[i].height = Math.sqrt(Math.pow(avHeig / (1 / scaleK), 2) / 2);
         loader.updBlockI(i);
         loader.blocksNode[i].style.left = loader.positionsUpd[i].x - loader.blocks[i].width / 2 + "px";
         loader.blocksNode[i].style.top = loader.positionsUpd[i].y - loader.blocks[i].height / 2 + "px"
         document.body.style.transform = "rotate(360deg)"
         loader.blocksNode[i].style.transform = "rotate(" + loader.blocks[i].curRotate + "deg)"
     }
 }
let fun ='for (let i = 0; i < 4; i++) {\n loader.blocks[i].transition =+"s"\n loader.updBlockI(i)\n loader.blocks[i].width = Math.sqrt(Math.pow(avHeig / (1 / scaleK), 2) / 2);\n loader.blocks[i].height = Math.sqrt(Math.pow(avHeig / (1 / scaleK), 2) / 2);\n loader.updBlockI(i);loader.blocksNode[i].style.left = loader.positionsUpd[i].x - loader.blocks[i].width / 2 + "px";\n loader.blocksNode[i].style.top = loader.positionsUpd[i].y - loader.blocks[i].height / 2 + "px"\n document.body.style.transform = "rotate(360deg)"\n loader.blocksNode[i].style.transform = "rotate(" + loader.blocks[i].curRotate + "deg)"}'
let fun2 = 
'for(let i=0;i<loader.blocks.length;i++){\n loader.blocks[i].transition =trans+"s"\n loader.updBlockI(i)\n loader.blocks[i].curRotate += 45;\n loader.blocksNode[i].style.transform = "rotate(" + loader.blocks[i].curRotate + "deg)"\n }'
let funs = [fun,fun2,fun2]

function uploadEvents(){
    for(let i=0;i<eventsTimeList.lenght-1;i++){
        loader.timeOfEvents[i]= eventsTimeList[i];
        loader.duration+=eventsTimeList[i];
        loader.eventFuncs.push(new Function(funs[i]))
    }
    loader.timeOfEvents.lenght= eventsTimeList.lenght;
}
uploadEvents();
/*loader.eventFuncs.push(event_2)
loader.eventFuncs.push(event_3)*/
     log(loader)
     for(let i =0, curTime=0;i<loader.timeOfEvents.lenght-1;i++){
         setTimeout(loader.eventFuncs[i],loader.timeOfEvents[i]*1000+curTime)
         curTime+=loader.timeOfEvents[i]
     }
