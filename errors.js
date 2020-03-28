exports.psqlErrors = (err, req, res, next) => {
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
    res.status(422).send({ msg: "Status 422: Item does not exist" });
  }

  if (err.code === "23505") {
    res.status(409).send({ msg: "Username already exists" });
  }

  if (err.code === "22003") {
    res.status(416).send({ msg: "Request range not satisfiable." });
  }

  if (err.status) {
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
