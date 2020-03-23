const connection = require("../db/connection.js");
const { fetchUser } = require("./userModels");

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

exports.postCommentToArticle = (article_id, username, body) => {
  return connection("comments")
    .insert([{ body: body, author: username, article_id }])
    .where("article_id", "=", article_id)
    .returning("*");
};

exports.fetchComments = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by, order);
};

exports.fetchAllArticlesWithComments = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  let sort = "";
  if (sort_by === "comment_count") {
    sort = "comment_count";
  } else {
    sort = "articles." + sort_by;
  }

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
      if (topic) {
        query.where("articles.topic", "=", topic);
      }
    })
    .orderBy(sort, order)
    .returning("*");
};

exports.doesArticleExist = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .returning("*")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Valid article number but not found."
        });
      }
    });
};

exports.doesTopicExist = topic => {
  return connection
    .select("*")
    .from("topics")
    .where("slug", topic)
    .returning("*")
    .then(topic => {
      if (topic.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Valid topic number but not found."
        });
      }
    });
};
