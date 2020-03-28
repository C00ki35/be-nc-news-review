const { fetchUser } = require("../models/userModels");

//THIS DEALS WITH API REQUEST FOR USERNAME
exports.getUser = (req, res, next) => {
  const { user_id } = req.params;
  fetchUser(user_id)
    .then(user => {
      const { username, avatar_url, name } = user[0];
      res.status(200).send({ user: { username, avatar_url, name } });
    })
    .catch(err => {
      next(err);
    });
};

exports.addUser = (req, res, next) => {
  const { name, username, password } = req.body;
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
