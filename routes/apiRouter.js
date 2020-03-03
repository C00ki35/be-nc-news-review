const express = require("express");
const apiRouter = express.Router();
const topicsRouter = require("./topicsRouter.js");
const usersRouter = require("./usersRouter.js");
const articlesRouter = require("./articlesRouter.js");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
