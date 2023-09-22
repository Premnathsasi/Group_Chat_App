/* eslint-disable react/prop-types */
import { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";

const BackDrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose} />;
};

const OverLay = (props) => {
  return (
    <div className={classes.modal}>
      <div>{props.children}</div>
    </div>
  );
};

const Modal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <BackDrop onClose={props.onClose} />,
        document.getElementById("overlay")
      )}
      {ReactDOM.createPortal(
        <OverLay>{props.children}</OverLay>,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default Modal;
