import { userService } from "../../services/userService-fullback.js";

export function setUSER(user) {
  return async (dispatch) => {
    try {
      dispatch({ type: "SET_USER", user });
    } catch (err) {
      console.log("err:", err);
    }
  };
}

export function removeFriends(friendId, user) {
  return async (dispatch) => {
    try {
      user = await userService.removeFriends(user, friendId);
      dispatch({ type: "SET_USER", user });
      await userService.remove(friendId);
      return user;
    } catch (err) {
      console.log("err:", err);
    }
  };
}
export function removeFriendsFromList(friendId, user) {
  return async (dispatch) => {
    try {
      user = await userService.removeFriends(user, friendId);
      dispatch({ type: "SET_USER", user });
      return user;
    } catch (err) {
      console.log("err:", err);
    }
  };
}

export function AddFriends(id, user) {
  return async (dispatch) => {
    try {
      user = await userService.addFriends(user, id);
      dispatch({ type: "SET_USER", user });
      return user;
    } catch (err) {
      console.log("err:", err);
    }
  };
}
