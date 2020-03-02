const express = require("express");
const topicsRouter = express.Router();
const { getAllTopics } = require("../controllers/topicController.js");
const { error405 } = require("../errors.js");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .all(error405);

module.exports = topicsRouter;
