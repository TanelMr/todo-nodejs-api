const Task = require("../services/SessionService");

// const get = async (req, res) => {
//   try {
//     return res.status(200).json(await Task.get({ userId: req.userId }));
//   } catch (e) {
//     return res.status(500).send({ error: e.message });
//   }
// };

const create = async (req, res) => {
  try {
    return res.status(200).json(await Task.create(req.userId));
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

const destroy = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    await Task.destroy(token).then((data) => {
      if (data === 1) {
        return res.status(200).send({ success: "Request accepted" });
      }
    });
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

module.exports = {
  // get,
  create,
  destroy,
};
