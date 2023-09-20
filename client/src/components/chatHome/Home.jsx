import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "../pages/Header";
import classes from "./Home.module.css";

const API_URL = "http://localhost:3000/message";

const Home = () => {
  const token = localStorage.getItem("token");
  const curUser = localStorage.getItem("name");

  const [messages, setMessages] = useState([]);
  const [lastReceivedMessageId, setLastReceivedMessageId] = useState(null);
  const msgInput = useRef(null);
  const chatContainerRef = useRef(null);

  const loadMessagesFromLocalStorage = () => {
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];
    setMessages(storedMessages);
  };

  const getMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}?lastReceivedMessageId=${lastReceivedMessageId || ""}`
      );
      if (response.data) {
        const newData = response.data.data;

        if (newData.length > 0) {
          setLastReceivedMessageId(newData[newData.length - 1].id);
          newData.map((item) => {
            storeMessageInLocalStorage(item);
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [lastReceivedMessageId]);

  useEffect(() => {
    loadMessagesFromLocalStorage();
    getMessages();
    const inretvalID = setInterval(() => {
      getMessages();
    }, 2000);
    return () => {
      clearInterval(inretvalID);
    };
  }, [getMessages]);

  const storeMessageInLocalStorage = (message) => {
    let storedMessages = JSON.parse(localStorage.getItem("messages")) || [];

    // Check if the last message is equal to the message passed
    if (
      storedMessages.length === 0 ||
      storedMessages[storedMessages.length - 1].id !== message.id
    ) {
      storedMessages.push(message);

      // Ensure we only store the most recent 10 messages
      if (storedMessages.length > 10) {
        // Remove the oldest message (first message in the array)
        storedMessages.shift();
      }

      localStorage.setItem("messages", JSON.stringify(storedMessages));
    }
  };

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
        msgInput.current.value = "";
        scrollToBottom();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <section className={classes.home}>
      <div className={classes.container}>
        <Header />
        <div className={classes.chats}>
          <div className={classes.sidebar}>sidebar</div>
          <div className={classes.msgContainer} ref={chatContainerRef}>
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
