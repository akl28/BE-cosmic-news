const { updateComment, removeComment } = require("../models/comments-model");

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  const bodyLength = Object.keys(req.body).length;
  updateComment(comment_id, inc_votes, bodyLength)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(comment => {
      console.log(comment);
      if (comment === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment does not exist, nothing deleted"
        });
      }

      res.status(204).send({ comment });
    })
    .catch(next);
};
