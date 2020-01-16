const connection = require("../../connection");

exports.formatDates = articleData => {
  const formattedArticles = [];
  articleData.forEach(articleDatum => {
    const articleCopy = { ...articleDatum };
    const newDate = new Date(articleCopy["created_at"]);
    articleCopy["created_at"] = newDate;
    formattedArticles.push(articleCopy);
  });
  return formattedArticles;
};

exports.makeRefObj = articles => {
  const referenceObj = {};
  articles.forEach(article => {
    referenceObj[article.title] = article["article_id"];
  });
  return referenceObj;
};

exports.formatComments = (comments, refObj) => {
  const formattedComments = [];
  comments.forEach(comment => {
    const commentCopy = { ...comment };
    commentCopy.author = comment["created_by"];
    commentCopy["article_id"] = refObj[commentCopy["belongs_to"]];
    const newDate = new Date(commentCopy["created_at"]);
    commentCopy["created_at"] = newDate;
    delete commentCopy["created_by"];
    delete commentCopy["belongs_to"];
    formattedComments.push(commentCopy);
  });
  return formattedComments;
};

exports.checkExists = (authorORtopic, table, column) => {
  return connection
    .select("*")
    .from(table)
    .where(column, "=", authorORtopic)
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Does not exist" });
      } else {
        return [];
      }
    });
};
