const express = require("express");
const { set } = require("express/lib/application");
const app = express();
const setupApp = require("./setup");

setupApp(app);

module.exports = app;
