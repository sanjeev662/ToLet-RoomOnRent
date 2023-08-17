import AccountNav from "../AccountNav";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { Link,useNavigate } from "react-router-dom";
import BookingDates from "./BookingDates";
import { url } from "../../../utils/Constants";
import CircularProgress from "@mui/material/CircularProgress";
import {UserContext} from "../../../context/UserContext.jsx";
import swal from "sweetalert";

export default function BookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem("token");
  const { islogin,setIslogin} = useContext(UserContext);
  const navigate = useNavigate();


  const cancelbooking = async (id) => {
    try {
      const res = await fetch(`${url}/booking/cancelbooking/${id}`, {
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
          title: "Error!" ,
          text: data.message,
          icon: "error",
          button: "Ok!",
        });
      } else {
        swal({
          title: "Success!" ,
          text: "Booking Cancelled Successfully!",
          icon: "success",
          button: "Ok!",
        });
        getBookings();
      }
    } catch (error) {
      swal({
        title: "Server is down!" ,
        text: "error",
        icon: "error",
        button: "Ok!",
      });
    }
  };

  const getBookings = async () => {
    try{
    axios
      .get(`${url}/booking/allbookings`, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          token: authToken,
        },
      })
      .then((response) => {
        setBookings(response.data);
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
        title: "Login Required!" ,
        text: "Go to Login Page!",
        icon: "error",
        button: "Ok!",
      });
      navigate("/login");
    } else {
    getBookings();
    }
  }, []);

  return (
    <div className="section">
      <AccountNav />
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
          ) : !bookings ? ( 
            <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
              <div className="text-center d-grid" style={{gap:"6px"}}>
                <h1><strong>Error!</strong></h1>
                  <p>
                    Sorry, Failed to Load !
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="container mt-5">
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <div className="text-center d-grid" style={{gap:"6px"}}>
                      <h1>No Data Found</h1>
                      <p>
                        Sorry, there is no data available to display at the
                        moment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
        ) : (
          bookings.map((booking) => (
            <div className="shadow-0 border rounded-3 card mx-4 mt-4 mb-2">
              <div className="card-body px-4 py-4">
                <div className="row">
                  <div className="col-md-12 col-lg-3 mb-4 mb-lg-0">
                    <div className="bg-image rounded hover-zoom hover-overlay ripple">
                      <PlaceImg place={booking.place} />
                      <div
                        className="mask"
                        style={{
                          backgroundColor: "rgba(251, 251, 251, 0.15)",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5>{booking.place.title}</h5>
                    <div className="d-flex flex-row">
                      <BookingDates
                        booking={booking}
                        className="mb-2 mt-4 text-gray-500"
                      />
                    </div>
                    <div className="mt-1 mb-0 text-muted small">
                      <span>
                        {booking.place.perks &&
                          booking.place.perks.length > 0 &&
                          booking.place.perks.join(" • ")}
                      </span>
                      <br />
                    </div>
                    <div className="mb-2 text-muted small">
                      <span>Owner</span>
                      <span className="text-primary"> : </span>
                      <span>{booking.place.ownername}</span>
                      <br />
                    </div>
                    <p className="text-truncate mb-4 mb-md-0">
                      {booking.place.description}
                    </p>
                  </div>
                  <div className="col-md-6 col-lg-3 border-sm-start-none border-start">
                    <div className="d-flex flex-row align-items-center mb-1">
                      <h4 className="me-1">₹{booking.price}</h4>
                      <span className="text-danger">
                        <s>₹{booking.price+20}</s>
                      </span>
                    </div>
                    <h6 className="text-success">{booking.place.address}</h6>
                    <div className="d-flex flex-column mt-4">
                      <Link to={`/profile/bookings/${booking._id}`}>
                        <button className="btn btn-primary btn-sm">
                          Details
                        </button>
                      </Link>

                      <button
                        className="btn btn-outline-primary btn-sm mt-2"
                        onClick={() => cancelbooking(booking._id)}
                      >
                        Cancel Booking
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
