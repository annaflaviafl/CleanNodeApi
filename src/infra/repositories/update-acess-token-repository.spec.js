const MongoHelper = require("../helpers/mongo-helper");
let db;

class UpdateAcessTokenRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }
  async update(userId, acessToken) {
    await this.userModel.updateOne(
      {
        _id: userId,
      },
      {
        $set: { acessToken },
      }
    );
  }
}

describe("UpdateAcessToken Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    db = await MongoHelper.db;
  });

  beforeEach(async () => {
    await db.collection("users").deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test("Should update the user with the given acessToken", async () => {
    const userModel = db.collection("users");
    const sut = new UpdateAcessTokenRepository(userModel);
    const fakeUser = await userModel.insertOne({
      email: "valid_email@mail.com",
      password: "hashed_password",
    });
    await sut.update(fakeUser.insertedId, "valid_token");
    const updateFakeUser = await userModel.findOne({
      _id: fakeUser.insertedId,
    });
    expect(updateFakeUser.acessToken).toBe("valid_token");
  });

  test("Should throws if no userModel is provided", async () => {
    const sut = new UpdateAcessTokenRepository();
    const userModel = db.collection("users");
    const fakeUser = await userModel.insertOne({
      email: "valid_email@mail.com",
      password: "hashed_password",
    });
    const promise = sut.update(fakeUser.insertedId, "valid_token");
    expect(promise).rejects.toThrow();
  });
});
