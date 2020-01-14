const connection = require("../connection");

exports.selectTopics = () => {
  // console.log("inside model");
  return connection.select("*").from("topics");
};

// Notes
// exports.deleteHouse = ({ id }) => {
//   // sql
//   connection("houses") // table name
//     .where("house_id ", id) // column name, condition
//     .del()
//     .then(function(deleteCount) {
//       console.log(mystery);
//     });
// };
