import React from "react";
import "../assets/styles/footer.css";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn, FaFacebookF, FaGoogle } from "react-icons/fa";

function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  return (
    <div className="footer">
      <div className="footer-copywright">
        <h3>Designed and Developed by Sanjeev</h3>
      </div>
      <div className="footer-copywright">
        <h3>Copyright © {year} SS</h3>
      </div>
      <div className="footer-body">
        <ul className="footer-icons">
          <li className="social-icons">
            <a
              href="https://github.com/sanjeev662"
              style={{ color: "white" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiFillGithub />
            </a>
          </li>
          <li className="social-icons">
            <a
              href="https://www.twitter.com/"
              style={{ color: "white" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiOutlineTwitter />
            </a>
          </li>
          <li className="social-icons">
            <a
              href="https://www.linkedin.com/in/sanjeev662"
              style={{ color: "white" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn />
            </a>
          </li>
          <li className="social-icons">
            <a
              href="https://www.instagram.com/"
              style={{ color: "white" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiFillInstagram />
            </a>
          </li>
          <li className="social-icons">
            <a
              href="https://www.facebook.com/"
              style={{ color: "white" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
          </li>
          <li className="social-icons">
            <a
              href="mailto:sanjeevsinghkaushik662@gmail.com/"
              style={{ color: "white" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGoogle />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
