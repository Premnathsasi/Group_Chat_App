import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store/AuthSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./Login.module.css";

const Login = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const mailInput = useRef();
  const passwordInput = useRef();

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const obj = {
        email: mailInput.current.value,
        password: passwordInput.current.value,
      };

      const res = await axios.post("http://localhost:3000/user/login", obj);
      if (res) {
        toast.success(res.data.data, { theme: "dark" });
        dispatch(authActions.login({ token: res.data.token }));
        Navigate("/home");
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.data, { theme: "colored" });
    }
  };

  return (
    <section className={classes.container}>
      <div className={classes.main}>
        <h1>Sign In</h1>
        <form onSubmit={submitHandler}>
          <input type="email" placeholder="Email" ref={mailInput} />
          <input type="password" placeholder="Password" ref={passwordInput} />
          <button type="submit" className={classes.btn}>
            Sign In
          </button>
        </form>
        <div className={classes.toggle}>
          Do not have an Account ?{" "}
          <span
            onClick={() => {
              Navigate("/signup");
            }}
          >
            Sign Up
          </span>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Login;
