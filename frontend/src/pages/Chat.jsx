import React, { useEffect, useState } from "react";
import { socketService } from "../services/socket.service";
import { utilService } from "../services/util-service.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import backBtn from "../assets/imgs/back.svg";

export default function Chat() {
  const { loggedInUser } = useSelector((state) => state.userModule);
  const { id } = useParams();
  const [currentMessage, handleChange, setCurrentMessage] = useForm('');
  const [messageList, setMessageList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socketService.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, []);

  useEffect(() => {
    socketService.emit("join_room", id+loggedInUser._id);
    return () => {
    };
  }, []);

  const sendMsg = async (ev) => {
    ev.preventDefault();
    if (currentMessage !== "") {
      var messageData = {
        _id: await utilService.makeId(),
        message: currentMessage,
        author:loggedInUser.name,
        room: loggedInUser._id+id,
      };
    }
    await socketService.emit("send_message", messageData);
    setMessageList((list) => [...list, messageData]);
    setCurrentMessage('');
  };

  return (
    <div className="chat">
    <img
        src={backBtn}
        alt="back"
        className="back-btn"
        onClick={() => navigate("/contacts")}
        title="back"
      />
    <div className="chat-window">
        <div className="chat-header">
          <p>Live Chat</p>
        </div>
        <div className="chat-body">
          {messageList.map((messageContent) => {
            return (
              <div className="message-content" key={messageContent._id}>
                <p className="msg" style={{backgroundColor : (messageContent.author === loggedInUser.name) ? '#736f75' : '#99f19a'}}>{messageContent.author}: {messageContent.message}</p>
              </div>
            );
          })}
        </div>

      <form onSubmit={sendMsg} className="flex column chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }} />
        <button>Send</button>
      </form>
    </div>
    </div>
  );
}
