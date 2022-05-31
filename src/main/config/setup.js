module.exports = (app) => {
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.set("acess-control-allow-origin", "*");
    res.set("acess-control-allow-methods", "*");
    res.set("acess-control-allow-headers", "*");
    next();
  });
};
