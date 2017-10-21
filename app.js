var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res) {
  fs.readFile('./index.html', 'utf-8', function(error, content) {
    res.writeHead(200, {"Content-type": "text/html"});
    res.end(content);
  });
});

var io = require("socket.io").listen(server);

io.sockets.on('connection', function(socket, pseudo) {

  //eventHandler lors de la réception d'un nouveau pseudo
  socket.on('nouveau', function(pseudo){
    if(pseudo != "") {
      //attribue le pseudo si l'utilisateur a saisi quelque chose dans le prompt
      socket.pseudo = pseudo;
    }else {
      //Attribue un pseudo aléatoire et l'emet
      socket.pseudo = "Anon" + Math.floor(Math.random()*100000000);
      socket.emit('anonUser', socket.pseudo);
    }

    //prévient les autres utilisateurs de l'arrivée d'un nouveau participant
    socket.broadcast.emit('broadcast', [socket.pseudo + ' a rejoint le chat!']);
  });

  //retransmet les messages reçus aux autres clients
  socket.on('newMessage', function(pseudo, message) {
    socket.broadcast.emit('messageBroadcast', pseudo, message);
  });
});

server.listen(8081);
