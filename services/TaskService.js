const { TaskModel } = require("../db/dbSequelize");
const Session = require("./SessionService");

const get = async (req, res) => {
  if (
    req.headers.authorization === undefined &&
    req.query.UserID === undefined
  ) {
    return res.status(200).json(await TaskModel.findAll());
  }
  if (!req.headers.authorization) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  const token = req.headers.authorization.split(" ")[1];

  const session = await Session.get(token);
  if (!session || session.userId !== parseInt(req.query.UserID)) {
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
  if (!req.headers.authorization) {
    return res.status(401).send({ error: "Unauthorized" });
  }
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
    userId: session.userId,
  }).then(() => {
    return res.status(201).send({ success: "Data created" });
  });
};

const update = async (req, res) => {
  let response = await TaskModel.update(req.body, {
    where: { id: req.params.id, userId: req.userId },
    individualHooks: true,
  });
  if (response[0] === 0) {
    return res.status(404).json({ error: "Not found" });
  } else {
    return res.status(200).json({ success: "Request accepted" });
  }
};

const destroy = async (req, res) => {
  let status = await TaskModel.destroy({
    where: { id: req.params.id, userId: req.userId },
    individualHooks: true,
  });
  if (status === 0) {
    return res.status(404).json({ error: "Not found" });
  }
  return res.status(200).json({ success: "Request accepted" });
};

module.exports = {
  get,
  update,
  create,
  destroy,
};
