
var express = require('express');
var socket = require('socket.io');
var app = express();
var players = [];
var playerCount = 0;

var playersGame = [];

app.use(express.static('public'));

const port = process.env.PORT || 3000;

var server = app.listen(port, function(){
    console.log("Listening to port 3000");
});

app.get("/", (req, res)=>{
    res.render('/index.html');
});

var io = socket(server);

io.on('connection', function(socket){
    console.log(`Made socket connection with ${socket.id}`);
    if(players.length<4){
        players.push(socket.id);
        io.sockets.emit('player', {playerIndex: players.length-1});
    }else{
        console.log("no you");
    }
    socket.on('ready', function(){
        if(playerCount == 3){
            socket.emit("userType", {'type': "pacmon"});
            io.sockets.emit('startGame');
            console.log('this was pacman');
        }else{
            playerCount++;
            socket.emit('userType', {'type': 'ghost'})
        }
        
        
    });
    
    socket.on('position', function(data){
        socket.broadcast.emit('postThis', data);
        
    });
    socket.on('positionPacmon', function(data){
        socket.broadcast.emit('postThisPacmon', data);
    });
    socket.on('gameover', function(data){
	players = [];
	playerCount = 0;

        io.sockets.emit('gameDone', {statement: `${data.winner} won!`});
    });
	socket.on('removeDot',function(data){
		socket.broadcast.emit("rmvDot", data);
	});
    
});
