const { selectTopics } = require("../models/topics-model");

exports.getTopics = (req, res, next) => {
  // console.log("inside topics controller");
  selectTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

// Notes
// exports.removeHouse = (req, res, next) => {
//   deleteHouse(req.params);
// .then(deleteCount => {
//   res.sendStatus(204)
// })
// };
