exports.handleCustomErrors = (err, req, res, next) => {
  // console.log(err, "inside custom err handler");
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  // console.log(err, "inside psql err handler");
  const psqlErrorCodes = {
    "22P02": { msg: "Bad Request", status: 400 },
    "23502": { msg: "Bad Request: empty body", status: 400 },
    "23503": { msg: "Bad Request: comment in wrong format", status: 400 }
  };
  if (psqlErrorCodes[err.code])
    res
      .status(psqlErrorCodes[err.code].status)
      .send({ msg: psqlErrorCodes[err.code].msg });
  else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err, "inside server err handler");
  res.status(500).send({ msg: "Internal Server Error" });
};

exports.handleRouteErrors = (req, res, next) => {
  res.status(404).send({ msg: "Path does not exist" });
};
