const connection = require("../connection");

exports.selectArticleByArticleID = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", "=", article_id)
    .then(result => {
      if (result.length === 0)
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      return result;
    });
};

exports.updateArticle = (articleID, voteInc) => {
  if (!voteInc) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return connection("articles")
    .where("article_id", "=", articleID)
    .increment("votes", voteInc)
    .returning("*")
    .then(result => {
      if (result.length === 0)
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      return result;
    });
};

exports.insertComment = (comment, articleID) => {
  const formattedComment = { ...comment };
  formattedComment.author = comment.username;
  formattedComment["article_id"] = articleID;
  delete formattedComment.username;
  return connection("comments")
    .insert(formattedComment)
    .returning("*");
};

exports.selectCommentsByArticleID = articleID => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", "=", articleID)
    .then(result => {
      const formattedComments = [];
      result.forEach(comment => {
        const commentCopy = { ...comment };
        formattedComments.push(commentCopy);
        delete commentCopy["article_id"];
      });
      return formattedComments;
    });
};

//  return connection
//    .select("articles.*")
//    .from("articles")
//    .count({ comment_count: "comments.comment_id" })
//    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
//    .groupBy("articles.article_id")
//    .where("articles.article_id", "=", article_id)
//    .then(result => {
//      if (result.length === 0)
//        return Promise.reject({ status: 404, msg: "Article does not exist" });
//      return result;
//    });
