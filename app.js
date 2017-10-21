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

  socket.on('nouveau', function(pseudo){
    socket.pseudo = pseudo;
    socket.broadcast.emit('broadcast', [socket.pseudo + ' a rejoint le chat!']);
  });

  socket.on('newMessage', function(pseudo, message) {
    socket.broadcast.emit('messageBroadcast', pseudo, message);
  });
});

server.listen(8081);
