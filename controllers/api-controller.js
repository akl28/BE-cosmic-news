const apiJsonFile = require("../endpoints.json");

exports.getAPI = (req, res, next) => {
  res
    .status(200)
    .send(apiJsonFile)
    .catch(next);
};
