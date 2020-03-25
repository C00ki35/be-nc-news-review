const connection = require("../db/connection.js");

exports.fetchUser = user_id => {
  return connection
    .select("*")
    .from("users")
    .where("username", "=", user_id)
    .then(person => {
      if (person.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Valid username but non existant."
        });
      } else {
        return person;
      }
    });
};

exports.addUserAccount = (name, username) => {
  const user = { name: name, username: username };
  return connection("users")
    .insert({ name: name, username: username })
    .returning("*");
};
