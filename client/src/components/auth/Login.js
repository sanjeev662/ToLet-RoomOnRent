import React, { useState, useEffect,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import swal from "sweetalert";
import TestimonialSlider from "../testimonial/TestimonialSlider";
import { url } from "../../utils/Constants";
import OAuth2Login from "react-simple-oauth2-login";

import {UserContext} from "../../context/UserContext.jsx";

const Login = (props) => {

  const {setIslogin} = useContext(UserContext);

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let history = useNavigate();
  const [googleID, setGoogleID] = useState(0);
  const [signUpReq, setSignUpReq] = useState(false);
  const [errors, setErrors] = useState({});

  const [facebookId, setFacebookId] = useState(0);
  const [signUpFbReq, setSignUpFbReq] = useState(false);

  const onChange = (event) => {
    if (event.target.name === "phone") {
      const phoneValue = event.target.value.substring(0, 10);
      setCredentials({ ...credentials, [event.target.name]: phoneValue });
    }  else {
      setCredentials({
        ...credentials,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch(
          `${url}/auth/signin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            mode: "cors",
            referrerPolicy: "origin-when-cross-origin",
          }
        );
        const json = await response.json();

        if (json.success === true) {
          swal({
            title: "Welcome!",
            text: "Logged in Successfully",
            icon: "success",
            button: "Ok!",
          });
          await localStorage.setItem("token", json.authToken);
          await localStorage.setItem("userInfo",JSON.stringify(json));
          setIslogin(true);
          history("/");
        } else {
          swal({
            title: "Try Again!",
            text: "error",
            icon: "error",
            button: "Ok!",
          });
        }
      } catch (err) {
        swal({
          title: "Try Again!",
          text: "server routing error!",
          icon: "error",
          button: "Ok!",
        });
      }
    }
  };

  const handleCallbackResponse = async (response) => {
    try{
    // getting the jwt token and setting userObject as it response
    // //console.log("JWT ID TOKEN: ", response.credential);
    var userObject = await jwt_decode(response.credential);

    setCredentials({
      email: userObject.email,
      fname: userObject.given_name,
      lname: userObject.family_name,
    });
    setGoogleID(userObject.sub);

    const res = await fetch(
      `${url}/oauth/google/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ googleId: userObject.sub }),
        mode: "cors",
        referrerPolicy: "origin-when-cross-origin",
      }
    );

    const json = await res.json();
    // //console.log(json);

    if (json.requireSignup === false) {
      await localStorage.setItem("token", json.authToken);
      await localStorage.setItem("userInfo",JSON.stringify(json));
      setIslogin(true);
      history("/");
    } else {
      setSignUpReq(true);
    }
  } catch (err) {
    swal({
      title: "Try Again!",
      text: "server is down!",
      icon: "error",
      button: "Ok!",
    });
  }
  };

  const handleFacebookResponse = async (response) => {
    try {
    const accessToken = response.access_token;
    const result = await fetch(
      `https://graph.facebook.com/v12.0/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`
    );
    const profile = await result.json();

    const fullName = profile.name;
    const [firstName, lastName] = fullName.split(" ");

    setCredentials({
      fname: firstName,
      lname: lastName,
      email: profile.email,
    });
    setFacebookId(profile.id);

    const res = await fetch(`${url}/oauth/facebook/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ facebookId: profile.id }),
      mode: "cors",
      referrerPolicy: "origin-when-cross-origin",
    });

    const json = await res.json();
    // //console.log(json);

    if (json.requireSignup === false) {
      swal({
        title: "Welcome!",
        text: "Logged in Successfully",
        icon: "success",
        button: "Ok!",
      });
      await localStorage.setItem("token", json.authToken);
      await localStorage.setItem("userInfo",JSON.stringify(json));
      setIslogin(true);
      history("/");
    } else {
      swal({
        title: "Verified!",
        text: "Continue to Register",
        icon: "success",
        button: "Continue!",
      });
      setSignUpFbReq(true);
      history("/login");
    }
  } catch (err) {
    swal({
      title: "Try Again!",
      text: "server is down!",
      icon: "error",
      button: "Ok!",
    });
  }
  };

  const handleGoogleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${url}/oauth/google/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            fname: credentials.fname,
            lname: credentials.lname,
            phone: credentials.phone,
            email: credentials.email,
            googleId: googleID,
          }),
          mode: "cors",
          referrerPolicy: "origin-when-cross-origin",
        }
      );
      const json = await response.json();

      if (json.success === true) {
        swal({
          title: "Welcome!",
          text: "Logged in Successfully",
          icon: "success",
          button: "Ok!",
        });
        await localStorage.setItem("token", json.authToken);
        await localStorage.setItem("userInfo",JSON.stringify(json));
        setIslogin(true);
        history("/");
      } else {
        swal({
          title: "Try Again!",
          text: "error",
          icon: "error",
          button: "Ok!",
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
  };

    //for Facebook submit
    const handleFacebookSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await fetch(`${url}/oauth/facebook/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            fname: credentials.fname,
            lname: credentials.lname,
            phone: credentials.phone,
            email: credentials.email,
            facebookId: facebookId,
          }),
          mode: "cors",
          referrerPolicy: "origin-when-cross-origin",
        });
        const json = await response.json();
  
        if (json.success === true) {
          swal({
            title: "Success!",
            text: "Account Created Successfully",
            icon: "success",
            button: "Ok!",
          });
          await localStorage.setItem("token", json.authToken);
          await localStorage.setItem("userInfo",JSON.stringify(json));
          setIslogin(true);
          history("/");
        } else {
          swal({
            title: "Try Again!",
            text: "error",
            icon: "error",
            button: "Ok!",
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
    };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      history("/");
    }

    /* global google */
    const initGAuth = async () => {
      await google.accounts.id.initialize({
        client_id:
        "732128756874-psijih5njkbsr2l62rlf303n9l0173pv.apps.googleusercontent.com",
        callback: handleCallbackResponse,
      });

      await google.accounts.id.renderButton(
        document.getElementById("googlebtn"),
        {
          theme: "outline",
          size: "large",
          longtitle: true,
        }
      );
    };

    initGAuth();
  }, []);

  //for password to show
  
  useEffect(() => {
    const ShowPasswordToggle = document.querySelector("[type='password']");
    const togglePasswordButton = document.getElementById("toggle-password");
    const passwordInput = document.querySelector("[type='password']");
    
    ShowPasswordToggle.onclick = function() {
      document.querySelector("[type='password']").classList.add("input-password");
      document.getElementById("toggle-password").classList.remove("d-none");
      const passwordInput = document.querySelector("[type='password']");
      const togglePasswordButton = document.getElementById("toggle-password");
      togglePasswordButton.addEventListener("click", togglePassword);
    };

    const togglePassword = () => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePasswordButton.setAttribute("aria-label", "Hide password.");
      } else {
        passwordInput.type = "password";
        togglePasswordButton.setAttribute(
          "aria-label",
          "Show password as plain text. " +
            "Warning: this will display your password on the screen."
        );
      }
    }
  }, []);

  /////////////////////////// form validation/////////////////////////////
  /////////////////////////// form validation/////////////////////////////

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!credentials.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    if (!credentials.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (credentials.password?.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

   /////////////////////////// form validation ended here/////////////////////////////
  /////////////////////////// form validation ended here/////////////////////////////

  return (
    <div className="container-fluid d-flex px-0 section">
      <section className="left-panel">
        <TestimonialSlider />
      </section>
      <section className="right-panel">
        <div className="main-heading">Welcome Back</div>
        <div className="regular-text">Please enter your details to login</div>
        <div className="sep" />
        <div className="page-form">
          {signUpReq === true ? (
            <form onSubmit={handleGoogleSubmit}>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">
                  Phone<span className="required">*</span>
                </label>
                <input
                  type="Number"
                  className="form-control"
                  id="exampleInputPhone"
                  aria-describedby="emailHelp"
                  placeholder="Enter phone number"
                  value={credentials.phone}
                  onChange={onChange}
                  name="phone"
                />
              </div>
              <div className="form-group">
                <div className="pt-3" />
                <div className="form-button">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </form>
             ) : signUpFbReq === true ? (
              <form onSubmit={handleFacebookSubmit}>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">
                    Phone<span className="required">*</span>
                  </label>
                  <input
                    type="Number"
                    className="form-control"
                    id="exampleInputPhone"
                    aria-describedby="emailHelp"
                    placeholder="Enter phone number"
                    value={credentials.phone}
                    onChange={onChange}
                    name="phone"
                  />
                  {errors.phone && (
                    <span style={{ color: "red", fontSize: "small" }}>
                      {errors.phone}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <div className="pt-3" />
                  <div className="form-button">
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </form>
          ) : (
            <>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">
                    Email<span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    value={credentials.email}
                    onChange={onChange}
                    name="email"
                  />
                  {errors.email && (
                    <span style={{ color: "red", fontSize: "small" }}>
                      {errors.email}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword1">
                    Password<span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={onChange}
                    name="password"
                  />
                  {errors.password && (
                    <span style={{ color: "red", fontSize: "small" }}>
                      {errors.password}
                    </span>
                  )}
                  <button
                    id="toggle-password"
                    type="button"
                    className="d-none"
                    aria-label="Show password as plain text. Warning: this will display your password on the screen."
                  />
                </div>
                <div className="form-settings d-flex justify-content-between">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="exampleCheck1"
                    />
                    <label className="form-check-label" htmlFor="exampleCheck1">
                      Remember Me
                    </label>
                  </div>
                  <div>
                    <Link to="/forgotpassword">Forgot Password?</Link>
                  </div>
                </div>
                <div className="pt-3" />
                <div className="form-button">
                  <button type="submit" className="btn btn-primary ">
                    Login
                  </button>
                </div>
              </form>
              <div className="small-text pt-3 pb-3 text-center">
                Or continue with
              </div>
              <div className="social-buttons d-flex justify-content-between pb-3">
                <a href="/" id="googlebtn" className="social-icon">
                  <i className="fa-brands fa-google fa-lg" />
                </a>
                <OAuth2Login
                    className="social-icon"
                    authorizationUrl="https://www.facebook.com/v12.0/dialog/oauth"
                    responseType="token"
                    clientId="303882562045636"
                    redirectUri="https://to-let-room-on-rent.vercel.app/"
                    scope="public_profile"
                    onSuccess={handleFacebookResponse}
                >
                  <i className="fa-brands fa-facebook fa-lg" />
                </OAuth2Login>
              </div>
            </>
          )}
              <div className="regular-text text-center">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
