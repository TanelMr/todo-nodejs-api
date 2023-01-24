const { UserModel } = require("../db/dbSequelize");
const Task = require("../services/SessionService");

async function userExists(username) {
  let user;
  await UserModel.findOne({ where: { username: username } }).then((data) => {
    user = data != null;
  });
  return user;
}

const create = async (req) => {
  if ((await userExists(req.body.username)) === false) {
    await UserModel.create({
      username: req.body.username,
      password: req.body.password,
    });
    return false;
  }
  return true;
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
        return res
          .status(401)
          .send({ error: "Unauthorized. Please try logging in again." });
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
  console.log("Authorization fired");
  if (!req.headers.authorization) {
    return res.status(401).send("Authorization header is required");
  }

  const token = req.headers.authorization.split(" ")[1];

  if (token === "null") {
    return res.status(401).send("Malformed token in authorization header");
  }

  // Get session by token from db
  const session = await Task.get(token);

  // If session is not found, return 401
  if (!session) {
    return res.status(401).send("Invalid token in authorization header");
  }

  req.userId = session.userId;

  next();
};

// Export all functions
module.exports = {
  create,
  validate,
  requireAuth,
};
