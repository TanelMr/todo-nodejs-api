const { LogModel, TaskModel } = require("../db/dbSequelize");

TaskModel.beforeCreate((instance, options) => {
  if (instance.get("title") === "" && instance.get("completed") === "") {
    return null;
  } else {
    saveLogs({
      data: instance,
      method: "POST",
      task: "Added " + JSON.stringify(instance.get("title")),
      completed: "Added " + JSON.stringify(instance.get("completed")),
    });
  }
});

TaskModel.beforeUpdate((instance, options) => {
  if (
    instance.previous("title") === instance.get("title") &&
    instance.previous("completed") === instance.get("completed")
  ) {
    return null;
  } else {
    saveLogs({
      data: instance,
      method: "PUT",
      task:
        "Changed " +
        JSON.stringify(instance.previous("title")) +
        " to " +
        JSON.stringify(instance.get("title")),
      completed:
        "Changed " +
        JSON.stringify(instance.previous("completed")) +
        " to " +
        JSON.stringify(instance.get("completed")),
    });
  }
});

TaskModel.beforeDestroy((instance, options) => {
  saveLogs({
    data: instance,
    method: "DELETE",
    task: "Deleted " + JSON.stringify(instance.previous("title")),
    completed: "Deleted " + JSON.stringify(instance.previous("completed")),
  });
});

function formatDate(date) {
  let newDate = date.replaceAll(/T/g, ", ").replaceAll(/"/g, "");
  return newDate.slice(0, 17);
}

const saveLogs = ({ data, method, task, completed }) => {
  let date = formatDate(JSON.stringify(data.get("updatedAt")));
  LogModel.create({
    date: date,
    method: method,
    userId: data.get("userId"),
    title: task,
    completed: completed,
  });
};

const get = async (req, res) => {
  res.status(200).send({ Success: "Request successful" });
  return await LogModel.findAll();
};

module.exports = {
  get,
};
