import { useEffect, useState, useContext } from "react";
import axios from "axios";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";
import { url } from "../../../utils/Constants";
import { Link, useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext.jsx";
import swal from "sweetalert";

import CircularProgress from "@mui/material/CircularProgress";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem("token");
  const { islogin, setIslogin } = useContext(UserContext);
  const navigate = useNavigate();

  const getuserPlace = async (id) => {
    try {
      if (!id) {
        return;
      }
      axios
        .get(`${url}/places/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          setPlace(response.data);
          setIsLoading(false);
        });
    } catch (err) {
      swal({
        title: "Try Again!",
        text: "server is down!",
        icon: "error",
        button: "Ok!",
      });
    }
  };

  const deleteplace = async (id) => {
    try {
      const res = await fetch(`${url}/hosting/deleteplace/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          token: authToken,
        },
      });
      const data = await res.json();

      if (res.status === 400 || !data) {
        swal({
          title: "Try Again!",
          text: "error",
          icon: "error",
          button: "Ok!",
        });
      } else {
        swal({
          title: "Deleted!",
          text: "Deleted Successfully !",
          icon: "success",
          button: "Ok!",
        });
        navigate("/profile/places");
      }
    } catch (error) {
      swal({
        title: "Server is down!",
        text: "error",
        icon: "error",
        button: "Ok!",
      });
    }
  };

  useEffect(() => {
    if (!islogin) {
      swal({
        title: "Login Required!",
        text: "Go to Login Page!",
        icon: "error",
        button: "Ok!",
      });
      navigate("/login");
    } else {
      getuserPlace(id);
    }
  }, [id]);

  if (!place) return "";

  return (
    // <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8 section">
    <div className="p-8 mx-8 relative section">
      {isLoading ? (
        <div
          className="circle"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : place.length === 0 ? (
        <>
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="text-center">
                  <h1>No Data Found</h1>
                  <p>
                    Sorry, there is no data available to display at the moment.
                  </p>
                  <Link
                    to={`/profile/places`}
                    className="bg-primary text-white px-4 py-2 rounded"
                  >
                    Back to MyAccommodations
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl">{place.title}</h1>
            <div>
              <Link
                to={`/profile/places`}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Back to MyAccommodations
              </Link>
              <button
                className="bg-primary text-white px-4 py-1 rounded ml-2"
                onClick={() => deleteplace(place._id)}
              >
                Delete This Place
              </button>
            </div>
          </div>
          <AddressLink className="block">{place.address}</AddressLink>

          <PlaceGallery place={place} />
          <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
            <div>
              <div className="my-4">
                <h2 className="font-semibold text-2xl">Description</h2>
                {place.description}
              </div>
              Check-in: {place.checkIn}
              <br />
              Check-out: {place.checkOut}
              <br />
              Max number of guests: {place.maxGuests}
              <br />
              Place Type: {place.placetype}
            </div>
          </div>
          <div className="bg-white -mx-8 px-8 py-8 border-t">
            <div>
              <h2 className="font-semibold text-2xl">Extra info</h2>
            </div>
            <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
              {place.extraInfo}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
