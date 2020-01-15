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
  //console.log(req, "req <");
  //  console.log(inc_votes, "<<<");
  updateArticle(article_id, inc_votes)
    .then(article => {
      // console.log(article, "articless");
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
  //  console.log(req.query, "****");
  selectCommentsByArticleID(article_id, query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
