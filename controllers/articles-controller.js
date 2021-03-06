const {
  selectArticleByArticleID,
  updateArticle,
  insertComment,
  selectCommentsByArticleID,
  selectArticles
} = require("../models/articles-model");

exports.getArticleByArticleID = (req, res, next) => {
  // console.log("inside articles controller");
  const { article_id } = req.params;
  selectArticleByArticleID(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const bodyLength = Object.keys(req.body).length;
  updateArticle(article_id, inc_votes, bodyLength)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  insertComment(req.body, req.params.article_id)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const query = req.query;
  const { limit } = req.query;
  const { p } = req.query;
  selectCommentsByArticleID(article_id, query, limit, p)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { order } = req.query;
  const { sort_by } = req.query;
  const { author } = req.query;
  const { topic } = req.query;
  const { limit } = req.query;
  const { p } = req.query;
  selectArticles(order, sort_by, author, topic, limit, p)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
