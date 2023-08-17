import React, { useState, useContext, useEffect } from "react";
import "../../assets/styles/map.css";
import { Navigate, useNavigate, Link, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import swal from "sweetalert";
import axios from "axios";
import { url } from "../../utils/Constants";

import GoogleMapReact from "google-map-react";
import MyMarker from "./MyMarker";

const distanceToMouse = (pt, mp) => {
  if (pt && mp) {
    return Math.sqrt(
      (pt.x - mp.x) * (pt.x - mp.x) + (pt.y - mp.y) * (pt.y - mp.y)
    );
  }
};

export default function Map() {
  const [pin, setPin] = useState(null);
  const [points, setPoints] = useState([]);

  const { latitude, setLatitude, longitude, setLongitude } =
    useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getpoints = async () => {
      try {
        const allPoints = await axios.get(`${url}/places/allplaces`);
        setPoints(allPoints.data);
      } catch (err) {
        console.log("err");
      }
    };
    getpoints();
  }, []);

  const handleMapDoubleClick = (ev) => {
    swal({
      text: `Are you want to pin this location?`,
      icon: "success",
      buttons: {
        cancel: "Cancel",
        confirm: "Ok",
      },
    }).then((value) => {
      if (value) {
        setLatitude(ev.lat);
        setLongitude(ev.lng);
        swal({
          title: "Location Added!",
          text: "Latitide=" + ev.lat + " Longitude=" + ev.lng,
          icon: "success",
          button: "Ok!",
        });
        navigate("/profile/places/new");
      } else {
        navigate("/map");
      }
    });
  };

  return (
    <>
      {points ? (
        <>
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
              onClick={(ev) => {
                if (ev.type !== "dblclick") {
                  handleMapDoubleClick(ev);
                }
              }}
            >
              {points &&
                points.map(
                  ({ latitude, longitude, _id, title, placetype, price,isbooked }) => {
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
                  }
                )}
            </GoogleMapReact>
          </div>
        </>
      ) : (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="text-center">
                <h1>No Data Found</h1>
                <p>
                  Sorry, there is no data available to display at the moment.
                </p>
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
