const { TaskModel } = require("../db/dbSequelize");
const Session = require("./SessionService");

const get = async (req, res) => {
  if (req.headers.authorization === undefined) {
    return res.status(200).json(await TaskModel.findAll());
  }
  const token = req.headers.authorization.split(" ")[1];
  if (token === undefined) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  const session = await Session.get(token);
  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  return res.status(200).json(
    await TaskModel.findAll({
      where: {
        userId: req.query.UserID,
      },
    })
  );
};

const create = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (token === undefined) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  const session = await Session.get(token);
  if (!session) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  await TaskModel.create({
    title: req.body.title,
    completed: req.body.completed,
    userId: req.body.userId,
  }).then(() => {
    return res.status(201).send({ success: "Data created" });
  });
};

const update = async (req, res) => {
  await TaskModel.update(req.body, {
    where: { id: req.params.id },
    individualHooks: true,
  }).then(() => {
    return res.status(204).send({ success: "Request accepted" });
  });
};

const destroy = async (req, res) => {
  await TaskModel.destroy({
    where: { id: req.params.id },
    individualHooks: true,
  }).then(() => {
    return res.status(204).send({ success: "Request accepted" });
  });
};

module.exports = {
  get,
  update,
  create,
  destroy,
};
