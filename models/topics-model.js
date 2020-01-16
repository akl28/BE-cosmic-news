const connection = require("../connection");

exports.selectTopics = method => {
  console.log(method);
  if (method !== "GET") {
    return Promise.reject({ status: 405, msg: "Method not valid" });
  }
  return connection.select("*").from("topics");
};
