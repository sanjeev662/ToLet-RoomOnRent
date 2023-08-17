import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import MobileNav from "./layouts/MobileNav";
import Footer from "./layouts/Footer";
import Home from "./components/home/Home";
import Room from "./components/filter/Room";
import Flat from "./components/filter/Flat";
import Hotel from "./components/filter/Hotel";
import Map from "./components/map/Map";
import Saved from "./components/profile/saved/Saved";

import "../src/assets/styles/main.css";

import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import ForgotPass from "./components/auth/ForgotPass";
import { UserContextProvider } from "./context/UserContext";

import ProfilePage from "./components/profile/ProfilePage";
import PlacesPage from "./components/profile/myhosting/PlacesPage";
import BookingPage from "./components/profile/mybooking/BookingPage";
import BookingsPage from "./components/profile/mybooking/BookingsPage";
import PlacesFormPage from "./components/profile/myhosting/PlacesFormPage";
import PlacePage from "./components/profile/myhosting/PlacePage";
import DetailPage from "./components/profile/DetailPage";
import Bookedhosting from "./components/profile/bookedhosting/Bookedhosting";

import Error from "./layouts/Error";
import ComingSoon from "./layouts/ComingSoon";

import Chatpage from "./components/chats/chatpages/Chatpage";

function App() {
  return (
    <>
    
      <BrowserRouter>
      <UserContextProvider>
      <Navbar />
        <Routes>

          <Route path="/" element={<Home />}></Route>
          <Route path="/room" element={<Room/>}></Route>
          <Route path="/flat" element={<Flat />}></Route>
          <Route path="/hotel" element={<Hotel />}></Route>
          <Route path="/map" element={<Map />}></Route>

          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/forgotpassword" element={<ForgotPass />}></Route>

           <Route path="/profile/places" element={<PlacesPage />}></Route>
           <Route path="/place/:id" element={<PlacePage />}></Route>
           <Route path="/detail/:id" element={<DetailPage />}></Route>

           <Route path="/profile" element={<ProfilePage />}></Route>
           <Route path="/profile/places/new" element={<PlacesFormPage />}></Route>
           <Route path="/profile/places/:id" element={<PlacesFormPage />}></Route>
           <Route path="/profile/bookedhosting" element={<Bookedhosting />}></Route>

           <Route path="/profile/saved" element={<Saved />}></Route>
           <Route path="/profile/bookings/:id" element={<BookingPage />}></Route>
           <Route path="/profile/bookings" element={<BookingsPage />}></Route> 

           <Route path="/chats" element={<Chatpage/>}></Route>

          <Route path="*" element={<Error />}></Route>
          {/* <Route path="/map" element={<ComingSoon />}></Route> */}

        </Routes>
        <Footer/>
        <MobileNav />
        </UserContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
