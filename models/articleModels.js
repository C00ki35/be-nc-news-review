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

exports.postCommentToArticle = (article_id, username, comment) => {
  return connection("comments")
    .insert([{ body: comment, author: username, article_id }])
    .where("article_id", "=", article_id)
    .returning("*");
};

exports.fetchComments = (article_id, sort_by = "created_at", order = "asc") => {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by, order)
    .then(response => {
      if (response.length === 0) {
        return Promise.reject({ status: 404, msg: "Path does not exist" });
      } else {
        return response;
      }
    });
};

exports.fetchAllArticlesWithComments = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  const sort = "articles." + sort_by;
  return connection
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .count("comments.comment_id AS comment_count")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .modify(query => {
      if (author) {
        query.where("articles.author", "=", author);
      }
    })
    .modify(querytopic => {
      if (topic) {
        querytopic.where("articles.topic", "=", topic);
      }
    })
    .orderBy(sort, order)
    .returning("*")
    .then(response => {
      if (response.length === 0) {
        return Promise.reject();
      } else {
        return response;
      }
    });
};
