const Task = require("../services/LogService");

const get = async (req, res) => {
  try {
    return res.status(200).json(await Task.get());
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

module.exports = {
  get,
};
