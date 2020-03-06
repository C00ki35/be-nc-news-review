const express = require("express");
const usersRouter = express.Router();
const { getUser } = require("../controllers/usersController.js");
const { error405 } = require("../errors.js");

usersRouter
  .route("/:user_id")
  .get(getUser)
  .all(error405);

module.exports = usersRouter;
