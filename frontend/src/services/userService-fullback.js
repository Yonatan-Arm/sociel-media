import { utilService } from "./util-service.js";
import { httpService } from "./http.service.js";

const ENDPOINT = "user";
const LOGGEDIN_KEY = "loggedInUser";

export const userService = {
  query,
  getById,
  add,
  update,
  remove,
  getEmptyUser,
  login,
  signup,
  logout,
  getLoggedinUser,
  loadFriends,
  removeFriends,
  addFriends,
};

async function query() {
  try {
    return await httpService.get(ENDPOINT);
  } catch (error) {
    throw new Error("error on qurey users", error);
  }
}

async function getById(id) {
  try {
    return await httpService.get(`${ENDPOINT}/${id}`);
  } catch (err) {
    console.log("cannot get user by id", err);
  }
}

async function remove(id) {
  try {
    return await httpService.delete(`${ENDPOINT}/${id}`);
  } catch (err) {
    console.log("cannot delete user", err);
  }
}

async function add(user) {
  return await httpService.post(ENDPOINT, user);
}

async function update(user) {
  try {
    return await httpService.put(`${ENDPOINT}/${user._id}`, user);
  } catch (err) {
    console.log("cannot update user", err);
  }
}

function getEmptyUser() {
  return {
    name: "",
    password: "",
    isAdmin: false,
    friends: ["62e5442816d6f70013be75f5"],
    createdAt: Date.now(),
  };
}

async function login(userInfo) {
  try {
    const user = await httpService.post("auth/login", userInfo);
    if (user) await utilService.saveToSessionStorage(LOGGEDIN_KEY, user);
    return user;
  } catch (err) {
    console.log("login failed");
  }
}

async function signup(userInfo) {
  const user = await httpService.post("auth/signup", userInfo);
  await utilService.saveToSessionStorage(LOGGEDIN_KEY, user);
  return user;
}

async function logout() {
  try {
    const loggedOutUser = await httpService.post("auth/logout");
    return await utilService.removeFromSessionStorage(LOGGEDIN_KEY);
  } catch {
    console.log("logout failed");
  }
}

async function getLoggedinUser() {
  return await utilService.loadFromSessionStorage(LOGGEDIN_KEY);
}

async function loadFriends(friends) {
  if (!friends) return;
  return friends.map(async (friendId) => {
    return await getById(friendId);
  });
}

async function removeFriends(entities, id) {
  try {
    const idx = entities.friends.findIndex((userId) => userId === id);
    if (idx === -1)
      return Promise.reject(`Unknown Entity ${entities} with Id: ${id}`);
    entities.friends.splice(idx, 1);
    update(entities);
    const userToSave = await getById(id);
    const idxUser = userToSave.friends.findIndex(
      (userId) => userId === entities._id
    );
    userToSave.friends.splice(idxUser, 1);
    update(userToSave);
    utilService.saveToSessionStorage(LOGGEDIN_KEY, entities);
    return entities;
  } catch (error) {
    throw new Error("error on remove Friends", error);
  }
}

async function addFriends(entities, id) {
  try {
    entities.friends.push(id);
    update(entities);
    const userToSave = await getById(id);
    userToSave.friends.push(entities._id);
    update(userToSave);
    utilService.saveToSessionStorage(LOGGEDIN_KEY, entities);
    return entities;
  } catch (error) {
    throw new Error("error on remove Friends", error);
  }
}
