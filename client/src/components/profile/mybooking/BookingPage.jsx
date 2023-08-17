import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "./BookingDates";
import { url } from "../../../utils/Constants";
import CircularProgress from "@mui/material/CircularProgress";
import { UserContext } from "../../../context/UserContext.jsx";
import swal from "sweetalert";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem("token");
  const {
    islogin,
    setIslogin,
    setSelectedChat,
    setChats,
    chats,
  } = useContext(UserContext);
  const navigate = useNavigate();

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
      try {
        if (id) {
          axios
            .get(`${url}/booking/allbookings`, {
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                token: authToken,
              },
            })
            .then((response) => {
              const foundBooking = response.data.find(({ _id }) => _id === id);
              if (foundBooking) {
                setBooking(foundBooking);
                setIsLoading(false);
              }
            });
        }
      } catch (err) {
        swal({
          title: "Try Again!",
          text: "server is down!",
          icon: "error",
          button: "Ok!",
        });
      }
    }
  }, [id]);

  if (!booking) {
    return "";
  }

  const accessChat = async (guestuserId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          token: localStorage.getItem("token"),
        },
      };
      const { data } = await axios.post(
        `${url}/chats`,
        { guestuserId },
        config
      );

      // if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      navigate("/chats");
    } catch (error) {
      swal({
        title: "Error Occured!",
        text: "Failed to Load the Chat",
        icon: "error",
        button: "Ok!",
      });
    }
  };

  return (
    <div className="section">
      <div className="p-8 mx-8 relative">
        <div className="flex justify-between items-center mb-4">
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
          ) : booking.length === 0 ? (
            <>
              <p>No More data available.</p>
              <Link
                to={`/profile/bookings`}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Back to MyBookings
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-3xl">{booking.place.title}</h1>
              <div>
                <Link
                  to={`/profile/bookings`}
                  className="bg-primary text-white px-4 py-2 rounded"
                >
                  Back to MyBookings
                </Link>
                <button
                  onClick={() => accessChat(booking.place.owner)}
                  className="bg-primary text-white px-4 py-1 rounded ml-2"
                >
                  Talk to Owner
                </button>
              </div>
            </>
          )}
        </div>
        <AddressLink className="block">{booking.place.address}</AddressLink>

        <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-4">Your booking information:</h2>
            <BookingDates booking={booking} />
          </div>
          <div className="bg-primary p-6 text-white rounded-2xl">
            <div>Total price</div>
            <div className="text-3xl">₹{booking.price}</div>
          </div>
        </div>
        <PlaceGallery place={booking.place} />
      </div>
    </div>
  );
}
