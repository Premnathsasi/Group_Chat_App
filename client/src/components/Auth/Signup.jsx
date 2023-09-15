/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./Signup.module.css";

const Signup = () => {
  const nameInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();
  const phoneInput = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const obj = {
        name: nameInput.current.value,
        email: emailInput.current.value,
        phoneNumber: phoneInput.current.value,
        password: passwordInput.current.value,
      };
      const data = await axios
        .post("http://localhost:3000/user/signup", obj)
        .then((res) => {
          console.log(res);
          toast.success(res.data.message, { theme: "colored" });
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data.error.name) {
            return toast.error("User already exists", { theme: "dark" });
          }
          toast.error("Something went wrong");
        });
    } catch (err) {
      console.log(err);
    }

    nameInput.current.value = "";
    emailInput.current.value = "";
    phoneInput.current.value = "";
    passwordInput.current.value = "";
  };

  return (
    <section className={classes.container}>
      <div className={classes.main}>
        <h1>CREATE AN ACCOUNT</h1>

        <form onSubmit={submitHandler}>
          <div className={classes.formControl}>
            <input
              type="text"
              placeholder="User Name"
              ref={nameInput}
              required
            />
          </div>
          <div className={classes.formControl}>
            <input type="email" placeholder="Email" ref={emailInput} required />
          </div>
          <div className={classes.formControl}>
            <input
              type="tel"
              placeholder="Phone Number"
              ref={phoneInput}
              required
            />
          </div>
          <div className={classes.formControl}>
            <input
              type="password"
              placeholder="Password"
              ref={passwordInput}
              required
            />
          </div>
          <button type="submit">CREATE</button>
        </form>
        <div className={classes.toggle}>
          Already have an Account ? <span>Sign In</span>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Signup;
