import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "../pages/Header";
import classes from "./Home.module.css";

const API_URL = "http://localhost:3000/message";

const Home = () => {
  const token = localStorage.getItem("token");
  const curUser = localStorage.getItem("name");

  const [messages, setMessages] = useState([]);
  const msgInput = useRef(null);

  const getMessages = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data) {
        setMessages(response.data.data);
        console.log(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getMessages();
    const inretvalID = setInterval(() => {
      getMessages();
    }, 2000);
    return () => {
      clearInterval(inretvalID);
    };
  }, []);

  const sendMessage = async () => {
    const messageText = msgInput.current.value;
    if (!messageText) return;

    try {
      const response = await axios.post(
        API_URL,
        { message: messageText },
        { headers: { Authorization: token } }
      );
      if (response.data) {
        const newMsg = {
          ...response.data.data.dataValues,
          ...response.data.data,
        };
        setMessages((prevMessages) => [...prevMessages, newMsg]);
        msgInput.current.value = "";
        console.log(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className={classes.home}>
      <div className={classes.container}>
        <Header />
        <div className={classes.chats}>
          <div className={classes.sidebar}>sidebar</div>
          <div className={classes.msgContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  curUser === message.user.name
                    ? classes.msgChats
                    : classes.msgChatReceived
                }
              >
                <p
                  className={
                    curUser === message.user.name ? classes.senderName : ""
                  }
                >
                  {curUser === message.user.name ? "You" : message.user.name}
                </p>
                <div
                  className={
                    curUser === message.user.name
                      ? classes.msgSender
                      : classes.recipient
                  }
                >
                  <p>{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.inputMsg}>
          <input
            type="text"
            placeholder="Type your message..."
            ref={msgInput}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </section>
  );
};

export default Home;
