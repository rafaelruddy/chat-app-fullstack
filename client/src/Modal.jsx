import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "./api/axios";

const Modal = (props) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function getContacts() {
      try {
        const response = await axios.get("/users", {
          withCredentials: true,
        });
        console.log(response?.data.users);
        setContacts(response?.data.users);
      } catch (err) {
        if (!err?.response) {
          console.log("No server Response");
        } else if (err.response?.status === 401) {
          console.log("a");
        } else {
          console.log("Pegar usuarios falhou");
        }
      }
    }
    getContacts();
  }, []);

  const divStyle = {
    display: props.displayModal ? "flex" : "none",
  };
  function closeModal(e) {
    e.stopPropagation();
    props.closeModal();
  }
  return (
    <div className="modal" onClick={closeModal} style={divStyle}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="chat__users">
          {contacts &&
            contacts.map((item) => {
              return (
                <Link
                  className="contato"
                  key={item._id}
                  to={`../chat/${item._id}`}
                >
                  <p>{item.email}</p>
                  <hr></hr>
                </Link>
              );
            })}
        </div>
        <span className="close" onClick={closeModal}>
          &times;
        </span>
      </div>
    </div>
  );
};
export default Modal;
