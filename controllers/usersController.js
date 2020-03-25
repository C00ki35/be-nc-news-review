const { fetchUser, addUserAccount } = require("../models/userModels");

exports.getUser = (req, res, next) => {
  const { user_id } = req.params;
  fetchUser(user_id)
    .then(user => {
      res.status(200).send({ user: user[0] });
    })
    .catch(err => {
      next(err);
    });
};

exports.addUser = (req, res, next) => {
  const { name, username } = req.body;

  addUserAccount(name, username)
    .then(user => {
      res.status(201).send(user[0]);
    })
    .catch(err => {
      next(err);
    });
};
