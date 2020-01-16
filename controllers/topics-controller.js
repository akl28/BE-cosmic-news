const { selectTopics } = require("../models/topics-model");

exports.getTopics = (req, res, next) => {
  selectTopics(req.method)
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
