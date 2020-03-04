const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
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
  } else next(err);
});

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found." });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
