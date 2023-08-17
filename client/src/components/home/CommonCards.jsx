import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/styles/commoncards.css";
import { AiOutlineRight } from "react-icons/ai";

import { UserContext } from "../../context/UserContext.jsx";

const CommonCards = ({ images, heading, content, type, link }) => {

  const { setFilterData, filterData } = useContext(UserContext);
  const navigate = useNavigate();

  const handleUpdatePlacetypeAddress = (link, addresses, placetypes) => {
    setFilterData((prevState) => ({
      ...prevState,
      address: addresses,
      placetype: placetypes,
    }));
    navigate(link);
  };

  return (
    <section className={`hiringchallenges-cards card-cont`}>
      <div className="common-cards-container container">
        <h2>{heading}</h2>
        <div className="common-cards-content">
          <p>{content}</p>
        </div>
        <div className="common-cards-images">
          {images.slice(0, 3).map((ele) => {
            return (
              <div
                className={`common-cards-image hiringchallenges`}
                key={ele.image}
              >
                <button
                  onClick={() =>
                    handleUpdatePlacetypeAddress(ele.link, ele.address, type)
                  }
                >
                  <img src={ele.image} alt={ele.title} />
                  <span className="form-button">
                    <strong className="p-1 btn btn-primary btn-sm">
                      {ele.title}
                    </strong>
                  </span>
                </button>
              </div>
            );
          })}

          <div className={`common-cards-image hiringchallenges-explore`}>
            <Link to={`./${type.toLowerCase()}`}>
              <span>Explore All</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommonCards;
