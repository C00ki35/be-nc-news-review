const express = require("express");
const detailsRouter = express.Router();
const { error405 } = require("../errors");

const {
  getUserDetails,
  addNewUser
} = require("../controllers/detailsController");

detailsRouter
  .get("/", getUserDetails)
  .post("/user", addNewUser)
  .all(error405);

module.exports = detailsRouter;
