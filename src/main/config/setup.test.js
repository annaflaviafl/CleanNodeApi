const request = require("supertest");
const app = require("./app");

describe("App setup", () => {
  test("Should disable x-powered-by header", async () => {
    app.get("/test_x_powered_by", (req, res) => {
      res.send("");
    });
    const res = await request(app).get("/test_x_powered_by");
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });

  test("Should enable CORS", async () => {
    app.get("/test_cors", (req, res) => {
      res.send("");
    });
    const res = await request(app).get("/test_cors");
    expect(res.headers["acess-control-allow-origin"]).toBe("*");
    expect(res.headers["acess-control-allow-methods"]).toBe("*");
    expect(res.headers["acess-control-allow-headers"]).toBe("*");
  });
});
