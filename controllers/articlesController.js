const {
  fetchArticle,
  fetchPatchedArticle
} = require("../models/articleModels");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(article => {
      if (article[0] === undefined) {
        res
          .status(404)
          .send({ msg: "Status:404 - Valid path but resource does not exist" });
      } else {
        res.status(200).send({ article: article[0] });
      }
    })
    .catch(next);
};

exports.getArticleToPatch = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (inc_votes === undefined) {
    res.status(400).send({ msg: "Status 400: Bad request" });
  }
  fetchPatchedArticle(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};
