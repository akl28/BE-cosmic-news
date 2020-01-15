const connection = require("../connection");

exports.updateComment = (commentID, voteInc) => {
  if (!voteInc) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
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
