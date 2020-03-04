const express = require("express");
const commentsRouter = express.Router();
const { error405 } = require("../errors");
const {
  getCommentVotes,
  deleteComment
} = require("../controllers/commentsController.js");

commentsRouter.patch("/:comment_id", getCommentVotes);
commentsRouter.delete("/:comment_id", deleteComment).all(error405);

module.exports = commentsRouter;
