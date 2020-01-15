const {
  selectArticleByArticleID,
  updateArticle,
  insertComment
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

// insertTreasure(req.body)
//   .then(treasure => {
//     res.status(201).send({ treasure });
//   })
//   .catch(next);
