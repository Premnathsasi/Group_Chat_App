import { authActions } from "../store/AuthSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Ui/Modal";
import { useDispatch, useSelector } from "react-redux";
import classes from "./Header.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faPlusSquare, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import axios from "axios";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
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
      <div>{groupName.groupName}</div>
      {groupName.groupName && (
        <div className={classes.addMember}>
          Add Members:{" "}
          <FontAwesomeIcon
            icon={faPlusSquare}
            size="xl"
            onClick={() => {
              setShowModal(true);
            }}
          />
          <div className={classes.admin}>
            {groupName.usergroup.isAdmin ? "Admin" : ""}
          </div>
        </div>
      )}
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
      <button onClick={logoutHandler}>Log out</button>
      <ToastContainer />
    </div>
  );
};

export default Header;
