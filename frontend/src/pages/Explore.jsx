import { contains } from "cheerio/lib/static";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import List from "../components/List";
import { userService } from "../services/userService-fullback.js";
import add from "../assets/imgs/add-contact.svg";
import { AddFriends } from "../store/actions/userActions";
import Loader from '../components/Loader'
import { utilService } from "../services/util-service";
import { toast } from 'react-toastify';

export default function Explore(){
  const { loggedInUser } = useSelector((state) => state.userModule);
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!loggedInUser){
      navigate("/");
      return
    }
    loadContacts();
    return;
  }, []);

  const loadContacts = async () => {
    const contactsToDisplay = await userService.query();
    const contectsToConnect = contactsToDisplay.filter((contact) => {
      return (
        !loggedInUser.friends.includes(contact._id) &&
        loggedInUser._id !== contact._id
      );
    });
    setContacts(contectsToConnect);
  };

  const OnAddContact = (id) => {
    dispatch(AddFriends(id, loggedInUser));
    loadContacts();
    toast.success('friend added', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  };

  const getFullDeatails = () => {
    const randomNum = utilService.getRandomInt(0, 99);
    const randomInt = utilService.getRandomInt(0, 1);
    const getGenre = randomInt === 1 ? "men" : "women";
     return  `https://randomuser.me/api/portraits/med/${getGenre}/${randomNum}.jpg`;
  };


  
  if (!contacts.length) return <Loader></Loader> ;
  return (
    <div className="explore">
      <h2>lets make some new friends</h2>
      <div className="list flex column jusity-center align-center">
        {contacts.map((contact) => {
          return (
            <div key={contact._id} className="preview">
              <img
                src={add}
                title="add-friend"
                alt="add"
                onClick={() => OnAddContact(contact._id)}
              />
              <div className="flex column align-center justify-center details">
              <img src={getFullDeatails()} className="profile-pic" alt="profile-pic" />
              <span>{contact.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
