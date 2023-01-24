const Task = require("../services/UserService");

const get = async (req, res) => {
  try {
    await Task.validate({ userId: req.userId });
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

const create = async (req, res) => {
  try {
    await Task.create(req).then((data) => {
      console.log(data);
      if (data === false) {
        return res
          .status(201)
          .send({ success: "New user created successfully!" });
      }
      return res
        .status(409)
        .send({ error: "Conflict, this user already exists!" });
    });
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

module.exports = {
  get,
  create,
};
