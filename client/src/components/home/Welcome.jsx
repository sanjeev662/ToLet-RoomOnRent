import React from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/welcome.css";

const JobPortalHero = () => {
  return (
    <section className="jobportal">
      <div className="jobportal-container container">
        <div className="jobportal-left">
          <div className="jobportal-left-top">
            <h1>
              Rooms, Flats
              <br /> & Hotel Near You
            </h1>
            <p>
              Check room Availibility and get your desired room on good price!
            </p>
          </div>
          <div className="jobportal-btns">
            <Link to={"./room"}>
              <button className="btn btn-primary btn-sm">
                Check Room Availibility
              </button>
            </Link>
            <Link to={"./profile/places"}>
              <button className="btn btn-outline-primary btn-sm ml-2">
                Post Room Availibility
              </button>
            </Link>
          </div>
        </div>
        <div className="jobportal-img">
          <img
            src={require("../../assets/media/images/hero.png")}
            alt="job postal hero"
          />
          <div className="speaker">
            <img
              src="https://d8it4huxumps7.cloudfront.net/uploads/images/63d74c0f70dbe_internships_icon.png?d=80x80"
              alt="Internships"
            />
            <div>
              1100+ <span> Rooms</span>
            </div>
          </div>
          <div className="building">
            <img
              src="https://d8it4huxumps7.cloudfront.net/uploads/images/63d74bc4b38e2_companies_icon.png?d=80x80"
              alt="Companies"
            />
            <div>
              1150+ <span> Flats </span>
            </div>
          </div>
          <div className="bag">
            <img
              src="https://d8it4huxumps7.cloudfront.net/uploads/images/63d74becd0c8f_job_icon.png?d=80x80"
              alt="bag"
            />
            <div>
              1230+ <span> Hotels</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobPortalHero;
