import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import trash from "../assets/imgs/trash.svg";
import remove from "../assets/imgs/remove.svg";
import edit from "../assets/imgs/edit.svg";
import chat from "../assets/imgs/chat.svg";
import { utilService } from "../services/util-service.js";

export default function Preview({
  friend,
  onRemoveFriend,
  RemoveFriendFromList,
}) {
  const { loggedInUser } = useSelector((state) => state.userModule);

  useEffect(() => {
    getFullDeatails();
    return () => {};
  }, []);

  const getFullDeatails = () => {
    const randomNum = utilService.getRandomInt(0, 99);
    const randomInt = utilService.getRandomInt(0, 1);
    const getGenre = randomInt === 1 ? "men" : "women";
    friend.Img = `https://randomuser.me/api/portraits/med/${getGenre}/${randomNum}.jpg`;
  };

  const ImgSrc = useMemo(() => getFullDeatails(friend.Img), [friend.Img]);

  return (
    <div className="preview flex column align-center justify-center">
      <div className="flex row media ">
      <div className="img-contanier">
        <img src={friend.Img} alt="profile-pic" />
      </div>
      <img
          className="remove-friend"
          src={remove}
          alt="remove"
          title="remove friend"
          onClick={(ev) => RemoveFriendFromList(friend._id, ev)}
        />
       
        </div>
      <span className="friend-name">{friend.name}</span>
      <div className="flex contact-actions ">

        <Link to={`/chat/${friend._id}`} className="flex justify-center">
          <img src={chat} className="chat-img" alt="chat" title="chat" />
          send message
        </Link>
      </div>

      {loggedInUser.isAdmin && (
        <div className="actions flex space-between">
          <img
            src={trash}
            alt="trash"
            title="delete"
            onClick={(ev) => onRemoveFriend(friend._id, ev)}
          />
          <Link to={`/edit/${friend._id}`}>
            {" "}
            <img src={edit} alt="edit" title="edit" />
          </Link>
        </div>
      )}
    </div>
  );
}
