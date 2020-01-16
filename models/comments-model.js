const connection = require("../connection");

exports.updateComment = (commentID, voteInc, bodyLength) => {
  if (bodyLength === 0) {
    voteInc = 0;
  }
  return connection("comments")
    .where("comment_id", "=", commentID)
    .increment("votes", voteInc)
    .returning("*")
    .then(result => {
      if (result.length === 0)
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      return result;
    });
};

exports.removeComment = commentID => {
  return connection("comments")
    .where("comment_id", "=", commentID)
    .del();
};
