const articlesRouter = require("express").Router();
const {
  getArticleByArticleID,
  patchArticle,
  postComment,
  getCommentsByArticleID
} = require("../controllers/articles-controller");

articlesRouter
  .route("/:article_id")
  .get(getArticleByArticleID)
  .patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentsByArticleID);

module.exports = articlesRouter;
