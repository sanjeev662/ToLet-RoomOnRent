import React from "react";
import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();
  const gotohome = () => {
    navigate("/");
  };
  return (
    <div className="section">
      <div
        style={{
          float: "left",
          margin: "0 auto",
          background: "#fff",
          textAlign: "left",
          padding: "10% 0 10% 10%",
          width: "50%",
          height: "600px"
        }}
      >
        <img
          src={require("../assets/media/images/rentlogo.png")}
          alt="To-Let"
          title="To-Let"
          width={150}
        />
        <h1
          style={{
            color: "#101828",
            fontSize: 30,
            fontWeight: 600,
            padding: "25px 0 0 0",
            fontFamily: "Work sans",
          }}
        >
          Page not found
        </h1>
        <div
          style={{
            color: "#101828",
            fontSize: 18,
            padding: "25px 0",
            fontFamily: "Work sans",
          }}
        >
          Sorry, the page you are looking for doesn't exist.
        </div>
        <button
          onClick={gotohome}
          style={{
            margin: "25px 0",
            background: "#FBA33C",
            border: "1px solid #FBA33C",
            color: "#fff",
            fontSize: 15,
            fontFamily: "Work sans",
            width: 280,
            height: 40,
            boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
            borderRadius: 8,
          }}
        >Go To Homepage</button>
      </div>
      <div style={{ float: "left", width: "50%", background: "#fff" }}>
        <img
          src={require("../assets/media/images/404.gif")}
          alt="To-Let"
          style={{ width: "700px", height: "600px" }}
          title="To-Let"
        />
      </div>
    </div>
  );
}

export default Error;
