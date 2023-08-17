import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/navbar.css";
import {
  AiOutlineSearch,
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineMenu,
} from "react-icons/ai";
import { BsChatLeftText } from "react-icons/bs";

import { RiHotelLine, RiMapPinLine, RiChat1Line } from "react-icons/ri";
import { MdOutlineMeetingRoom, MdOutlineLocalHotel } from "react-icons/md";
import { BiLogIn, BiMenu } from "react-icons/bi";
import Avatar from "@mui/material/Avatar";
import { NavLink } from "react-router-dom";
import { url } from "../utils/Constants";
import swal from "sweetalert";

import { UserContext } from "../context/UserContext.jsx";

const Navbar = () => {
  const history = useNavigate();
  const { islogin, setIslogin,user, setUser,username, setUsername ,checkToken } =
    useContext(UserContext);
  

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    history("/login");
    setIslogin(false);
  };

  React.useEffect(() => {
    checkToken();
  }, [islogin]);

  return (
    <>
      <nav>
        <div className="navbar container">
          <div className="nav-left">
            <div className="nav-img">
              <NavLink to={"/"}>
                <img
                  src={require("../assets/media/images/rentlogo.png")}
                  alt="logo"
                />
              </NavLink>
              <span>
                To-Let
                <br />
                <strong>Room on Rent</strong>
              </span>
            </div>
            {/* <div className="nav-search">
              <AiOutlineSearch />
              <input
                type="text"
                placeholder="Search Opportunities"
              />
            </div> */}
          </div>
          <div className="nav-right">
            <div className="nav-tabs">
              <div className="home-tab">
                <NavLink to={"/"}>
                  <span className="tab-icon">
                    <AiOutlineHome />
                  </span>
                  <span className="tab-name">Home</span>
                </NavLink>
              </div>
              <div className="room-tab">
                <NavLink to={"/room"}>
                  <span className="tab-icon">
                    <MdOutlineMeetingRoom />
                  </span>
                  <span className="tab-name">Room</span>
                </NavLink>
              </div>
              <div className="flat-tab">
                <NavLink to={"/flat"}>
                  <span className="tab-icon">
                    <RiHotelLine />
                  </span>
                  <span className="tab-name">Flat</span>
                </NavLink>
              </div>
              <div className="hotel-tab">
                <NavLink to={"/hotel"}>
                  <span className="tab-icon">
                    <MdOutlineLocalHotel />
                  </span>
                  <span className="tab-name">Hotel</span>
                </NavLink>
              </div>
              <div className="map-tab">
                <NavLink to={"/map"}>
                  <span className="tab-icon">
                    <RiMapPinLine />
                  </span>
                  <span className="tab-name">Map</span>
                </NavLink>
              </div>
              <div className="chat-tab">
                <NavLink to={"/chats"}>
                  <span className="tab-icon ">
                    <BsChatLeftText />
                  </span>
                  <span className="tab-name">Chat</span>
                </NavLink>
              </div>
              <div className="menu-tab">
                <NavLink to={"/profile"}>
                  <span className="tab-icon">
                    <BiMenu />
                  </span>
                  <span className="tab-name">Menu</span>
                </NavLink>
              </div>
            </div>
            {islogin === false ? (
              <div className="nav-btns">
                <NavLink to={"/login"}>
                  <button className="btn login-btn">
                    <span style={{ color: "white" }}>Login</span>
                    <div className="imgs">
                      <BiLogIn />
                    </div>
                  </button>
                </NavLink>

                <NavLink to={"/signup"}>
                  <button className="btn signup-btn">
                    <span>SignUp</span>
                    <div className="imgs">
                      <BiLogIn />
                    </div>
                  </button>
                </NavLink>
                {/* <button className="menu-btn">
                <img
                  src={require("../assets/media/images/homelogo.png")}
                  alt="menu"
                />
              </button> */}
              </div>
            ) : (
              <div className="nav-btns">
                <ul className="header-navigation d-flex flex-row align-items-center">
                  <li className="welcome-username me-1">{username}</li>
                  <li className="me-2">
                    <NavLink to={"/profile"}>
                      {/* <img
                      src={require("../assets/media/images/avatar.png")}
                      width={24}
                    /> */}
                      <Avatar className="profile-avtar" title={username}>
                        {/* {username[0].toUpperCase()} */}
                        {username[0]}
                      </Avatar>
                    </NavLink>
                  </li>
                  <li>
                    {/* <div className=""> */}
                    <a href="" className="logout" onClick={logout}>
                      <img
                        src={require("../assets/media/images/icon-logout.png")}
                        title="Logout"
                      />
                    </a>
                    {/* </div> */}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
