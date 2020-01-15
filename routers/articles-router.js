const articlesRouter = require("express").Router();
const {
  getArticleByArticleID,
  patchArticle,
  postComment
} = require("../controllers/articles-controller");

articlesRouter
  .route("/:article_id")
  .get(getArticleByArticleID)
  .patch(patchArticle);

articlesRouter.route("/:article_id/comments").post(postComment);

module.exports = articlesRouter;
