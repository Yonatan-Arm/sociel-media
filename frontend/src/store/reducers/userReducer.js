const INITIAL_STATE = {
  loggedInUser: {
    _id: "",
    name: "",
    isAdmin: false,
    friends: [],
    createdAt: "",
  },
};

export function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        loggedInUser: action.user,
      };


    case "ADD_USER":
      return {
        ...state,
        loggedInUser: [...state.loggedInUser, action.loggedInUser],
      };

    case "REMOVE_FRIEND":
      return {
        ...state,
        loggedInUser: state.loggedInUser.friends.filter(
          (user) => user._id !== action.user
        ),
      };

    case "UPDATE_USER":
      return {
        ...state,
        loggedInUser: state.loggedInUser.friends.map((user) =>
          user._id === action.userToSave._id ? action.user : user
        ),
      };

    default:
      return state;
  }
}
