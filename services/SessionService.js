const { SessionModel } = require("../db/dbSequelize");

const get = async (token) => {
  return await SessionModel.findOne({ where: { token: token } });
};

const create = async (userId) => {
  const jwt = require("jsonwebtoken");
  const jwt_secret = process.env.JWT_SECRET;
  let token = jwt.sign({ UserID: userId }, jwt_secret);
  return await SessionModel.create({ token: token, userId: userId });
};

const destroy = async (token) => {
  return await SessionModel.destroy({ where: { token: token } });
};

module.exports = {
  get,
  create,
  destroy,
};
