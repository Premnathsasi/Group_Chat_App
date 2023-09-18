import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "../pages/Header";
import classes from "./Home.module.css";

const Home = () => {
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const msgInput = useRef();

  const getExpense = useCallback(async () => {
    try {
      const data = await axios.get("http://localhost:3000/message");
      if (data) {
        let newList = [];
        data.data.data.map((item) => {
          newList.push(item);
        });
        console.log(newList);
        setMessages(newList);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getExpense();
  }, []);

  const msgHandler = async () => {
    try {
      const data = await axios.post(
        "http://localhost:3000/message",
        { message: msgInput.current.value },
        {
          headers: { Authorization: token },
        }
      );
      if (data) {
        setMessages((prev) => [...prev, data.data.data]);
      }
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className={classes.home}>
      <div className={classes.container}>
        <Header />
        <div className={classes.chats}>
          <div className={classes.sidebar}>sidebar</div>
          <div className={classes.msgContainer}>
            {messages.map((item, index) => (
              <div key={index} className={classes.msgChats}>
                <div className={classes.msgSender}>
                  <p>{item.message}</p>
                </div>
                <p className={classes.senderName}>You</p>
              </div>
            ))}

            <div className={classes.msgChats}>
              <p>Others</p>
              <div className={classes.recipient}>
                <p>Hey, good. You</p>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.inputMsg}>
          <input
            type="text"
            placeholder="Type your message..."
            ref={msgInput}
          />
          <button onClick={msgHandler}>Send</button>
        </div>
      </div>
    </section>
  );
};

export default Home;
