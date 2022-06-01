const express = require("express");
const { set } = require("express/lib/application");
const app = express();
const setupApp = require("./setup");
const setupRoutes = require("./routes");

setupApp(app);
setupRoutes(app);

module.exports = app;
