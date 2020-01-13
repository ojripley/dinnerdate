// const db = require('./db/queries/queries');
const bcrypt = require('bcrypt');

const users = [
  rips = {
    username: 'oj',
    password: 'p'
  },
  bean = {
    username: 'bean',
    password: 'p'
  }
];

class Authenticator {

  authenticate(username, password) {

    // temporary
    for (let user in users) {
      if (user.username === username && user.password === user.password) {
        return {
          id: 1,
          username: user.username
        }
      } else {
        return false;
      }
    }

    // for when a working db is set up
    
    // return db.fetchUserByUsername(username)
    //   .then(user => {
    //     if (user && user[0] && bcrypt.compareSync(password, user[0].password)) {
    //       return {
    //         id: user[0].id,
    //         username: user[0].username
    //       }
    //     } else if (user.length === 0) {
    //       return false;
    //     }
    //   });
  }

  register(username, password) {

    const hashedPassword = bcrypt.hashSync(password, 10);

    return db.insertUser(username, hashedPassword)
      .then(user => {
        return user;
      });
  }
}

module.exports = { Authenticator };
