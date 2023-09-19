import React, { useState, useContext, useEffect } from "react";
import "../../assets/styles/map.css";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import swal from "sweetalert";
import axios from "axios";
import GoogleMapReact from "google-map-react";
import MyMarker from "./MyMarker";
import { url } from "../../utils/Constants";

const distanceToMouse = (pt, mp) => {
  if (pt && mp) {
    return Math.sqrt((pt.x - mp.x) * (pt.x - mp.x) + (pt.y - mp.y) * (pt.y - mp.y));
  }
};

export default function Map() {
  const [points, setPoints] = useState([]);
  const { latitude, setLatitude, longitude, setLongitude } = useContext(UserContext);
  const navigate = useNavigate();
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    const getPoints = async () => {
      try {
        const response = await axios.get(`${url}/places/allplaces`);
        setPoints(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getPoints();
  }, []);

  const handleMapClick = (event) => {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 300) {
      const { lat, lng } = event;
      swal({
        text: "Do you want to add/pin this location?",
        icon: "success",
        buttons: {
          cancel: "Cancel",
          confirm: "Ok",
        },
      }).then((value) => {
        if (value) {
          setLatitude(lat);
          setLongitude(lng);
          swal({
            title: "Location Added!",
            text: `Latitude=${lat} Longitude=${lng}`,
            icon: "success",
            button: "Ok!",
          });
          navigate("/profile/places/new");
        } else {
          navigate("/map");
        }
      });
    } else {
      // This is a single click
      setLastClickTime(currentTime);
    }
  };

  return (
    <>
      {points.length ? (
        <div className="Map" style={{ width: "100vw", height: "80vh" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyDuyLoUeeoFQDDqEA1AXMB5IvfrrVE5Dz4",
              language: "en",
              region: "IN",
            }}
            defaultCenter={{ lat: 28.2, lng: 76.6 }}
            defaultZoom={8}
            distanceToMouse={distanceToMouse}
            onClick={handleMapClick}
          >
            {points.map(({ latitude, longitude, _id, title, placetype, price, isbooked }) => {
              if (latitude !== undefined && longitude !== undefined) {
                return (
                  <MyMarker
                    key={_id}
                    lat={latitude}
                    lng={longitude}
                    text={_id}
                    tooltip={title}
                    placetype={placetype}
                    price={price}
                    isbooked={isbooked}
                  />
                );
              }
              return null;
            })}
          </GoogleMapReact>
        </div>
      ) : (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="text-center">
                <h1>No Data Found</h1>
                <p>Sorry, there is no data available to display at the moment.</p>
                <Link to="/" className="btn btn-primary">
                  Back To Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}