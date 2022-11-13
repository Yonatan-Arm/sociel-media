import { storageService } from "./async-storage-service.js";
import { utilService } from "./util-service.js";
import { httpService } from "./http.service.js";
export const userService = {
  query,
  getById,
  save,
  getEmptyUser,
  getLoggedinUser,
  login,
  logout,
  removeFriends,
  loadFriends,
  remove,
  signup,
  addFriends,
};

const STORAGE_KEY = "user_db";
const LOGGEDIN_KEY = "loggedInUser_db";
const ENDPOINT = "user";
const user_KEY = "user_db";

const gDefaultUsers = [
  {
    _id: "r5d62",
    name: "yona",
    isAdmin: true,
    friends: ["s45r3", "s56r1", "as4s4"],
    password: "123",
    createdAt: 1659092430304,
  },
  {
    _id: "s45r3",
    name: "Dusty ban",
    isAdmin: false,
    friends: [],
    password: "123",
    createdAt: 1659092430304,
  },
  {
    _id: "s56r1",
    name: "edi",
    isAdmin: false,
    friends: ["s45r3", "as4s4"],
    password: "123",
    createdAt: 1659092430205,
  },
  {
    _id: "as4s4",
    name: "DevTron",
    isAdmin: false,
    friends: [],
    password: "123",
    createdAt: 1659092430310,
  },
];

async function query() {
  try {
    const users = await storageService.query(STORAGE_KEY);
    if (!users.length) {
      const users = await storageService.postMany(STORAGE_KEY, gDefaultUsers);
      return users;
    }
    return users;
  } catch (error) {
    throw new Error("error on qurey users", error);
  }
}

async function getById(id) {
  try {
    return await storageService.get(STORAGE_KEY, id);
  } catch (error) {
    throw new Error("error on getById FE", error);
  }
}

async function remove(id) {
  const users = await query();
  const idx = users.findIndex((user) => user._id === id);
  users.splice(idx, 1);
  if (!users.length) users = gDefaultUsers.slice();
  utilService.saveToStorage(STORAGE_KEY, users);
  return Promise.resolve();
}

async function save(user) {
  try {
    if (user._id) {
      return await storageService.put(STORAGE_KEY, user);
    }
    const addedUser = await storageService.post(STORAGE_KEY, user);
    delete addedUser.password;
    return addedUser;
  } catch (error) {
    throw new Error("error on save user", error);
  }
}

async function loadFriends(friends) {
  if (!friends) return;
  return friends.map(async (friend) => {
    let id = friend._id;
    const friend2 = await getById(id);
    delete friend2.password;
    return friend2;
  });
}

async function removeFriends(entities, id) {
  try {
    const idx = entities.friends.findIndex((userId) => userId === id);
    if (idx === -1)
      return Promise.reject(`Unknown Entity ${entities} with Id: ${id}`);
    entities.friends.splice(idx, 1);
    save(entities);
    const userToSave = await getById(id);
    const idxUser = userToSave.friends.findIndex(
      (userId) => userId === entities._id
    );
    userToSave.friends.splice(idxUser, 1);
    save(userToSave);
    utilService.saveToSessionStorage(LOGGEDIN_KEY, entities);
    return entities;
  } catch (error) {
    throw new Error("error on remove Friends", error);
  }
}

async function addFriends(entities, id) {
  try {
    entities.friends.push(id);
    save(entities);
    const userToSave = await getById(id);
    userToSave.friends.push(entities._id);
    save(userToSave);
    utilService.saveToSessionStorage(LOGGEDIN_KEY, entities);
    return entities;
  } catch (error) {
    throw new Error("error on remove Friends", error);
  }
}

async function login(userInfo) {
  try {
    const user = await getByUsername(userInfo.name, userInfo.password);
    if (!user) console.log("Invalid username or password");
    // delete user.password;
    utilService.saveToSessionStorage(LOGGEDIN_KEY, user);
    return user;
  } catch {
    console.log("cant login");
  }
}
async function signup(user) {
  try {
    return await storageService.post(STORAGE_KEY, user);
  } catch {
    console.log("cant login");
  }
}

function getLoggedinUser() {
  return utilService.loadFromSessionStorage(LOGGEDIN_KEY);
}

async function logout() {
  try {
    return await utilService.removeFromSessionStorage(LOGGEDIN_KEY);
  } catch {
    console.log("logout failed");
  }
}

async function getByUsername(username, password) {
  try {
    const collection = await query();
    const user = await collection.filter(
      (user) => user.name === username && user.password === password
    );
    return user[0];
  } catch (err) {
    throw err;
  }
}

function getEmptyUser() {
  return {
    name: "",
    password: "",
    friends: [],
    isAdmin: false,
    createdAt: Date.now(),
  };
}
