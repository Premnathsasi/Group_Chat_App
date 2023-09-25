import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import socketIoClient from "socket.io-client";
import Header from "../pages/Header";
import Sidebar from "./Sidebar";
import classes from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:3000/message";
const SOCKET_SERVER_URL = "http://localhost:3000";

const Home = () => {
  const token = localStorage.getItem("token");
  const curUser = localStorage.getItem("name");
  const group = useSelector((state) => state.groups);

  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState(null);
  const msgInput = useRef(null);
  const chatContainerRef = useRef(null);
  const socketRef = useRef();

  const loadMessagesFromLocalStorage = () => {
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];
    setMessages(storedMessages);
  };

  const getMessages = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}?groupId=${group.id}`);
      if (response.data) {
        const newData = response.data.data;

        if (newData.length > 0) {
          newData.map((item) => {
            storeMessageInLocalStorage(item);
          });
          setMessages(newData);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [group]);

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
    scrollToBottom();
  }, [group]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const storeMessageInLocalStorage = (message) => {
    let storedMessages = JSON.parse(localStorage.getItem("messages")) || [];

    const messageExists = storedMessages.some((msg) => msg.id === message.id);

    if (!messageExists) {
      storedMessages.push(message);

      if (storedMessages.length > 25) {
        storedMessages.shift();
      }

      localStorage.setItem("messages", JSON.stringify(storedMessages));
    }
  };

  const sendMessage = async () => {
    const messageText = msgInput.current.value;
    if (!messageText && !files) return;

    if (messageText) {
      socketRef.current.emit("send-message", {
        type: "text",
        text: messageText,
        groupId: group.id,
      });
      console.log(files);
      msgInput.current.value = "";
      setFiles(null);
    } else if (files) {
      try {
        const formData = new FormData();
        formData.append("file", files);
        formData.append("groupId", group.id);
        const data = await axios.post(API_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        });

        if (data) {
          console.log(data);
          setMessages((prev) => [...prev, data.data.data]);
        }
      } catch (err) {
        console.log(err);
      }
      setFiles(null);
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
                    {message.fileUrl ? (
                      <img
                        style={{ width: "20em" }}
                        src={message.fileUrl}
                        alt="imagess"
                      />
                    ) : (
                      <p>{message.message}</p>
                    )}
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

          <div className={classes.addFile}>
            <input
              accept="image/*, video/*, .pdf"
              type="file"
              style={{ display: "none" }}
              id="file"
              onChange={(e) => setFiles(e.target.files[0])}
            />
            <label htmlFor="file">
              <FontAwesomeIcon icon={faPaperclip} />
            </label>
          </div>

          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </section>
  );
};

export default Home;
