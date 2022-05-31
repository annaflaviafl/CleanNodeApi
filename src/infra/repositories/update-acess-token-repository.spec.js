const MongoHelper = require("../helpers/mongo-helper");
const MissingParamError = require("../../utils/errors/missing-param-error");
const UpdateAcessTokenRepository = require("./update-acess-token-repository");
let db;

const makeSut = () => {
  const userModel = db.collection("users");
  const sut = new UpdateAcessTokenRepository(userModel);
  return { userModel, sut };
};
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
    const { sut, userModel } = makeSut();
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

  test("Should throws if no params are provided", async () => {
    const { sut, userModel } = makeSut();
    const fakeUser = await userModel.insertOne({
      email: "valid_email@mail.com",
      password: "hashed_password",
    });
    expect(sut.update()).rejects.toThrow(new MissingParamError("userId"));
    expect(sut.update(fakeUser.insertedId)).rejects.toThrow(
      new MissingParamError("acessToken")
    );
  });
});
