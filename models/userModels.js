const connection = require("../db/connection.js");

exports.fetchUser = user_id => {
  return connection
    .select("*")
    .from("users")
    .where("username", "=", user_id);
};
