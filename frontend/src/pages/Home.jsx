import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import List from "../components/List";
import { userService } from "../services/userService-fullback.js";
import {
  removeFriends,
  removeFriendsFromList,
} from "../store/actions/userActions";
import editSelf from "../assets/imgs/edit-self.svg";
import addContact from "../assets/imgs/add-contact.svg";
import Loader from '../components/Loader'
import { toast } from 'react-toastify';

export default function Home() {
  const { loggedInUser } = useSelector((state) => state.userModule);
  const [friends, setfriends] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/");
      return
    }
    OnloadFriends();
    return;
  }, []);

  const OnloadFriends = async () => {
    const friendsToDisplay = loggedInUser.friends;
    const promises = await Promise.all(
      friendsToDisplay.map(async (id) => {
        return await userService.getById(id);
      })
    );
    setfriends(promises);
  };

  const onRemoveFriend = (friendId, ev) => {
    ev.stopPropagation();
    dispatch(removeFriends(friendId, loggedInUser));
    OnloadFriends();
    toast.success('removed user', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  };

  const RemoveFriendFromList = (friendId, ev) => {
    ev.stopPropagation();
    dispatch(removeFriendsFromList(friendId, loggedInUser));
    OnloadFriends();
    toast.success('removed friend', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  };
  if (!friends.length) return <Loader> </Loader>
  return (
    <div className="home">
      <Link to={`/edit/${loggedInUser._id}`}>
        <img src={editSelf} alt="edit" title="edit-Self" />{" "}
      </Link>
      {loggedInUser.isAdmin && (
        <Link to="/edit">
          <img src={addContact} alt="add" title="add-contact" />
        </Link>
      )}
      {friends.length ? (
        <List
          friends={friends}
          onRemoveFriend={onRemoveFriend}
          RemoveFriendFromList={RemoveFriendFromList}
        />
      ) : (
        <span className="msg"> doesn't have friends lets make some</span>
      )}
    </div>
  );
}
