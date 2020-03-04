const connection = require("../db/connection.js");

exports.patchVotesToComment = (comment_id, votes) => {
  return connection
    .select("comments.votes")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .modify(query => {
      if (votes) {
        query.increment("votes", votes);
      }
    })
    .returning("*");
};

exports.fetchDeleteComment = comment_id => {
  return connection
    .del()
    .from("comments")
    .where("comment_id", comment_id);
};
