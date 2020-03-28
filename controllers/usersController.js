const {
  fetchUser,
  addUserAccount,
  doesUsernameExist
} = require("../models/userModels");

exports.getUser = (req, res, next) => {
  const { user_id } = req.params;
  fetchUser(user_id)
    .then(user => {
      const { username, avatar_url, name } = user[0];
      res.status(200).send({ user: { username, avatar_url, name } });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

exports.addUser = (req, res, next) => {
  const { name, username, password } = req.body;
  console.log("GETTNG HERE");
  return Promise.all([
    addUserAccount(name, username, password),
    doesUsernameExist(username)
  ])
    .then(([user, exists]) => {
      res.status(201).send(user[0]);
    })
    .catch(err => {
      next(err);
    });
};
