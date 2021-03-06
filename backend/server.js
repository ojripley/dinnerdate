
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
const getTodaysDate = require('./functions/getTodaysDate');

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


  // USER LOGS IN
  // Checks cookie
  client.on('checkCookie', (cookie) => {

    let cookieString;
    
    if (cookie) {
      console.log('performing a cookie check');
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
      console.log('evalutating cookie');
      try {
        let username = decryptCookie({ id: cookieString, iv: ivString });
        console.log('username', username);
        db.fetchUserByUsername(username)
          .then(res => {
            const user = { id: res[0].id, username: res[0].username }
            db.fetchMealsByUserId(user.id)
              .then(res => {
                const meals = res;
                db.fetchTodaysMeal(user.id)
                  .then(res => {
                    let todaysMeal;
                    if (res[0]) {
                      todaysMeal = res[0];
                    } else {
                      todaysMeal = null;
                    }

                    console.log('todays meal', todaysMeal);

                    db.fetchHistoryByUserId(user.id)
                      .then(res => {

                        const mealHistory = res;

                        console.log(mealHistory);

                        const iv = crypto.randomBytes(16);
                        const encryptedCookie = encryptCookie(user.username, iv);

                        client.emit('cookieResponse', {
                          user: user,
                          sessionCookie: encryptedCookie,
                          user: user,
                          meals: meals,
                          todaysMeal: todaysMeal,
                          mealHistory: mealHistory
                        });
                      })
                      .catch(error => {
                        console.log(error);
                      });
                  })
                  .catch(error => {
                    console.log(error);
                  });
                activeUsers.addUser(user, client);
                client.on('disconnect', () => {
                  activeUsers.removeUser(user.id);
                });
                activeUsers.addUsersMeals(user, db);
              })
              .catch(error => {
                console.log(error);
                client.emit('cookieResponse', null);
              });
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

          const user = res

          db.fetchMealsByUserId(user.id)
            .then(res => {
              const meals = res;
              db.fetchTodaysMeal(user.id)
                .then((res) => {
                  let todaysMeal;
                  if (res[0]) {
                    todaysMeal = res[0];
                  } else {
                    todaysMeal = null;
                  }

                  db.fetchHistoryByUserId(user.id)
                    .then(res => {

                      const mealHistory = res;

                      const iv = crypto.randomBytes(16);
                      const encryptedCookie = encryptCookie(user.username, iv);
    
                      client.emit('loginResponse', { 
                        user: user,
                        sessionCookie: encryptedCookie,
                        user: user, 
                        meals: meals, 
                        todaysMeal: todaysMeal,
                        mealHistory: mealHistory
                      });
                    })
                    .catch(error => {
                      console.log(error);
                    });
                })
                .catch(error => {
                });
              activeUsers.addUser(user, client);
              client.on('disconnect', () => {
                activeUsers.removeUser(user.id);
              });
              activeUsers.addUsersMeals(user, db);
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
  });

  client.on('register', data => {
    authenticator.register(data.username, data.password);
  });







  // CLIENT SELECTS A RANDOM MEAL

  client.on('chooseMeal', (data) => {
    console.log('choosing meal for ', data.user);
    console.log(activeUsers[data.user.id]);

    db.fetchMealsByUserId(data.user.id)
      .then(res => {
        const meals = res;
        const selectedMeal = selectMeal(meals);
        client.emit('randomMeal', {meal: selectedMeal});
      })
      .catch(error => {
        console.log(error);
      });
  });
  

  // CLIENT CONFIRMS MEAL
  client.on('confirmMeal', data => {
    console.log('confirming meal', data);
    if (data.updated === false) {
      console.log('new planned meal');
      db.insertPlannedMeal(data.user.id, data.meal.id)
        .then(() => {
          client.emit('setPlannedMeal', data.meal);
        })
        .catch(error => {
          console.log(error);
        })
        db.updateUsersMealsLastEaten(data.user.id, data.meal.id, getTodaysDate())
        .then(() => {
          activeUsers.addUsersMeals(data.user, db);
        });
      } else {
        console.log('update planned meal');
        // query to update planned meal
        db.updatePlannedMeal(data.user.id, data.meal.id)
        .then(() => {
          console.log('sending set planned meal');
          client.emit('setPlannedMeal', data.meal);
        })
        .catch(error => {
          console.log(error);
        })
        db.updateUsersMealsLastEaten(data.user.id, data.meal.id, getTodaysDate())
        .then(() => {
          console.log('last eaten should be updated...');

          // revert last_eaten property of changed meal to previous
          db.fetchPlannedMealByIds(data.user.id, data.meal.id)
            .then(res => {
  
              let previousDate = null;
  
              if(res.length > 0) {
                previousDate = res[0].date;
              }
  
              db.updateUsersMealsLastEaten(data.user.id, data.meal.id, previousDate);
            });
        })
        .catch(error => {
          console.log(error);
        });

    }
  });

  client.on('addMeal', data => {
    console.log(data);
    db.fetchMealByName(data.mealName)
      .then(res => {
        console.log(res);
        if (res.length === 0) { // meal doesn't exist yet
          console.log(res);
          db.insertMeal(data.mealName)
            .then(res => {
              console.log(res);
              db.insertUsersMeal(data.user.id, res[0].id)
                .then(() => {
                  db.fetchMealsByUserId(data.user.id)
                    .then(res => {
                      console.log('meal added event');
                      activeUsers[data.user.id].meals = res;
                      client.emit('mealAdded', { meals: activeUsers[data.user.id].meals });
                    })
                })
                .catch(error => {
                  console.log(error);
                });
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
                  db.fetchMealsByUserId(data.user.id)
                    .then(res => {
                      console.log('meal added event');
                      activeUsers[data.user.id].meals = res;
                      client.emit('mealAdded', { meals: activeUsers[data.user.id].meals });
                    })
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
