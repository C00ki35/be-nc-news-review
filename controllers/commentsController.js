const {
  patchVotesToComment,
  fetchDeleteComment
} = require("../models/commentsModels");

exports.getCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { votes } = req.body;
  patchVotesToComment(comment_id, votes)
    .then(response => {
      if (votes === undefined) {
        res
          .status(400)
          .send({ msg: "Status 400: Bad request - Invalid data type" });
      } else {
        res.status(201).send({ comment: response[0] });
      }
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
