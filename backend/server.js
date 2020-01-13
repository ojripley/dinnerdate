const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const db = require('./db/queries/queries.js');

const authenticator = require('./authenticator');

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

io.on('connection', (client) => {
  console.log('new client');
  client.emit('msg', 'successful connection');

  client.on('login', data => {

  });
});
