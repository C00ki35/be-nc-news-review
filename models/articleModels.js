const connection = require("../db/connection.js");

exports.fetchArticle = article_id => {
  return connection
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.body",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .count("comments.comment_id AS comment_count")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .where("articles.article_id", "=", article_id)
    .groupBy("articles.article_id");
};

exports.fetchPatchedArticle = (article_id, inc_votes) => {
  return connection
    .select("articles.votes")
    .from("articles")
    .where("article_id", "=", article_id)
    .modify(query => {
      if (inc_votes) {
        query.increment("votes", inc_votes);
      }
    })
    .returning("*");
};
