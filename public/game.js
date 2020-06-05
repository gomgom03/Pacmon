var socket = io.connect();
var pacmon;
socket.on('postThis', function(data){
    ctx = myGameArea.context;
    ctx.fillStyle = "white";
    ctx.fillRect(data.x, data.y, 30, 30);
    
});
socket.on('rmvDot',function(data){
	smallDots.splice(data.index,1);
});
socket.on('gameDone',function(data){
	window.location.href = "/";
	alert(data.statement);
});
socket.on('postThisPacmon', function(data){
    ctx = myGameArea.context;
	if(data.eating){
ctx.fillStyle = "red";
}else{
    ctx.fillStyle = "yellow";}
    ctx.fillRect(data.x, data.y, 30, 30);
    pacmon.x = data.x;
    pacmon.y = data.y;
    pacmon.width = 30; 
    pacmon.height= 30;
    pacmon.eating = data.eating;//make this
});


/*
Eddie Kim, Colin Li, Jordan Bucher
3/9/19-3/10/19
Hackridge Hackathon
Pacmon - Multiplayer Pacman Game
*/

//var socket = io.connect("http://localhost:3000");
/*
socket.on('postThis', function(data){
    ctx = myGameArea.context;
    ctx.fillStyle = "red";
    ctx.fillRect(data.x, data.y, 30, 30);

});
*/
var isGhost;
var originalSpeed = 0;

var wall1, wall2, wall3, wall4, wall5, wall6, wall7, wall8, wall9, wall10, wall11, wall12, wall13, wall14, wall15, wall16;
var myGamePiece;
var currentFunc = moveRight;
var screenWidth;
var screenHeight;
var currentx; 
var currenty; 
var speed = 2;
var wallTouching = false;
var walls = [];
var bigDots = [];
var smallDots = [];
var ghostyKillMode = false;
var dotCount = 0;
var timer = 0;
var dead = false;
socket.on("smallDotPlacement", function(data){
		smallDots.push(new component(screenWidth/100, screenWidth/100, "pink", data.x, data.y));
});
socket.on("userType", function(data){
    if(data.type == "ghost"){
        isGhost = true;
        console.log('hello there');
    }
    else{
        isGhost = false;
    }
});

function moveLeft(){
  for (let i = 0; i < walls.length; i++) {
    if(isTouchingLeftWall(i))
      return;
  }
  currentx -= speed;
}
function moveRight(){
  for (let i = 0; i < walls.length; i++) {
    if(isTouchingRightWall(i))
      return;
  }
    currentx+=speed;
}
function moveUp(){
  for (let i = 0; i < walls.length; i++) {
    if(isTouchingTopWall(i))
      return;
  }
    currenty+=speed;
}
function moveDown(){
  for (let i = 0; i < walls.length; i++) {
    if(isTouchingBotWall(i))
      return;
  }
    currenty-=speed;
}


window.addEventListener('keydown', function(event){
    switch(event.keyCode){
        case 37:
        currentFunc = moveLeft;
        break;
        case 39:
        currentFunc = moveRight;
        break;
        case 40:
        currentFunc = moveUp;
        break;
        case 38:
        currentFunc = moveDown;
        break;
    }
});

function startGame() {
    myGameArea.start();
    if(isGhost){
        currentx-=100;

        currenty-=100;
        originalSpeed = 2;
        myGamePiece = new component(screenWidth/40, screenWidth/40, "white", currentx, currenty, true);
    }else{
        myGamePiece = new component(screenWidth/40, screenWidth/40, "yellow", currentx, currenty, true);
        originalSpeed = 2.3;
    }
    
    base = myGameArea.canvas.height - myGamePiece.height-100;

    walls.push(new component(screenWidth / 30, (screenHeight / 5) * 2, "blue", screenWidth / 12, 0, false));
    walls.push(new component(screenWidth / 30, (screenHeight /5) * 2, "blue", screenWidth / 12, (screenHeight / 5) * 3, false));
    walls.push(new component(screenWidth / 1.3, screenHeight / 30, "blue", screenWidth / 12, 0, false));
    walls.push(new component(screenWidth / 1.3, screenHeight / 30, "blue", screenWidth / 12, screenHeight - screenHeight / 30, false));
    walls.push(new component(screenWidth / 30, (screenHeight / 5) * 2, "blue", screenWidth / 12 + screenWidth / 1.3, 0, false));
    walls.push(new component(screenWidth / 30, (screenHeight /5) * 2, "blue", screenWidth / 12 + screenWidth / 1.3, (screenHeight / 5) * 3, false));
    walls.push(new component(screenWidth / 6, screenHeight / 6, "blue", screenWidth / 6, screenHeight / 8, false));
    walls.push(new component(screenWidth / 6, screenHeight / 6, "blue", (screenWidth / 6) * 3.8, screenHeight / 8, false));
    walls.push(new component(screenWidth / 6, screenHeight / 6, "blue", (screenWidth / 6), screenHeight / 1.4, false));
    walls.push(new component(screenWidth / 6, screenHeight / 6, "blue", (screenWidth / 6) * 3.8, screenHeight / 1.4, false));
    walls.push(new component(screenWidth / 6, screenHeight / 6, "blue", screenWidth / 2.5, screenHeight / 2.4, false));
    walls.push(new component(screenWidth / 30, screenHeight / 4, "blue", screenWidth / 2.15, 0, false));
    walls.push(new component(screenWidth / 30, screenHeight / 4, "blue", screenWidth / 2.15, screenHeight - screenHeight / 4, false));
    walls.push(new component(screenWidth / 6, (screenHeight / 30) * 16 / 9, "blue", screenWidth / 6, screenHeight / 2.12, false));
    walls.push(new component(screenWidth / 6, (screenHeight / 30) * 16 / 9, "blue", screenWidth / 6 * 3.8,screenHeight / 2.12, false));
    walls.push(new component(screenWidth / 8.57, screenHeight / 30, "blue", 0, (screenHeight /50) * 19, false));
    walls.push(new component(screenWidth / 8.57, screenHeight / 30, "blue", 0, (screenHeight /50) * 30, false));
    walls.push(new component(screenWidth / 6, screenHeight / 30, "blue", (screenWidth / 1.173), (screenHeight /50) * 19, false));
    walls.push(new component(screenWidth / 6, screenHeight / 30, "blue", (screenWidth / 1.173), (screenHeight /50) * 30, false));

      bigDots.push(new component(screenWidth / 70, screenWidth / 70, "red", screenWidth / 7.5, screenHeight / 15, false));
      bigDots.push(new component(screenWidth / 70, screenWidth / 70, "red", screenWidth / 1.22, screenHeight / 15, false));
      bigDots.push(new component(screenWidth / 70, screenWidth / 70, "red", screenWidth / 7.5, screenHeight / 1.1, false));
      bigDots.push(new component(screenWidth / 70, screenWidth / 70, "red", screenWidth / 1.22, screenHeight / 1.1, false));
	if(!isGhost){	
      while(dotCount < 50) {
        let xValue = getRandomFloat(walls[0].x + walls[0].width, walls[4].x);
	let yValue = Math.random()*(screenHeight-walls[2].height-walls[3].height)
	 smallDots.push(new component(screenWidth / 100, screenWidth / 100, "pink", xValue,yValue, false));        
         
	if(!isDotTouchingWall(dotCount)){
            dotCount++;
		socket.emit("smallDotPlacement", {x:xValue,y:yValue});
        } else {
            smallDots.splice(dotCount, 1);
        }
      }}
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.height = 576;
        this.canvas.width = 1024;
    screenWidth = this.canvas.width;
    screenHeight = this.canvas.height;
    currentx = (screenWidth / 8) * 3.77;
    currenty = (screenHeight / 4) * 2.5;
    this.canvas.style.backgroundColor  = "black";
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 15);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
}

function component(width, height, color, x, y, main) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, this.width, this.height);
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        main?ctx.fillRect(currentx, currenty, this.width, this.height):ctx.fillRect(x,y, this.width, this.height);
    }
    this.updateC = function(c){
        ctx = myGameArea.context;
        ctx.fillStyle = c;
        main?ctx.fillRect(currentx, currenty, this.width, this.height):ctx.fillRect(x,y, this.width, this.height);
    }
}

function updateGameArea() {
    currentFunc();
    currentx <-10? currentx = window.innerWidth +10:null;
    currentx > window.innerWidth+10? currentx = -10:null;
    currenty <-10? currenty = window.innerHeight +10:null;
    currenty>window.innerHeight +10? currenty = -10: null;
    //socket.emit('position', {x: currentx, y: currenty});
    myGameArea.clear();
    
    for (let i = 0; i < walls.length; i++) {
      walls[i].update();
    }

    for(let i = 0; i < bigDots.length; i++) {
        bigDots[i].update();
    }

    for(let i = 0; i < smallDots.length; i++) {
        smallDots[i].update();
    }

    if (isTouchingWall()) {
        wallTouching = true;
    } else {
        wallTouching = false;
    }
    //these two are for pacmon
    if(!isGhost){
        if(pacmon.isTouchingBigDots()){
            ghostyKillMode = true;
    
        } 
        if(pacmon.isTouchingSmallDot()){
            dotCount--;
        }
        if(dotCount == 0){
            socket.emit("gameover", {'winner': 'pacmon'});
        }
        if(ghostyKillMode){
            myGamePiece.color = 'red';
            timer--;
            myGamePiece.updateC(myGamePiece.color);
            if(timer == 0){
                ghostyKillMode = false;
                myGamePiece.color = 'yellow';
            }
        } else {
            myGamePiece.update();
        }
    }else{
        if(!dead){
            if(ghost.isTouchingPacmon()&&!pacmon.eating){
                socket.emit('gameover', {'winner': 'ghost'});
            }
            if(ghost.isTouchingPacmon()&&pacmon.eating){
                myGamePiece.updateC = "black";
                dead = true;
            }
            myGamePiece.update();

        }else{
            myGamePiece.updateC = "black";
        }
        
    }
    if(isGhost){;
        socket.emit('position', {x: currentx, y: currenty});
    }else{
        socket.emit('positionPacmon', {x:currentx, y:currenty, eating: ghostyKillMode});
    }
    
}


 function isTouchingWall() {
    for (let i = 0; i < walls.length; i++) {
      if(isTouchingLeftWall(i)){
        return true;
      }
      if(isTouchingRightWall(i)){
        return true;
      }
      if(isTouchingTopWall(i)){
        return true;
      }
      if(isTouchingBotWall(i)){
        return true;
      }
    }
    return false;
 }

 function isTouchingLeftWall(wall) {
    const leftWall = walls[wall];
    const { x, y, width, height } = leftWall;
    const isTouching = (currentx > x && currentx <= width+x + 2 && ((currenty > y && currenty < height+y) || (currenty+screenWidth/40 > y && currenty+screenWidth/40 < height+y)));

    if (isTouching && (currentFunc.name == 'moveLeft')) {
        speed = 0;
        return true;
    } else {
        speed = originalSpeed;
        return false;
    }
 }

 function isTouchingRightWall(wall) {
    const rightWall = walls[wall];
    const { x, y, width, height } = rightWall;

    const isTouching = currentx - 3 < x && currentx > x-(screenWidth/40) && ((currenty > y && currenty < height+y) || (currenty+screenWidth/40 > y && currenty+screenWidth/40 < height+y));

    if (isTouching && (currentFunc.name == 'moveRight')) {
        speed = 0;
        return true;
    } else {
        speed = originalSpeed;
        return false;
    }
 }

 function isTouchingTopWall(wall) {
   const rightWall = walls[wall];
   const { x, y, width, height } = rightWall;

   const isTouching = (currenty <= y) && (currenty > y-screenWidth/38) && (((currentx > x) && (currentx < x+width)) || ((currentx +(screenWidth/50)+.25 > x) && (currentx /*+ (screenWidth/40) -2*/ < x+width)));

   if (isTouching && (currentFunc.name == 'moveUp')) {
       speed = 0;
       return true;
   } else {
       speed = originalSpeed;
       return false;
   }
 }

 function isTouchingBotWall(wall) {
   const rightWall = walls[wall];
   const { x, y, width, height } = rightWall;

   const isTouching = (currenty > y) && (currenty <= y+height + 2) && (((currentx > x) && (currentx < x+width)) || ((currentx+(screenWidth/40)-2 > x) && (currentx+(screenWidth/40)+2 < x+width)));

   if (isTouching && (currentFunc.name == 'moveDown')) {
       speed = 0;
       return true;
   } else {
       speed = originalSpeed;
       return false;
   }
 }

 function isDotTouchingWall(dot){
    const dotz = smallDots[dot]

    const { x, y, width, height } = dotz;
    
    let isTouching;

    for (let i = 0; i < walls.length; i++){
        const wallz = walls[i];
        isTouching = (x > wallz.x-width && x < wallz.x + wallz.width && y > wallz.y - height && y <= wallz.y + wallz.height);
        if(isTouching){
            return isTouching;
        }
    }
    return isTouching;
    
 }

 function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

var pacmon = {

    isTouchingBigDots: function(){
        if(pacmon.touchingTopLeftDot() && bigDots[0].color != "black"){
           bigDots[0].color = new component(bigDots[0].width, bigDots[0].height, "black", bigDots[0].x, bigDots[0].y);
           myGamePiece.color = 'red';
           timer += 500;
            return true;
        }
        if(pacmon.touchingTopRightDot()&&bigDots[1].color != "black"){
           bigDots[1] = new component(bigDots[1].width, bigDots[1].height, "black", bigDots[1].x, bigDots[1].y);
           timer += 500;
           myGamePiece.color = 'red';
            return true;
        }
        if(pacmon.touchingBottomLeftDot() && bigDots[2].color != "black"){
           bigDots[2] = new component(bigDots[2].width, bigDots[2].height, "black", bigDots[2].x, bigDots[2].y);
           timer += 500;
            return true;
        }
        if(pacmon.touchingBottomRightDot() && bigDots[3].color != "black"){
           bigDots[3] = new component(bigDots[3].width, bigDots[3].height, "black", bigDots[3].x, bigDots[3].y);
           timer += 500;
           myGamePiece.color = 'red';
            return true;
        }
    },

  isTouchingSmallDot: function(){

    for(let i = 0; i < smallDots.length; i++){
        if(Math.sqrt(Math.pow((currentx + ((screenWidth/40) / 2))  - (smallDots[i].x + (smallDots[i].width / 2)), 2) + Math.pow((currenty + (screenWidth/40) / 2) - (smallDots[i].y + (smallDots[i].height / 2)), 2)) < (13 + smallDots[i].height)) {
            smallDots.splice(i, 1);
            socket.emit("removeDot",{index:i});
	return true;
        }
    }
    return false;
},
  touchingTopLeftDot: function(){
        const topLeftDot = bigDots[0];
        const {x, y, width, height } = topLeftDot;
        const isTouching = (((currentx > x && currentx <= width+x + 2) || currentx <= x) && ((currenty > y && currenty < height+y) || (currenty+screenWidth/40 > y && currenty+screenWidth/40 < height+y)));
        if (isTouching){
            return true;
        } else {
            return false;
        }
    },
    touchingTopRightDot: function(){
        const topRightDot = bigDots[1];
        const {x, y, width, height } = topRightDot;
        const isTouching = (((currentx < x && currentx >= x -screenWidth/40 - 1) || currentx >= x) && ((currenty > y && currenty < height+y) || (currenty+screenWidth/40 > y && currenty+screenWidth/40 < height+y)));
        if (isTouching){
            return true;
        } else {
            return false;
        }
    },
    touchingBottomLeftDot: function(){
        const bottomLeftDot = bigDots[2];
        const {x, y, width, height } = bottomLeftDot;
        const isTouching = (((currentx > x && currentx <= width+x + 2) || currentx <= x) && ((currenty <= y && currenty > y - screenWidth/40 - 2 || (currenty+screenWidth/40 > y && (currenty+screenWidth/40 < height+y)) || currenty >= y)));
        if (isTouching){
            return true;
        } else {
            return false;
        }
    },
    touchingBottomRightDot: function(){
        const bottomRightDot = bigDots[3];
        const {x, y, width, height } = bottomRightDot;
         const isTouching = (((currentx < x && currentx >= x -screenWidth/40 - 1) || currentx >= x) && ((currenty <= y && currenty > y - screenWidth/40 - 2 || (currenty+screenWidth/40 > y && (currenty+screenWidth/40 < height+y)) || currenty >= y)));
        if (isTouching){
            return true;
        } else {
            return false;
        }
    }
}
var ghost = {
    isTouchingPacmon : function(){
        const {x, y, width, height } = pacmon;
        const isTouching = (((currentx > x-width && currentx < x) && ((currenty > y-height && currenty < y))));
        return isTouching;
    }
}






socket.emit("ready", {});
socket.on('startGame', function(){
    startGame();
});
/*

socket.on('postThis', function(data){
    ctx = myGameArea.context;
    ctx.fillStyle = "red";
    ctx.fillRect(data.x, data.y, 30, 30);
    
});

socket.on('moveStuff', function(data){
    updateGameArea();
});

var myGamePiece;
var currentFunc = moveLeft;
var currentx = 500;
var currenty = 500;

function moveLeft(){
    currentx-=1;
}
function moveRight(){
    currentx +=1;
}
function moveUp(){
    currenty +=1;
}
function moveDown(){
    currenty-=1;
}


window.addEventListener('keydown', function(event){
    console.log(event.keyCode)
    switch(event.keyCode){
        case 37:
        currentFunc = moveLeft;
        break;
        case 39:
        currentFunc = moveRight;
        break; 
        case 40:
        currentFunc = moveUp;
        break;
        case 38: 
        currentFunc = moveDown;
        break;
    }
});

function startGame() {
    myGameArea.start();
    myGamePiece = new component(30, 30, "yellow", currentx, currenty);
    base = myGameArea.canvas.height - myGamePiece.height-100;
    

    console.log(base);
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.backgroundColor  = "black";
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        //this.interval = setInterval(updateGameArea, 2);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y; 
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, this.width, this.height);
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(currentx, currenty, this.width, this.height);
    }
}

function updateGameArea() {
    currentFunc();
    currentx <-10? currentx = window.innerWidth +10:null;
    currentx > window.innerWidth+10? currentx = -10:null;
    currenty <-10? currenty = window.innerHeight +10:null;
    currenty>window.innerHeight +10? currenty = -10: null;
    socket.emit('position', {x: currentx, y: currenty});
    myGameArea.clear();
    myGamePiece.update();
    
}

alert('Close if you are ready');
socket.emit("ready", {});
socket.on('startGame', function(){
    startGame();
});
(/)
*/
