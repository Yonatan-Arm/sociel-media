const dbService = require("../../services/db.service");
const logger = require("../../services/logger.service");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require('bcrypt')

async function query() {
  try {
    // const criteria = _buildCriteria(filterBy)
    // const criteria = {}
    const collection = await dbService.getCollection("user");
    var users = await collection.find().toArray();
    return users;
  } catch (err) {
    logger.error("cannot find users", err);
    throw err;
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection("user");
    const user = collection.findOne({ _id: ObjectId(userId) });
    return user;
  } catch (err) {
    logger.error(`while finding product ${userId}`, err);
    throw err;
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection("user");
    await collection.deleteOne({ _id: ObjectId(userId) });
    return userId;
  } catch (err) {
    logger.error(`cannot remove user ${userId}`, err);
    throw err;
  }
}

async function add(user) {
  const saltRounds = 10
  const hash = await bcrypt.hash(user.password, saltRounds)
  try {
    const addeduser = {
        name : user.name,
        isAdmin: user.isAdmin,
        password: hash,
        friends: user.friends,
        createdAt:user.createdAt
    }
    const collection = await dbService.getCollection('user');
     await collection.insertOne(user);
    return addeduser;
  } catch (err) {
    logger.error("cannot insert user", err);
    throw err;
  }
}


async function update(user) {
  try {
    var id = ObjectId(user._id);
    delete user._id;
    const collection = await dbService.getCollection("user");
    await collection.updateOne({ _id: id }, { $set: { ...user } });
    user._id = id;
    return user;
  } catch (err) {
    logger.error(`cannot update user ${user._id}`, err);
    throw err;
  }
}

async function getByUsername(name) {
  try {
    const collection = await dbService.getCollection("user");
    const user = await collection.findOne({ name });
    return user;
  } catch (err) {
    logger.error(`while finding user ${email}`, err);
    throw err;
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  getByUsername,
};
