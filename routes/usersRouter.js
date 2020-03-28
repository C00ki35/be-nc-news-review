const express = require("express");
const usersRouter = express.Router();
const {
  getUser,
  addUser,
  loginUser
} = require("../controllers/usersController.js");
const { error405 } = require("../errors.js");

usersRouter
  .post("/", addUser)
  .get("/:user_id", getUser)

  .all(error405);

module.exports = usersRouter;
