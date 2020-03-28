const { fetchUserDetails, postUser } = require("../models/detailsModels");

exports.getUserDetails = (req, res, next) => {
  const { username, password } = req.body;
  fetchUserDetails(username, password)
    .then(user => {
      const { username } = user[0];
      res.status(200).send({ user: { username } });
    })
    .catch(err => {
      next(err);
    });
};

exports.addNewUser = (req, res, next) => {
  const { name, username, avatar_url, password } = req.body;
  postUser(name, username, avatar_url, password)
    .then(user => {
      const { username, avatar_url } = user[0];
      res.status(201).send({ user: { username, avatar_url } });
    })
    .catch(err => {
      next(err);
    });
};
