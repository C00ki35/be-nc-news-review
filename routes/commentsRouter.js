const express = require("express");
const commentsRouter = express.Router();
const { error405 } = require("../errors");
const {
  getCommentVotes,
  deleteComment
} = require("../controllers/commentsController.js");

commentsRouter
  .route("/:comment_id")
  .patch(getCommentVotes)
  .delete(deleteComment)
  .all(error405);

module.exports = commentsRouter;
