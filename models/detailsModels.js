const connection = require("../db/connection.js");

//DEALS WITH LOGIN
exports.fetchUserDetails = (username, password) => {
  return connection
    .select("*")
    .from("users")
    .where("username", "=", username, "password", password)
    .then(person => {
      if (person.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Username does not exist."
        });
      } else {
        return person;
      }
    });
};

//THESE 3 DEAL WITH CREATING A NEW ACCOUNT
exports.postUser = (name, username, avatar_url, password) => {
  return connection("users")
    .select("*")
    .where("username", username)
    .returning("*")
    .then(result => {
      if (result.length !== 0) {
        return Promise.reject({
          status: 422,
          msg: "Sorry, username exists."
        });
      } else {
        return connection("users")
          .insert({
            name: name,
            username: username,
            avatar_url: avatar_url,
            password: password
          })
          .returning("*")
          .then(addedUser => {
            return addedUser;
          });
      }
    });
};
