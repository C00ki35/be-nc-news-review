const express = require("express");
const app = express();
const { psqlErrors, handle500, handle404s } = require("./errors");
const apiRouter = require("./routes/apiRouter");
const { error405 } = require("./errors");
//const cors = require("cors");

//app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use(psqlErrors);

app.use("/*", handle404s);

app.use(handle500);

module.exports = app;
