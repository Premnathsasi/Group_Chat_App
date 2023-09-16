import Header from "../pages/Header";
import classes from "./Home.module.css";

const Home = () => {
  return (
    <section className={classes.home}>
      <div className={classes.container}>
        <Header />
        <div className={classes.chats}>
          <div className={classes.sidebar}>sidebar</div>
          <div className={classes.chatSpace}>
            <div>hello</div>
            <div>How are you?</div>
          </div>
        </div>
        <div className={classes.sendMsg}>
          <input type="text" placeholder="Type your message..." />
          <button>Send</button>
        </div>
      </div>
    </section>
  );
};

export default Home;
