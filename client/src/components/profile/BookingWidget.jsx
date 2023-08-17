import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { url } from "../../utils/Constants";
import { UserContext } from "../../context/UserContext.jsx";
import swal from "sweetalert";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");

  const { islogin, setIslogin, user } = useContext(UserContext);
  const authToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  const isFormValid =
    checkIn &&
    checkOut &&
    name &&
    phone &&
    numberOfGuests > 0 &&
    numberOfNights > 0;
  async function bookThisPlace() {
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
        const response = await axios.post(
          `${url}/booking/bookings`,
          {
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            place: place._id,
            placeowner: place.owner,
            price: numberOfNights * place.price,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              token: authToken,
            },
          }
        );
        const bookingId = response.data._id;
        setRedirect(`/profile/bookings/${bookingId}`);
      } catch (err) {
        swal({
          title: "Try Again!",
          text: "server is down!",
          icon: "error",
          button: "Ok!",
        });
      }
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ₹{place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
          />
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </div>
        )}
      </div>
      {/* <button onClick={bookThisPlace} className="primary mt-4" disabled={!isFormValid}>
        Book this place
        {numberOfNights > 0 && <span> ₹{numberOfNights * place.price}</span>}
      </button> */}

      {place.isbooked ? (
        <button
        disabled={true}
          className="btn btn-primary btn-sm"
          style={{ background: "#534173", borderColor: "#534173" }}
        >
          Already Booked!
        </button>
      ) : (
        <button
          onClick={bookThisPlace}
          className="primary mt-4"
          disabled={!isFormValid}
        >
          Book this place
          {numberOfNights > 0 && <span> ₹{numberOfNights * place.price}</span>}
        </button>
      )}
    </div>
  );
}
