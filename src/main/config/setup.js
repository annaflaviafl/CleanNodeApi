const cors = require("../middlewares/cors");
const jsonParse = require("../middlewares/json-parser");
const contentType = require("../middlewares/content-type");

module.exports = (app) => {
  app.disable("x-powered-by");
  app.use(cors);
  app.use(jsonParse);
  app.use(contentType);
};
