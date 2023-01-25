const { UserModel } = require("../db/dbSequelize");
const Session = require("../services/SessionService");

async function userDoesNotExist(username) {
  if ((await UserModel.findOne({ where: { username: username } })) === null) {
    return true;
  }
}

const create = async (req, res) => {
  if (await userDoesNotExist(req.body.username)) {
    await UserModel.create({
      username: req.body.username,
      password: req.body.password,
    });
    return res.status(201).send({ success: "Data created" });
  }
  return res.status(409).send({ error: "Conflict" });
};

const validate = (req, res, next) => {
  UserModel.findOne({
    where: [
      {
        username: req.body.username,
        password: req.body.password,
      },
    ],
  })
    .then((user) => {
      if (user === null) {
        return res.status(401).send({ error: "Unauthorized" });
      }
      req.userId = user.id;

      next();
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal server error",
      });
    });
};

const requireAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send({ error: "Unauthorized" });
  }
  const session = await Session.get(token);
  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  req.userId = session.userId;

  next();
};

module.exports = {
  create,
  validate,
  requireAuth,
};
