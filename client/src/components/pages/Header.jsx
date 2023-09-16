import classes from "./Header.module.css";

const Header = () => {
  return (
    <div className={classes.header}>
      <h2>Chat App</h2>
      <button>Log out</button>
    </div>
  );
};

export default Header;
