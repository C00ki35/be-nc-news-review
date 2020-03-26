const express = require("express");
const articlesRouter = express.Router();
const { error405 } = require("../errors");

const {
  getArticle,
  getArticleToPatch,
  getArticleToCommentOn,
  getAllCommentsOnArticle,
  getAllArticlesWithComments,
  postArticle,
  delArticle
} = require("../controllers/articlesController");

articlesRouter
  .post("/", postArticle)
  .delete("/:article_id", delArticle)
  .get("/:article_id", getArticle)
  .patch("/:article_id", getArticleToPatch)
  .all(error405);

articlesRouter
  .route("/:article_id/comments")
  .post(getArticleToCommentOn)
  .get(getAllCommentsOnArticle)
  .all(error405);

articlesRouter
  .route("/")
  .get(getAllArticlesWithComments)
  .all(error405);

module.exports = articlesRouter;
