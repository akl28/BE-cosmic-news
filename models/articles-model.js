const connection = require("../connection");
const { checkExists } = require("../db/utils/utils");

exports.selectArticleByArticleID = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", "=", article_id)
    .then(([result]) => {
      if (!result)
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      return result;
    });
};

exports.updateArticle = (articleID, voteInc, bodyLength) => {
  if (bodyLength === 0) {
    voteInc = 0;
  }
  return connection("articles")
    .where("article_id", "=", articleID)
    .increment("votes", voteInc)
    .returning("*")
    .then(([result]) => {
      if (!result)
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
    .returning("*")
    .then(([result]) => {
      return result;
    });
};

exports.selectCommentsByArticleID = (articleID, query) => {
  if (query.order !== "asc" && query.order !== "desc") {
    query.order = "desc";
  }
  return connection
    .select("*")
    .from("comments")
    .where("article_id", "=", articleID)
    .orderBy(query.sort_by || "created_at", query.order || "desc")
    .then(result => {
      if (result.length === 0 && articleID !== undefined) {
        return checkExists(articleID, "articles", "article_id");
      }
      const formattedComments = [];
      result.forEach(comment => {
        const commentCopy = { ...comment };
        formattedComments.push(commentCopy);
        delete commentCopy["article_id"];
      });

      return formattedComments;
    });
};

exports.selectArticles = (orderBy, sortBy, author, topic) => {
  if (orderBy !== "asc" && orderBy !== "desc") {
    orderBy = "desc";
  }
  return connection
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sortBy || "created_at", orderBy || "desc")
    .modify(function(currentQuery) {
      if (author) currentQuery.where("articles.author", "=", author);
      if (topic) currentQuery.where("articles.topic", "=", topic);
    })
    .then(articles => {
      if (articles.length === 0 && author !== undefined) {
        return checkExists(author, "users", "username");
      } else if (articles.length === 0 && topic !== undefined) {
        return checkExists(topic, "topics", "slug");
      } else {
        return articles;
      }
    });
};
