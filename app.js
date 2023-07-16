var express = require('express');
const moment = require('moment');
var http = require('http');

var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);  
var path = require('path');

app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

var name;

io.on('connection', (socket) => {
  console.log('New User Connected');
  
  socket.on('joining msg', (username) => {
  	name = username;
  	io.emit('chat message', `--${name} joined the chat`);
  });
  
  socket.on('disconnect', () => {
    console.log('User Disconnected');
    io.emit('chat message', `--${name} left the chat`);
    
  });
  socket.on('chat message', (msg) => {
    let time = moment().format("hh:mm a");
    socket.broadcast.emit('chat message',msg,time);
  });
});

server.listen(3412, () => {
  console.log('Server listening on :3412');
});