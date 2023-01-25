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
    return await Task.create(req, res);
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

module.exports = {
  get,
  create,
};
