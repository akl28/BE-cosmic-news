const connection = require("../connection");

exports.selectUserByUsername = username => {
  // console.log("inside users model", username);
  return connection
    .select("*")
    .from("users")
    .where("username", "=", username)
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Username does not exist" });
      }
      return result;
    });
};
