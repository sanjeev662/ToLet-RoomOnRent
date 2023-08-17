import {useContext, useState,useEffect} from "react";
import {UserContext} from "../../context/UserContext.jsx";
import swal from "sweetalert";
import {Link, Navigate, useParams,useNavigate} from "react-router-dom";
import axios from "axios";
import PlacesPage from "./myhosting/PlacesPage";
import AccountNav from "./AccountNav";
import "../../assets/styles/profile.css";


export default function ProfilePage() {
  const navigate = useNavigate();
  const [redirect,setRedirect] = useState(null);
  const { islogin,setIslogin,username} = useContext(UserContext);

  let {subpage} = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    swal({
      title: "You have LoggedOut Successfully!" ,
      text: "Go to Login Page!",
      icon: "success",
      button: "Ok!",
    });
    navigate("/login");
    setIslogin(false);
  };

  useEffect(() => {
    // if (!islogin) {
      if (!(localStorage.getItem("userInfo"))) {
      swal({
        title: "Login Required!" ,
        text: "Go to Login Page!",
        icon: "error",
        button: "Ok!",
      });
      navigate("/login");
    }
  }, []);

  return (
    <div className="section">
      <AccountNav/>
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          {/* Logged in as {user.name} ({user.email})<br /> */}
          Logged in as {username}<br />
          <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
        </div>
      )}
      {subpage === 'places' && (
        <PlacesPage />
      )}
    </div>
  );
}