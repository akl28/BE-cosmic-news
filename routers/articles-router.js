const articlesRouter = require("express").Router();
const {
  getArticleByArticleID,
  patchArticle
} = require("../controllers/articles-controller");

articlesRouter
  .route("/:article_id")
  .get(getArticleByArticleID)
  .patch(patchArticle);

module.exports = articlesRouter;
