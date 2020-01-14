const { selectUserByUsername } = require("../models/users-model");

exports.getUserByUsername = (req, res, next) => {
  // console.log(req.params, "req params <<<");
  const { username } = req.params;
  selectUserByUsername(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
