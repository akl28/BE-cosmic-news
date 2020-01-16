const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics-controller");

topicsRouter
  .route("/")
  .get(getTopics)
  .post(getTopics)
  .patch(getTopics)
  .put(getTopics)
  .delete(getTopics);

module.exports = topicsRouter;
