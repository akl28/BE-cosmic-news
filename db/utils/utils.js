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

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
