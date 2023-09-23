import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import socketIoClient from "socket.io-client";
import Header from "../pages/Header";
import Sidebar from "./Sidebar";
import classes from "./Home.module.css";

const API_URL = "http://localhost:3000/message";
const SOCKET_SERVER_URL = "http://localhost:3000";

const Home = () => {
  const token = localStorage.getItem("token");
  const curUser = localStorage.getItem("name");
  const group = useSelector((state) => state.groups);

  const [messages, setMessages] = useState([]);
  const [lastReceivedMessageId, setLastReceivedMessageId] = useState(null);
  const msgInput = useRef(null);
  const chatContainerRef = useRef(null);
  const socketRef = useRef();

  const loadMessagesFromLocalStorage = () => {
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];
    setMessages(storedMessages);
  };

  const getMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}?groupId=${group.id}&lastReceivedMessageId=${lastReceivedMessageId}`
      );
      if (response.data) {
        const newData = response.data.data;

        if (newData.length > 0) {
          setLastReceivedMessageId(newData[newData.length - 1].id);
          newData.map((item) => {
            storeMessageInLocalStorage(item);
          });
          setMessages(newData);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [group, lastReceivedMessageId]);

  useEffect(() => {
    socketRef.current = socketIoClient(SOCKET_SERVER_URL, {
      query: { token },
    });

    socketRef.current.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });
    loadMessagesFromLocalStorage();

    return () => {
      socketRef.current.disconnect();
    };
  }, [group.id, token]);

  useEffect(() => {
    getMessages();
  }, [group]);

  const storeMessageInLocalStorage = (message) => {
    let storedMessages = JSON.parse(localStorage.getItem("messages")) || [];

    // Check if the message already exists in storedMessages
    const messageExists = storedMessages.some((msg) => msg.id === message.id);

    if (!messageExists) {
      storedMessages.push(message);

      // Ensure we only store the most recent 10 messages
      if (storedMessages.length > 25) {
        // Remove the oldest message (first message in the array)
        storedMessages.shift();
      }

      localStorage.setItem("messages", JSON.stringify(storedMessages));
    }
  };

  const sendMessage = async () => {
    const messageText = msgInput.current.value;
    if (!messageText) return;

    socketRef.current.emit("send-message", {
      text: messageText,
      groupId: group.id,
    });

    msgInput.current.value = "";

    // try {
    //   const response = await axios.post(
    //     API_URL,
    //     { message: messageText, groupId: group.id },
    //     { headers: { Authorization: token } }
    //   );
    //   if (response.data) {
    //     msgInput.current.value = "";
    //     scrollToBottom();
    //   }
    // } catch (err) {
    //   console.error(err);
    // }
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
          <Sidebar />
          {group.id && (
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
          )}
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
