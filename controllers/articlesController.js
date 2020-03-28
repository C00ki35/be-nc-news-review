const {
  fetchArticle,
  fetchPatchedArticle,
  postCommentToArticle,
  fetchComments,
  fetchAllArticlesWithComments,
  doesArticleExist,
  doesTopicExist,
  addArticle,
  deleteArticle
} = require("../models/articleModels");
const { fetchUser } = require("../models/userModels");

exports.postArticle = (req, res, next) => {
  const article = req.body;
  addArticle(article).then(addedArticle => {
    res.status(201).send({ article: addedArticle[0] });
  });
};

exports.delArticle = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticle(article_id).then(deleted => {
    res.sendStatus(204);
  });
};

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
  const promiseArray = [];
  promiseArray.push(fetchComments(article_id, sort_by, order));
  if (article_id) {
    promiseArray.push(doesArticleExist(article_id));
  }
  return Promise.all(promiseArray)
    .then(([response]) => {
      res.status(200).send({ comments: response });
    })
    .catch(err => {
      next(err);
    });
};

exports.getAllArticlesWithComments = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  const promiseArray = [];

  promiseArray.push(
    fetchAllArticlesWithComments(sort_by, order, author, topic)
  );
  if (author) {
    promiseArray.push(fetchUser(author));
  }
  if (topic) {
    promiseArray.push(doesTopicExist(topic));
  }
  return Promise.all(promiseArray)
    .then(([articles, author, topic]) => {
      res.status(200).send({ articles });
    })
    .catch(err => {
      next(err);
    });
};
