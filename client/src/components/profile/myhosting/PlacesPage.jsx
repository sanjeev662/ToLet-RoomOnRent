import { Link, useParams, useNavigate } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { url } from "../../../utils/Constants";
import { UserContext } from "../../../context/UserContext.jsx";
import swal from "sweetalert";

import CircularProgress from "@mui/material/CircularProgress";

export default function PlacesPage() {
  const [places, setPlaces] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem("token");
  const { islogin, setIslogin } = useContext(UserContext);
  const navigate = useNavigate();

  const getplacesData = async () => {
    
    try {
      axios
        .get(`${url}/hosting/user-places`, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            token: authToken,
          },
        })
        .then(({ data }) => {
          setPlaces(data);
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
      getplacesData();
    }
  }, []);

  return (
    <div className="section">
      <AccountNav />
      <div className="text-center">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={"/profile/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
          Add new place
        </Link>
      </div>
      <div className="mx-4 my-4 p-2 outer-border ">
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
        ) : !places ? (
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="text-center d-grid" style={{ gap: "6px" }}>
                  <h1>
                    <strong>Error!</strong>
                  </h1>
                  <p>Sorry, Failed to Load !</p>
                </div>
              </div>
            </div>
          </div>
        ) : places.length === 0 ? (
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="text-center d-grid" style={{ gap: "6px" }}>
                  <h1>No Data Found</h1>
                  <p>
                    Sorry, there is no data available to display at the moment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          places.map((place) => (
            <div className="shadow-0 border rounded-3 card mx-4 mt-4 mb-2">
              <div className="card-body px-4 py-4">
                <div className="row">
                  <div className="col-md-12 col-lg-3 mb-4 mb-lg-0">
                    <div className="bg-image rounded hover-zoom hover-overlay ripple">
                      <img
                        src={
                          place.photos && place.photos.length > 0
                            ? place.photos[0]
                            : require("./hotel1.jpg")
                        }
                        fluid
                        className="w-100"
                        alt={
                          place.photos && place.photos.length > 0
                            ? "place Photo"
                            : "Default place Photo"
                        }
                      />
                      <div
                        className="mask"
                        style={{
                          backgroundColor: "rgba(251, 251, 251, 0.15)",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5>{place.title}</h5>
                    <div className="d-flex flex-row">
                      <div className="text-danger mb-1 me-2">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <span>310</span>
                    </div>
                    <div className="mt-1 mb-0 text-muted small">
                      <span>
                        {place.perks &&
                          place.perks.length > 0 &&
                          place.perks.join(" • ")}
                      </span>
                      <br />
                    </div>
                    <div className="mb-2 text-muted small">
                      <span>Owner</span>
                      <span className="text-primary"> : </span>
                      <span>{place.ownername}</span>
                      <br />
                    </div>
                    <p className="text-truncate mb-4 mb-md-0">
                      {place.description}
                    </p>
                  </div>
                  <div className="col-md-6 col-lg-3 border-sm-start-none border-start">
                    <div className="d-flex flex-row align-items-center mb-1">
                      <h4 className="me-1">₹{place.price}</h4>
                      <span className="text-danger">
                        <s>₹{place.price + 20}</s>
                      </span>
                    </div>
                    <h6 className="text-success">{place.address}</h6>
                    <div className="d-flex flex-column mt-4">
                      <Link to={`/place/${place._id}`}>
                        <button className="btn btn-primary btn-sm">
                          Details
                        </button>
                      </Link>

                      <button className="btn btn-outline-primary btn-sm mt-2">
                        <Link to={"/profile/places/" + place._id}>
                          Update Data
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
