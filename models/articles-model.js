const connection = require("../connection");

exports.selectArticleByArticleID = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comments.article_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", "=", article_id)
    .then(result => {
      if (result.length === 0)
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      return result;
    });
};

exports.updateArticle = (articleID, voteInc) => {
  return connection("articles")
    .where("article_id", "=", articleID)
    .increment("votes", voteInc)
    .returning("*");
};

// count of films  by director
// return connection
//   .select("directors.*")
//   .from("directors")
//   .count({ film_count: "film_id" })
//   .leftJoin("films", "directors.director_id", "films.director_id")
//   .groupBy("directors.director_id");
