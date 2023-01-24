const { TaskModel } = require("../db/dbSequelize");
const { requireAuth } = require("../services/UserService");

const get = async (req) => {
  if (req.token === undefined) {
    return await TaskModel.findAll();
  }
  return await TaskModel.findAll({
    where: { userId: req.userId },
  });
};

const create = async (req) => {
  await TaskModel.create({
    title: req.body.title,
    completed: req.body.completed,
    userId: req.body.userId,
  });
};

const destroy = async (req) => {
  await TaskModel.destroy({
    where: { id: req.id },
    individualHooks: true,
  });
};

const update = async (req) => {
  await TaskModel.update(req.body, {
    where: { id: req.body.id },
    individualHooks: true,
  });
};

// Export all functions
module.exports = {
  get,
  update,
  create,
  destroy,
};
