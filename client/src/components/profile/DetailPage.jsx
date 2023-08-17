import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import BookingWidget from "./BookingWidget";
import PlaceGallery from "./PlaceGallery";
import AddressLink from "./AddressLink";
import { url } from "../../utils/Constants";
import CircularProgress from "@mui/material/CircularProgress";
import { UserContext } from "../../context/UserContext.jsx";
import swal from "sweetalert";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem("token");
  const { islogin, setIslogin, setSelectedChat, setChats, chats } =
    useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      return;
    }
    try {
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
  }, [id]);

  if (!place) return "";

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
                    to={`/`}
                    className="bg-primary text-white px-4 py-2 rounded"
                  >
                    Back to Home
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
                to={`/${place.placetype.toLowerCase()}`}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Back to Listing
              </Link>
              <button
                onClick={() => accessChat(place.owner)}
                className="bg-primary text-white px-4 py-1 rounded ml-2"
              >
                Talk to Owner
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
              <br />
              Owner Name: {place.ownername}
            </div>
            <div>
              <BookingWidget place={place} />
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
