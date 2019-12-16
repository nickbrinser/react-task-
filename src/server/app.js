var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var randomNumber = require('./randomNumber');

var port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '../../build')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + './index.html');
});

io.on('connection', function (socket) {
  console.log('connect');

  var unsubscribe = randomNumber.subscribe(function (number) {
    console.log(number);

    var data = {
      value: number,
      timestamp: Number(new Date()),
    };

    socket.emit('data', data);
  });

  socket.on('disconnect', function () {
    console.log('disconnect')
    unsubscribe();
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});
