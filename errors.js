exports.psqlErrors = (err, req, res, next) => {
  //console.log(err);
  if (err.code === "42703") {
    res
      .status(400)
      .send({ msg: "Status 400: Bad request - Column does not exist" });
  }
  if (err.code === "23502") {
    res
      .status(400)
      .send({ msg: "Status 400: Bad request - Invalid data type" });
  }
  if (err.code === "22P02") {
    res
      .status(400)
      .send({ msg: "Status 400: Bad request - Invalid data type" });
  }
  if (err.code === "23503") {
    res.status(400).send({ msg: "Status 400: Article does not exist" });
  }
  if (err.code === "22003") {
    res.status(416).send({ msg: "Request range not satisfiable." });
  }
  if (err.status === 404) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: "Not Found." });
};

exports.error405 = (req, res, next) => {
  res.status(405).send({ message: "Status: 405 Method not allowed" });
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
