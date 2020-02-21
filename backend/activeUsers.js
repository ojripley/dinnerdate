class ActiveUsers {
  // users will be added by the server as keys

  // -- -- -- -- -- -- //
  // methods           //
  // -- -- -- -- -- -- //

  addUser(user, client) {
    console.log('adding ', user);
    this[user.id] = { id: user.id, username: user.username, socket: client };
  }

  removeUser(id) {
    delete this[id];
  }

  addUsersMeals(user, db) {
    db.fetchMealsByUserId(user.id)
      .then(res => {
        this[user.id].meals = res;
      })
      .catch(error => {
        console.error(error);
      });
  }
};

module.exports = { ActiveUsers };