const Task = require("../services/TaskService");

const get = async (req, res) => {
  try {
    return await Task.get(req, res);
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

const update = async (req, res) => {
  try {
    return await Task.update(req, res);
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

const destroy = async (req, res) => {
  try {
    return await Task.destroy(req, res);
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

module.exports = {
  get,
  create,
  update,
  destroy,
};
