import { useNavigate } from "react-router-dom";
import classes from "./Login.module.css";

const Login = () => {
  const Navigate = useNavigate();

  return (
    <section className={classes.container}>
      <div className={classes.main}>
        <h1>Sign In</h1>
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
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
    </section>
  );
};

export default Login;
