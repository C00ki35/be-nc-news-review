const {
  patchVotesToComment,
  fetchDeleteComment
} = require("../models/commentsModels");

exports.getCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  patchVotesToComment(comment_id, inc_votes)
    .then(response => {
      res.status(200).send({ comment: response[0] });
    })
    .catch(err => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  fetchDeleteComment(comment_id)
    .then(response => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
};
