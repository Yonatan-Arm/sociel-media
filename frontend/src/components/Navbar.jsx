import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import menu from "../assets/imgs/menu.svg";
import { userService } from "../services/userService-fullback.js";
import {setUSER} from '../store/actions/userActions.js'


export default function Navbar() {
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [loggedInUser, setloggedInUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()

  useEffect(() => {
    setIsOpenModel(false)
    loadLogginUser()
    return () => {
      setloggedInUser(null);
    };
  }, [location]);

  useEffect(() => {
    return () => {
      setIsOpenModel(false);
    };
  }, []);

  const loadLogginUser = async () => {
    const loggedInUser = await userService.getLoggedinUser();
    setloggedInUser(loggedInUser);
    dispatch(setUSER(loggedInUser))
  };
  const onLogOut = async () => {
    let user = await userService.logout();
    setloggedInUser(user);
    navigate("login");
  };

  return (
    <div className="navbar">
      <div className="nav flex space-between justify-center align-center">
        <div className="logo">
          <span>Y</span>
          <span>o</span>
          <span>n</span>
          <span>a</span>
          <span>t</span>
          <span>a</span>
          <span>n</span>
          <span>-</span>
          <span>A</span>
          <span>r</span>
          <span>m</span>
        </div>
        <div className="links flex">
          <Link to="contacts">Friends</Link>
          <Link to="explore">Explore</Link>
          {loggedInUser ? (
            <span onClick={onLogOut} className="clickable"> logout</span>
          ) : (
            <div className="flex row login-signup">
              <Link to="login">Login</Link> 
              <Link to="signup">Signup</Link>
            </div>
          )}
        </div>

        <div className="mobile-nav">
          <img
            src={menu}
            alt="menu"
            onClick={() => {
              setIsOpenModel(true);
            }}
          />
          {isOpenModel && (
            <div className="flex column mobile-model  align-center">
              <Link to="contacts">Friends</Link>
              <Link to="explore">Explore</Link>
              {loggedInUser ? (
            <span onClick={onLogOut} className="clickable"> logout</span>
          ) : (
            <div className="flex column login-signup">
            <Link to="login">Login</Link>
             <Link to="signup">Signup</Link> 
          </div>
          )}
              <button
                onClick={() => {
                  setIsOpenModel(false);
                }}
              >
                X
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
