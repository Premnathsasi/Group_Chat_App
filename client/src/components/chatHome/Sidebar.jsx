import classes from "./Sidebar.module.css";
import Modal from "../Ui/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useDispatch } from "react-redux";
import { groupActions } from "../store/GroupSlice";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

const API_URL = "http://localhost:3000/group";

const Sidebar = () => {
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const groupInput = useRef();
  const dispatch = useDispatch();

  const getGroupList = async () => {
    try {
      const data = await axios.get(API_URL, {
        headers: { Authorization: token },
      });
      if (data) {
        setGroupList(data.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createGroupHandler = async () => {
    try {
      const data = await axios.post(
        `${API_URL}/create`,
        { groupName: groupInput.current.value },
        { headers: { Authorization: token } }
      );
      if (data) {
        console.log(data.data);
        setShowModal(false);
        setGroupList((prev) => [...prev, data.data.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getGroupList();
    const intervalID = setInterval(() => {
      getGroupList();
    }, 3000);
    return () => {
      clearInterval(intervalID);
    };
  }, []);

  const selectGroupHandler = (e) => {
    dispatch(groupActions.addGroup(e));
  };

  const closeHandler = () => {
    setShowModal(false);
  };

  return (
    <div className={classes.sidebar}>
      <div className={classes.newGroup}>
        <p>Create Group</p>
        <button
          onClick={() => {
            setShowModal(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} size="xl" />
        </button>
      </div>
      <hr />

      {groupList.map((item) => (
        <li
          onClick={() => {
            selectGroupHandler(item);
          }}
          key={item.id}
          id={item.groupName}
        >
          {item.groupName}
        </li>
      ))}

      {showModal && (
        <Modal onClose={closeHandler}>
          <div className={classes.createGroup}>
            <h2>Create Group</h2>
            <div className={classes.formControl}>
              <label> Group Name:</label>
              <input type="text" ref={groupInput} />
            </div>

            <div className={classes.btnCtrl}>
              <button
                className={classes.createbtn}
                onClick={createGroupHandler}
              >
                Create Group
              </button>
              <button
                className={classes.closebtn}
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Sidebar;
