const {
  fetchArticle,
  fetchPatchedArticle,
  postCommentToArticle,
  fetchComments,
  fetchAllArticlesWithComments
} = require("../models/articleModels");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticle(article_id)
    .then(article => {
      if (article[0] === undefined) {
        res.status(404).send({
          msg: "Status:404 - Valid path but resource does not exist."
        });
      } else {
        res.status(200).send({ article: article[0] });
      }
    })
    .catch(err => {
      next(err);
    });
};

exports.getArticleToPatch = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  fetchPatchedArticle(article_id, inc_votes)
    .then(article => {
      if (inc_votes === undefined) {
        res.status(200).send({ article: article[0] });
      } else {
        res.status(200).send({ article: article[0] });
      }
    })
    .catch(next);
};

exports.getArticleToCommentOn = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  postCommentToArticle(article_id, username, body)
    .then(addedComments => {
      res.status(201).send({ comment: addedComments[0] });
    })
    .catch(err => {
      next(err);
    });
};

exports.getAllCommentsOnArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  fetchComments(article_id, sort_by, order)
    .then(response => {
      res.status(200).send({ comments: response });
    })
    .catch(err => {
      next(err);
    });
};

exports.getAllArticlesWithComments = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  fetchAllArticlesWithComments(sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
