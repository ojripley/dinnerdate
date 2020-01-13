
// .env vars
require('dotenv').config();

const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const db = require('./db/queries/queries.js');

const { Authenticator } = require('./authenticator');
const authenticator = new Authenticator();

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

io.on('connection', (client) => {
  console.log('new client');
  client.emit('msg', 'successful connection');
  db.fetchUserByUsername('rips')
    .then(res => {
      console.log(res);
    });

  client.on('login', data => {
    console.log('user login with:', data);
  });

  client.on('register', data => {
    authenticator.register(data.username, data.password);
  });
});
