const articlesRouter = require("express").Router();
const {
  getArticleByArticleID,
  patchArticle,
  postComment,
  getCommentsByArticleID,
  getArticles
} = require("../controllers/articles-controller");
const { send405Error } = require("../errors/index");

articlesRouter
  .route("/:article_id")
  .get(getArticleByArticleID)
  .patch(patchArticle)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentsByArticleID)
  .all(send405Error);

articlesRouter
  .route("/")
  .get(getArticles)
  .all(send405Error);

module.exports = articlesRouter;
