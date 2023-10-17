import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../utils/Constants";
import swal from "sweetalert";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {

  //auth states
  const [user, setUser] = useState();
  const [username, setUsername] = useState("");
  const [islogin, setIslogin] = useState(false);

  //map states
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  //chat states
  const [selectedChat, setSelectedChat] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const [loggedUser, setLoggedUser] = useState();

  const [filterData, setFilterData] = useState({
    address: "",
    placetype: "",
  });

  const history = useNavigate();

  //function to verify user
  const checkToken = async () => {
    try {
      const response = await fetch(`${url}/auth/verifyuser`, {
        method: "POST",
        mode: "cors",
        referrerPolicy: "origin-when-cross-origin",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          token: localStorage.getItem("token"),
        },
      });

      const json = await response.json();
      if (json.success === true) {
        setIslogin(true);
        setUser(json);
        setUsername(String(json.data.firstName + " " + json.data.lastName));
      } else {
        setIslogin(false);
      }
    } catch (err) {
      swal({
        title: "Try Again!",
        text: "server is down!",
        icon: "error",
        button: "Ok!",
      });
    }
  };

    const setDatas = async () => {
    const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
    console.log(userInfo);
    setUser(userInfo);
    setLoggedUser(userInfo);
    // history("/");
  };

  useEffect(() => {
    setDatas();
  }, [history]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        username,
        setUsername,
        islogin,
        setIslogin,
        checkToken,

        latitude,
        setLatitude,
        longitude,
        setLongitude,

        searchResult,
        setSearchResult,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        chats,
        setChats,
        loggedUser,
        setLoggedUser,

        filterData,
        setFilterData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
