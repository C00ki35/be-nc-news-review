const connection = require("../db/connection.js");

exports.patchVotesToComment = (comment_id, votes = 0) => {
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
    .where("comment_id", comment_id)
    .then(response => {
      if (response === 0) {
        return Promise.reject({ status: 404, msg: "No items to delete" });
      }
    });
};
