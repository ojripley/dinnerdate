
// .env vars
require('dotenv').config();

const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const crypto = require('crypto');
const db = require('./db/queries/queries.js');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const { Authenticator } = require('./authenticator');
const { ActiveUsers }  = require('./activeUsers');
const authenticator = new Authenticator();
const activeUsers = new ActiveUsers();

const selectMeal = require('./functions/selectMeal');

const key = process.env.ENCRYPTION_KEY; // secret

function encryptCookie(text, iv) {
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), id: encrypted.toString('hex') };
}

function decryptCookie(text) {
  console.log('text', text);
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.id, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  console.log(decrypted.toString());
  return decrypted.toString();
}

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});















io.on('connection', (client) => {
  console.log('new client');
  client.emit('msg', 'successful connection');

  // Checks cookie
  client.on('checkCookie', (cookie) => {

    let cookieString;
    
    if (cookie) {
      console.log('performing a cookie check');
      console.log(cookie);
      let matches = cookie.match(/(?<=sid=)[a-zA-Z0-9]*/);
      if (matches) {
        cookieString = matches[0];
      }

      let ivMatch = cookie.match(/(?<=iv=)[a-zA-Z0-9]*/);
      if (ivMatch) {
        ivString = ivMatch[0];
      }
    }

    if (cookieString && ivString) {
      try {
        let username = decryptCookie({ id: cookieString, iv: ivString });
        console.log('username', username);
        db.fetchUserByUsername(username)
          .then(res => {
            const user = { id: res[0].id, username: res[0].username }
            client.emit('cookieResponse', user);

            activeUsers.addUser(user, client);
            client.on('disconnect', () => {
              activeUsers.removeUser(user.id);
            });
            activeUsers.addUsersMeals(user, db);
          })
          .catch(error => {
            console.log(error);
          });
      } catch (error) {
        client.emit('cookieResponse', null);
      }
    } else {
      client.emit('cookieResponse', null);
    }
  });

  client.on('login', data => {
    authenticator.authenticate(data.username, data.password)
      .then(res => {
        if (res.id) {

          const iv = crypto.randomBytes(16);
          const encryptedCookie = encryptCookie(res.username, iv);

          activeUsers.addUser(res, client);
          client.on('disconnect', () => {
            activeUsers.removeUser(res.id);
          });
          activeUsers.addUsersMeals(res, db);

          client.emit('loginResponse', {
            user: res,
            sessionCookie: encryptedCookie
          });
        }
      });
  });

  client.on('register', data => {
    authenticator.register(data.username, data.password);
  });

  client.on('chooseMeal', (data) => {
    const selectedMeal = selectMeal(activeUsers[data.user.id].meals);
    client.emit('randomMeal', {meal: selectedMeal});
  });
  
  client.on('confirmMeal', data => {
    const date = new Date();
    db.insertPlannedMeal(data.user.id, data.meal.id, 'dinner', date);
    db.updateUsersMealsLastEaten(data.user.id, data.meal.id, date)
      .then(() => {
        activeUsers.addUsersMeals(data.user, db);
      });
  });

  client.on('addMeal', data => {
    console.log(data);
    db.fetchMealByName(data.mealName)
      .then(res => {
        console.log(res);
        if (res.length === 0) {
          console.log(res);
          db.insertMeal(data.mealName)
            .then(res => {
              console.log(res);
              db.insertUsersMeal(data.user.id, res[0].id)
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          const mealId = res[0].id;
          console.log(data);
          db.fetchUsersMealByIds(data.user.id, mealId)
          .then(res => {
            if(res.length === 0) {
              db.insertUsersMeal(data.user.id, mealId)
                .then(() => {
                  client.emit('mealAdded');
                })
                .catch(error => {
                  console.log(error);
                });
            } else {
              console.log('user already owns this meal');
            }
          })
          .catch(error => {
            console.log(error);
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
});
