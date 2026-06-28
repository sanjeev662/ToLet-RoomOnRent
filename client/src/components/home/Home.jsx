import React, { useEffect, useState, useContext } from "react";
import CommonCards from "./CommonCards";
import FeaturedCards from "./FeaturedCards";
import SlidingBrands from "./SlidingBrands";
import Welcome from "./Welcome";
import swal from "sweetalert";
import CircularProgress from "@mui/material/CircularProgress";

import { url } from "../../utils/Constants";

const Home = () => {
  const flat = [
    {
      address: "Kanpur , Uttar Pradesh",
      subtitle: "Student",
      image: require("../../assets/media/images/flat/flat1.jpg"),
      link: "/flat",
      title: "Flat in Kanpur",
    },
    {
      address: "Lucknow , Uttar Pradesh",
      subtitle: "Student",
      image: require("../../assets/media/images/flat/flat2.jpg"),
      link: "/flat",
      title: "Flat in Lucknow",
    },
    {
      address: "Allahabad , Uttar Pradesh",
      subtitle: "Student",
      image: require("../../assets/media/images/flat/flat3.jpg"),
      link: "/flat",
      title: "Flat in Allahabad",
    },
    {
      address: "Noida , Uttar Pradesh",
      subtitle: "Student",
      image: require("../../assets/media/images/flat/flat4.jpg"),
      link: "/flat",
      title: "Flat in Noida",
    },
  ];

  const hotel = [
    {
      address: "Kanpur , Uttar Pradesh",
      subtitle: "Student",
      image: require("../../assets/media/images/hotel/hotel1.jpg"),
      link: "/hotel",
      title: "hotel in Kanpur",
    },
    {
      address: "Lucknow , Uttar Pradesh",
      subtitle: "Student",
      image: require("../../assets/media/images/hotel/hotel2.jpg"),
      link: "/hotel",
      title: "Hotel in Lucknow",
    },
    {
      address: "Allahabad , Uttar Pradesh",
      subtitle: "Student",
      image: require("../../assets/media/images/hotel/hotel3.jpg"),
      link: "/hotel",
      title: "Hotel in Allahabad",
    },
    {
      address: "Noida , Uttar Pradesh",
      subtitle: "Student",
      image: require("../../assets/media/images/hotel/hotel4.jpg"),
      link: "/hotel",
      title: "Hotel in Noida",
    },
    {
      address: "Delhi , Uttar Pradesh",
      subtitle: "Student",
      image: require("../../assets/media/images/hotel/hotel5.jpg"),
      link: "/hotel",
      title: "Hotel in Delhi",
    },
  ];

  const room = [
    {
      address: "Kanpur , Uttar Pradesh",
      subtitle: "Student",
      image: require("../../assets/media/images/room/room1.jpg"),
      link: "/room",
      title: "Room in Kanpur",
    },
    {
      address: "Lucknow , Uttar Pradesh",
      subtitle: "Student",
      image: require("../../assets/media/images/room/room2.jpg"),
      link: "/room",
      title: "Room in Lucknow",
    },
    {
      address: "Allahabad , Uttar Pradesh",
      subtitle: "Student",
      image: require("../../assets/media/images/room/room4.jpg"),
      link: "/room",
      title: "Room in Allahabad",
    },
    {
      address: "Noida , Uttar Pradesh",
      subtitle: "Student",
      image: require("../../assets/media/images/room/room3.jpg"),
      link: "/room",
      title: "Room in Noida",
    },
  ];

  const [hotels, setHotels] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [flats, setFlats] = useState(null);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [flatsLoading, setFlatsLoading] = useState(true);

  const getHotels = async () => {
    setHotelsLoading(true);
    try{
    const req = `${url}/places?page=1&size=10&address=${""}&placetype=hotel`;

    const response = await fetch(req, {
      method: "GET",
      mode: "cors",
      referrerPolicy: "origin-when-cross-origin",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    const responseData = await response.json();
    if (response.status === 200) {
      setHotels(responseData.placesdata);
    }
  } catch (err) {
    swal({
      title: "Try Again!",
      text: "server is down!",
      icon: "error",
      button: "Ok!",
    });
  } finally {
    setHotelsLoading(false);
  }
  };

  const getRooms = async () => {
    setRoomsLoading(true);
    try{
    const req = `${url}/places?page=1&size=10&address=${""}&placetype=room`;

    const response = await fetch(req, {
      method: "GET",
      mode: "cors",
      referrerPolicy: "origin-when-cross-origin",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    const responseData = await response.json();
    if (response.status === 200) {
      setRooms(responseData.placesdata);
    }
  } catch (err) {
    swal({
      title: "Try Again!",
      text: "server is down!",
      icon: "error",
      button: "Ok!",
    });
  } finally {
    setRoomsLoading(false);
  }
  };

  const getFlats = async () => {
    setFlatsLoading(true);
    try{
    const req = `${url}/places?page=1&size=10&address=${""}&placetype=flat`;

    const response = await fetch(req, {
      method: "GET",
      mode: "cors",
      referrerPolicy: "origin-when-cross-origin",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    const responseData = await response.json();
    if (response.status === 200) {
      setFlats(responseData.placesdata);
    }
  } catch (err) {
    swal({
      title: "Try Again!",
      text: "server is down!",
      icon: "error",
      button: "Ok!",
    });
  } finally {
    setFlatsLoading(false);
  }
  };

  // useEffect(() => {
  //   return () => {
  //     getHotels();
  //     setIsLoading(true);
  //     getFlats();
  //     setIsLoading(true);
  //     getRooms();
  //   };
  // }, []);

  useEffect(() => {
    getHotels();
    getFlats();
    getRooms();
  }, []);

  return (
    <>
      <Welcome />
      <SlidingBrands title={"Get Your Own Place"} small={"Your Dream Cities"} />

      <CommonCards
        images={room}
        heading={"Rooms"}
        content={"Get rooms available for you in your area"}
        type={"Room"}
      />
      {roomsLoading ? (
        <div
          className="circle"
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <CircularProgress />
        </div>
      ) : rooms && rooms.length > 0 ? (
        <FeaturedCards images={rooms} type={"Room"} />
      ) : null}
      <hr className="mb-5 p-2" />

      <CommonCards
        images={hotel}
        heading={"Hotels"}
        content={"Get hotels available for you in your area"}
        type={"Hotel"}
      />
      {hotelsLoading ? (
        <div
          className="circle"
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <CircularProgress />
        </div>
      ) : hotels && hotels.length > 0 ? (
        <FeaturedCards images={hotels} type={"Hotel"} />
      ) : null}
      <hr className="mb-5 p-2" />

      <CommonCards
        images={flat}
        heading={"Flats"}
        content={"Get flats available for you in your area"}
        type={"Flat"}
      />
      {flatsLoading ? (
        <div
          className="circle"
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <CircularProgress />
        </div>
      ) : flats && flats.length > 0 ? (
        <FeaturedCards images={flats} type={"Flat"} />
      ) : null}
    </>
  );
};

export default Home;
