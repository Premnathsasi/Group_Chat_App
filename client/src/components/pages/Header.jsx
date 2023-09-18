import { authActions } from "../store/AuthSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import classes from "./Header.module.css";

const Header = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(authActions.logout());
    Navigate("/");
  };

  return (
    <div className={classes.header}>
      <h2>Chat App</h2>
      <button onClick={logoutHandler}>Log out</button>
    </div>
  );
};

export default Header;
