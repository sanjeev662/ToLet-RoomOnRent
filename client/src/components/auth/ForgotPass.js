import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import TestimonialSlider from "../testimonial/TestimonialSlider";
import { url } from "../../utils/Constants";

const ForgotPass = (props) => {
  const [credentials, setCredentials] = useState({
    email: props.email,
    password: "",
    authcode: null,
  });

  let history = useNavigate();
  const [sendOtp, setSendOtp] = useState(false);
  const [errors, setErrors] = useState({});

  const onChange = (event) => {
    if (event.target.name === "authcode") {
      const authcodeValue = event.target.value.substring(0, 6);
      setCredentials({ ...credentials, [event.target.name]: authcodeValue });
    } else {
      setCredentials({
        ...credentials,
        [event.target.name]: event.target.value,
      });
    }
  };

  const sendMail = async (event) => {
    event.preventDefault();
    if (validateMail()) {
      try {
        const response = await fetch(`${url}/fogotpassword/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ email: credentials.email }),
          mode: "cors",
          referrerPolicy: "origin-when-cross-origin",
        });
        const json = await response.json();

        if (json.success === true) {
          swal({
            title: "Good job!",
            text: "mail sent successfully!",
            icon: "success",
            button: "Ok!",
          });
          setSendOtp(true);
        } else {
          swal({
            title: "Try Again!",
            text: "error",
            icon: "error",
            button: "Ok!",
          });
          setSendOtp(false);
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch(`${url}/fogotpassword/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            authcode: Number(credentials.authcode),
          }),
          mode: "cors",
          referrerPolicy: "origin-when-cross-origin",
        });
        const json = await response.json();

        if (json.success === true) {
          swal({
            title: "Success!",
            text: "password changed successfully",
            icon: "success",
            button: "Ok!",
          });
          history("/login");
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
    }
  };

  /////////////////////////// form validation/////////////////////////////
  /////////////////////////// form validation/////////////////////////////

  const validateMail = () => {
    let errors = {};
    let isValid = true;

    if (!credentials.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!credentials.authcode) {
      errors.authcode = "authcode is required";
      isValid = false;
    } else if (credentials.authcode?.length != 6) {
      errors.authcode = "authcode must be of 6 characters";
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

  //for toggle button to show password tried but failed null error

  // useEffect(() => {
  //   const ShowPasswordToggle = document.querySelector("[type='password']");
  //   const togglePasswordButton = document.getElementById("toggle-password");
  //   const passwordInput = document.querySelector("[type='password']");

  //   ShowPasswordToggle.onclick = function() {
  //     document.querySelector("[type='password']").classList.add("input-password");
  //     document.getElementById("toggle-password").classList.remove("d-none");
  //     const passwordInput = document.querySelector("[type='password']");
  //     const togglePasswordButton = document.getElementById("toggle-password");
  //     togglePasswordButton.addEventListener("click", togglePassword);
  //   };

  //   const togglePassword = () => {
  //     if (passwordInput.type === "password") {
  //       passwordInput.type = "text";
  //       togglePasswordButton.setAttribute("aria-label", "Hide password.");
  //     } else {
  //       passwordInput.type = "password";
  //       togglePasswordButton.setAttribute(
  //         "aria-label",
  //         "Show password as plain text. " +
  //           "Warning: this will display your password on the screen."
  //       );
  //     }
  //   }
  // }, []);

  return (
    <div className="container-fluid d-flex px-0 section">
      <section className="left-panel">
        <TestimonialSlider />
      </section>
      <section className="right-panel">
        <div className="main-heading">Forgot Password?</div>
        <div className="regular-text">
          {sendOtp === false
            ? "Enter the email associated with your account and we'll send an email with instructions to reset the password."
            : "Mail with verification code send to your email-ID set new password with otp verification"}
        </div>
        <div className="sep" />
        <div className="page-form">
          {sendOtp === false ? (
            <form onSubmit={sendMail}>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">
                  Please provide your email address
                  <span className="required">*</span>
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
              <div className="form-settings d-flex justify-content-end">
                <div className="text-end">
                  <span className="regular-text">Remember your Password?</span>
                  <br />
                  <Link to="/login">Back to login</Link>
                </div>
              </div>
              <div className="pt-3" />
              <div className="form-button">
                <button type="submit" className="btn btn-primary">
                  Reset Password
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">
                  Verification Code<span className="required">*</span>
                </label>
                <input
                  type="Number"
                  className="form-control"
                  id="exampleInputauthcode1"
                  aria-describedby="authcodeHelp"
                  placeholder="Enter authcode"
                  value={credentials.authcode}
                  onChange={onChange}
                  name="authcode"
                />
                {errors.authcode && (
                  <span style={{ color: "red", fontSize: "small" }}>
                    {errors.authcode}
                  </span>
                )}
              </div>

              <label htmlFor="exampleInputPassword1">
                Set New Password<span className="required">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword"
                required
                minLength={8}
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
              <div className="pt-3" />
              <div className="form-button">
                <button type="submit" className="btn btn-primary">
                  Reset Password
                </button>
              </div>
              <div className="pt-3" />
            </form>
          )}

          <div className="regular-text text-center">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgotPass;
