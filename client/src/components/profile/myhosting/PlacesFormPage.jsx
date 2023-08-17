import PhotosUploader from "../PhotosUploader.jsx";
import Perks from "../Perks.jsx";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useNavigate, Link, useParams } from "react-router-dom";
import { url } from "../../../utils/Constants";
import list from "../../../assets/data/cities.json";
import { UserContext } from "../../../context/UserContext.jsx";
import swal from "sweetalert";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [placetype, setPlacetype] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem("token");
  const {
    islogin,
    setIslogin,
    setLatitude,
    latitude,
    longitude,
    setLongitude,
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
        if (!id) {
          return;
        }
        axios
          .get(`${url}/places/` + id, {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              token: authToken,
            },
          })
          .then((response) => {
            const { data } = response;
            setTitle(data.title);
            setPlacetype(data.placetype);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
            setLatitude(data.latitude);
            setLongitude(data.longitude);
          });
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
  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    try {
      ev.preventDefault();
      const placeData = {
        title,
        address,
        placetype,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
        latitude,
        longitude,
      };
      if (id) {
        // update
        await axios.put(
          `${url}/hosting/update`,
          { id, ...placeData },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              token: authToken,
            },
          }
        );
        setRedirect(true);
      } else {
        // new place
        await axios.post(`${url}/hosting/upload`, placeData, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            token: authToken,
          },
        });
        setRedirect(true);
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

  if (redirect) {
    return <Navigate to={"/profile/places"} />;
  }

  return (
    <div className="section">
      <AccountNav />
      <form onSubmit={savePlace} className="py-2 px-5">
        {preInput("Add Map Location", "First Choose location from map")}
        <div className="flex gap-2">
          <div className="mapinput">
            <span>Latitude:{latitude}</span>&nbsp; &nbsp;
            <span>Longitude:{longitude}</span>
          </div>
          <button
            onClick={() => navigate("/map")}
            className="bg-gray-200 px-4 rounded-2xl"
          >
            GoTo&nbsp;Map
          </button>
        </div>

        {preInput("Address", "Address to this place")}
        <input
          list="data"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="choose.."
          className="form-select"
          name="dest"
        />
        <datalist id="data">
          {list.map((op, i) => (
            <option>
              {op.name} , {op.state}
            </option>
          ))}
        </datalist>

        {preInput(
          "Title",
          "Title for your place. should be short and catchy as in advertisement"
        )}
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="title, for example: My lovely apt"
        />
        {preInput(
          "Place Type",
          "Type of your place. should be name as room, hotel, flat"
        )}
        <select
          type="text"
          name="placetype"
          value={placetype}
          onChange={(ev) => setPlacetype(ev.target.value)}
          className="form-select"
        >
          <option value="">Select PlaceType</option>
          <option value="Hotel">Hotel</option>
          <option value="Room">Room</option>
          <option value="Flat">Flat</option>
        </select>

        {preInput("Photos", "more = better")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput("Description", "description of the place")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        {preInput("Perks", "select all the perks of your place")}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput("Extra info", "house rules, etc")}
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        {preInput(
          "Check in&out times",
          "add check in and out times, remember to have some time window for cleaning the room between guests"
        )}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input
              type="text"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              placeholder="14"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input
              type="text"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              placeholder="11"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
        </div>
        <button className="primary my-4">Save</button>
        <Link
          to={"/profile/places"}
          className="btn btn-outline-primary btn-sm mt-2"
        >
          Back
        </Link>
      </form>
    </div>
  );
}
