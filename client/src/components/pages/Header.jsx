import { authActions } from "../store/AuthSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Ui/Modal";
import { useDispatch, useSelector } from "react-redux";
import classes from "./Header.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  faDeleteLeft,
  faEllipsisVertical,
  faPlusSquare,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import axios from "axios";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [showList, setShowList] = useState(false);
  const [participantsList, setParticipantsList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchResult, setSearchResult] = useState("");
  const [memberId, setMemberId] = useState();
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const selectValue = useRef();

  const token = localStorage.getItem("token");
  const groupName = useSelector((state) => state.groups);

  const logoutHandler = () => {
    dispatch(authActions.logout());
    Navigate("/");
  };

  const searchHandler = async () => {
    try {
      const data = await axios.get(
        `http://localhost:3000/user?name=${selectValue.current.value}`
      );
      if (data) {
        console.log(data);
        setSearchResult(data.data.message);
        setMemberId(data.data.data.id);
      }
    } catch (err) {
      console.log(err);
      setSearchResult(err.response.data.message);
    }
  };

  const showParticipantsHandler = async () => {
    try {
      const data = await axios.get(
        `http://localhost:3000/user/${groupName.id}`
      );
      if (data) {
        setParticipantsList(data.data.data.users);
        setShowList(!showList);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeHandler = async (id) => {
    try {
      const data = await axios.delete("http://localhost:3000/group/delete", {
        data: {
          userId: id,
          groupId: groupName.id,
        },
        headers: {
          Authorization: token,
        },
      });

      if (data) {
        toast.success(data.data.message, { theme: "colored" });
        const datas = participantsList.filter((item) => item.id !== id);
        setParticipantsList(datas);
      }
    } catch (err) {
      console.log(err);
      if (err.response.status === 404) {
        return toast.error("Something went wrong", { theme: "dark" });
      } else if (err.response.status === 403) {
        return toast.error(err.response.data.message, { theme: "dark" });
      }
    }
  };

  const addMemberHandler = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/group/add-members",
        { memberId, isAdmin, groupId: groupName.id },
        { headers: { Authorization: token } }
      );
      if (response) {
        console.log(response.data);
        toast.success(response.data.message, { theme: "colored" });
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message, { theme: "colored" });
    }
  };
  return (
    <div className={classes.header}>
      <h2>Chat App</h2>
      <h3>{groupName.groupName}</h3>
      {groupName.groupName && (
        <div className={classes.addMember}>
          Add:
          <FontAwesomeIcon
            icon={faPlusSquare}
            size="xl"
            onClick={() => {
              setShowModal(true);
            }}
          />
          <div className={classes.admin}>
            {groupName.usergroup && groupName.usergroup.isAdmin ? "Admin" : ""}
          </div>
          <div className={classes.viewMore}>
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              onClick={showParticipantsHandler}
            />
          </div>
        </div>
      )}
      <button onClick={logoutHandler}>Log out</button>
      <ToastContainer />
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
          }}
        >
          <div className={classes.add}>
            <h4>Add Members</h4>
            <div className={classes.searchField}>
              <input
                className={classes.searchInput}
                type="text"
                ref={selectValue}
              />
              <FontAwesomeIcon icon={faSearch} onClick={searchHandler} />
            </div>
            <div className={classes.searchField}>
              <label>Make Admin</label>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => {
                  setIsAdmin(!isAdmin);
                }}
              />
            </div>

            <button onClick={addMemberHandler}>Add</button>
            <div>{searchResult}</div>
          </div>
        </Modal>
      )}

      {showList && (
        <div className={classes.participants}>
          <h4>Participants</h4>
          <ul>
            {participantsList.map((item) => (
              <div key={item.id}>
                <li>{item.name}</li>
                <FontAwesomeIcon
                  icon={faDeleteLeft}
                  id={item.id}
                  onClick={() => {
                    removeHandler(item.id);
                  }}
                />
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
