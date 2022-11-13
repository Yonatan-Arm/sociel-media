import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { userService } from "../services/userService-fullback.js";
import { setUSER } from "../store/actions/userActions";
import Loader from '../components/Loader'
import { toast } from 'react-toastify';


export default function Signup() {
  const [user, handleChange, setUser] = useForm(null);
  const dispatch = useDispatch()
  const navigate = useNavigate();


  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    let user = await userService.getEmptyUser();
    setUser(user);
  };

  const onSaveUser = async (ev) => {
    ev.preventDefault();
    if (!user.name || !user.password){
      toast.error('wrong username or password', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    return;
    }
   const userToSave = await userService.signup(JSON.parse(JSON.stringify(user)))
   await dispatch(setUSER(userToSave))
    navigate("/contacts")
  };

  if (!user) return <Loader></Loader>;
  return (
    <div className="login-page" >
        <h3 className="text-center">signup</h3>
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
        <button>Signup</button>
      </form>
    </div>
  );
}

