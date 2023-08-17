import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/coming-soon.css";

function ComingSoon() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   navigate("/");
  // }, []);

  return (
    <>
      <div className="container-fluid main-container section">
      <div className="row">
        <div className="col">
          <div className="logo">
            <img
              src={require("../assets/media/images/rentlogo.png")}
              className="img-fluid logo-sm"
              alt="To-Let"
              title="To-Let"
            />
          </div>
          <div className="body-text float-start">
            <h1 className="page-heading">Get Your Residence Map</h1>
            <br />
            <p>
              Stay tuned to unwrap your home dreams come true
              <br /> starting with <strong>To-Let platform</strong>.
            </p>
            <br/>
            <h1><strong>Coming Soon...</strong></h1>
          </div>
          <div className="banner float-end">
            <img
              src={require("../assets/media/images/comingsoon-banner.png")}
              className=""
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default ComingSoon;
