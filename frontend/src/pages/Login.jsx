import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService-fullback.js";
import { useForm } from "../hooks/useForm";
import { useDispatch } from "react-redux";
import { setUSER } from "../store/actions/userActions.js";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

export default function Login() {
  const [user, handleChange, setUser] = useForm(null);
  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);
  const dispatch = useDispatch();

  const onLogin = async (ev) => {
    ev.preventDefault();
    let userLogin = await userService.login(JSON.parse(JSON.stringify(user)));
    if (!userLogin) {
      setWarning(true);
      toast.error("wrong username or password", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      user.password = "";
      setTimeout(() => {
        setWarning(false);
      }, 3000);
      return;
    }
    await dispatch(setUSER(userLogin));
    navigate("/contacts");
    toast.success("user login", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const user = await userService.getEmptyUser();
    setUser(user);
  };

  if (!user) return <Loader></Loader>;

  return (
    <section className="login-page">
      <h3 className="text-center">Login</h3>
      <form onSubmit={onLogin} className="flex column">
        <div className="flex column">
          <label htmlFor="name">user name:</label>
          <input
            onChange={handleChange}
            value={user.name}
            type="text"
            name="name"
            id="name"
          />
        </div>
        <div className="flex column">
          <label htmlFor="password">password</label>
          <input
            onChange={handleChange}
            value={user.password}
            type="password"
            name="password"
            id="password"
          />
        </div>
        <button>Login</button>
      </form>
      {warning && (
        <span className="warning"> Invalid username or password</span>
      )}
    </section>
  );
}
