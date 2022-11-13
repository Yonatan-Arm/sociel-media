const userService = require("./user.service.js");
const logger = require("../../services/logger.service");
const { signup } = require("../auth/auth.service.js");
const bcrypt = require('bcrypt')
const socketService = require('../../services/socket.service.js')


// GET LIST
async function getUsers(req, res) {
  try {
    var queryParams = req.query;
    const users = await userService.query(queryParams);
    res.json(users);
  } catch (err) {
    logger.error("Failed to get Users", err);
    res.status(500).send({ err: "Failed to get users" });
  }
}

// GET BY ID
async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await userService.getById(userId);
    res.json(user);
  } catch (err) {
    logger.error("Failed to get User", err);
    res.status(500).send({ err: "Failed to get user" });
  }
}

// POST (add User)
async function addUser(req, res) {
  try {
    const { name, password, isAdmin, friends, createdAt } = req.body
    const account = await signup(name, password , isAdmin, friends, createdAt)
    logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
  } catch (err) {
    logger.error("Failed to add user", err);
    res.status(500).send({ err: "Failed to add user" });
  }
}

// PUT (Update User)
async function updateUser(req, res) {
  try {
    const user = req.body;
    const updatedUser = await userService.update(user);
    res.json(updatedUser);
  } catch (err) {
    logger.error("Failed to update user", err);
    res.status(500).send({ err: "Failed to update user" });
  }
}


// DELETE (Remove User)
async function removeUser(req, res) {
  try {
    const userId = req.params.id;
    const removedId = await userService.remove(userId);
    res.send(removedId);
  } catch (err) {
    logger.error("Failed to remove user", err);
    res.status(500).send({ err: "Failed to remove user" });
  }
}

module.exports = {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  removeUser,
};
