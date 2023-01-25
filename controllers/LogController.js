const Task = require("../services/LogService");

const get = async (req, res) => {
  try {
    return await Task.get(req, res);
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

module.exports = {
  get,
};
