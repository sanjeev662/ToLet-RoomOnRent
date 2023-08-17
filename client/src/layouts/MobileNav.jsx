import React from "react";
import { NavLink } from "react-router-dom";
import {AiOutlineHome} from "react-icons/ai";
import { RiHotelLine , RiMapPinLine } from "react-icons/ri";
import { BiMenu} from "react-icons/bi";
import { BsChatLeftText } from "react-icons/bs";
import { MdOutlineMeetingRoom,MdFamilyRestroom,MdOutlineLocalHotel } from "react-icons/md";

const MobileNav = () => {
  return (
    <div className="mobile-nav">
      <div className="mobile-nav-tabs">
      <div className="home-tab">
                <NavLink to={"/"}>
                  <span className="tab-icon"><AiOutlineHome /></span>
                  <span className="tab-name">Home</span>
                </NavLink>
              </div>
              <div className="room-tab">
                <NavLink to={"/room"}>
                  <span className="tab-icon"><MdOutlineMeetingRoom /></span>
                  <span className="tab-name">Room</span>
                </NavLink>
              </div>
              <div className="flat-tab">
                <NavLink to={"/flat"}>
                  <span className="tab-icon"><RiHotelLine /></span>
                  <span className="tab-name">Flat</span>
                </NavLink>
              </div>
              <div className="hotel-tab">
                <NavLink to={"/hotel"}>
                  <span className="tab-icon"><MdOutlineLocalHotel /></span>
                  <span className="tab-name">Hotel</span>
                </NavLink>
              </div>
              <div className="map-tab">
                <NavLink to={"/map"}>
                  <span className="tab-icon"><RiMapPinLine /></span>
                  <span className="tab-name">Map</span>
                </NavLink>
              </div>
              <div className="chat-tab">
                <NavLink to={"/chats"}>
                  <span className="tab-icon "><BsChatLeftText /></span>
                  <span className="tab-name">Chat</span>
                </NavLink>
              </div>
              <div className="menu-tab">
                <NavLink to={"/profile"}>
                  <span className="tab-icon"><BiMenu /></span>
                  <span className="tab-name">Menu</span>
                </NavLink>
              </div>
      </div>
    </div>
  );
};

export default MobileNav;
