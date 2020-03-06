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
    .returning("*")
    .then(patch => {
      if (patch.length === 0) {
        return Promise.reject({
          status: 422,
          msg: "Status 422: Item does not exist"
        });
      } else {
        return patch;
      }
    });
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
