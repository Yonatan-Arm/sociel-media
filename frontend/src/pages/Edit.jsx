import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import backBtn from "../assets/imgs/back.svg";
import { userService } from "../services/userService-fullback.js";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../store/actions/userActions";
import Loader from "../components/Loader";
import { toast } from 'react-toastify';


export default function Edit() {
  const { loggedInUser } = useSelector((state) => state.userModule);
  const [user, handleChange, setUser] = useForm(null);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser.isAdmin && loggedInUser._id !== id) navigate("/");
    loadUser();
  }, []);

  const loadUser = async () => {
    let user = id ? await userService.getById(id) : userService.getEmptyUser();
    setUser(user);
  };

  const onSaveUser = async (ev) => {
    ev.preventDefault();
    if (!user.name) return;
    if (id) {
      await userService.update(JSON.parse(JSON.stringify(user)));
    } else {
      navigate("/contacts");
      await userService.add(JSON.parse(JSON.stringify(user)));
    }
    navigate("/contacts");
    toast.success('changed friend details', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  };
  if (!user) return <Loader></Loader>;

  return (
    <section className="edit">
      <h2>{user._id ? "Edit" : "Add"} user</h2>
      <img
        src={backBtn}
        alt="back"
        className="back-btn"
        onClick={() => navigate("/contacts")}
        title="back"
      />
      <form onSubmit={onSaveUser} className="flex column">
        <div className="flex column">
          <label htmlFor="name">name</label>
          <input
            onChange={handleChange}
            value={user.name}
            type="text"
            name="name"
            id="name"
          />
        </div>
        {!id && (
          <div className="flex column">
            <label htmlFor="password">password</label>
            <input
              onChange={handleChange}
              value={user.password}
              type="text"
              name="password"
              id="password"
            />
          </div>
        )}
        {loggedInUser.isAdmin && (
          <div className="flex column">
            <label htmlFor="isAdmin">status</label>
            <select
              onChange={handleChange}
              value={user.isAdmin}
              name="isAdmin"
              id="isAdmin"
            >
              <option value="" disabled>
                {" "}
                admin
              </option>
              <option value={false}> remove Admin</option>
              <option value={true}> add Admin</option>
            </select>
          </div>
        )}
        <button>Save</button>
      </form>
    </section>
  );
}
