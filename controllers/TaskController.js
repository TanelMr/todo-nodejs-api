const Task = require("../services/TaskService");

const get = async (req, res) => {
  try {
    return res.status(200).json(
      await Task.get({
        userId: req.query.UserID,
        token: req.headers.authorization,
      })
    );
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

const create = async (req, res) => {
  try {
    await Task.create(req).then(() => {
      return res.status(201).send({ success: "Data crated" });
    });
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

const update = async (req, res) => {
  try {
    await Task.update(req).then(() => {
      return res.status(202).send({ success: "Data updated" });
    });
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

const destroy = async (req, res) => {
  try {
    await Task.destroy({ id: req.params.id }).then(() => {
      return res.status(202).send({ success: "Data updated" });
    });
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
