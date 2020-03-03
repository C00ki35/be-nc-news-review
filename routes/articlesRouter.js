const express = require("express");
const articlesRouter = express.Router();
const { error405 } = require("../errors");

const {
  getArticle,
  getArticleToPatch
} = require("../controllers/articlesController");

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(getArticleToPatch)
  .all(error405);

module.exports = articlesRouter;
