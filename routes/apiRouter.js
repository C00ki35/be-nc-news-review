const express = require("express");
const apiRouter = express.Router();
const topicsRouter = require("./topicsRouter.js");
const usersRouter = require("./usersRouter.js");
const articlesRouter = require("./articlesRouter.js");
const commentsRouter = require("./commentsRouter.js");
const detailsRouter = require("./detailsRouter.js");
const endpoints = require("./endpoints.json");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/details", detailsRouter);

apiRouter.get("/", (req, res, next) => {
  res.status(200).send(endpoints);
});

module.exports = apiRouter;
