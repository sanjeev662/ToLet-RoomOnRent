// import React, { useState } from "react";

// const MyMarker = ({ text, tooltip, $hover,price,placetype }) => {
//   const [showInfo, setShowInfo] = useState(false);

//   const handleClick = () => {
//     setShowInfo(!showInfo);
//   };

//   const handleClose = () => {
//     setShowInfo(false);
//   };

//   return (
//     <div className={showInfo ? "circles hover" : "circles"} onClick={handleClick}>
//       <span className="circlesText" title={tooltip}></span>
//       {showInfo && (
//         <div className="infoTab">
//           <div className="card">
//                   <label>Place</label>
//                   <h4 className="place">{tooltip}</h4>
//                   <label>Type</label>
//                   <p className="desc">{placetype}</p>
//                   <lable>Price</lable>
//                   <span className="date">RS. {price}</span>
//                   <button onClick={handleClose}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyMarker;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const MyMarker = ({ text, tooltip, $hover, price, placetype, isbooked }) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleClick = () => {
    setShowInfo(!showInfo);
  };

  const handleClose = () => {
    setShowInfo(false);
  };

  return (
    <div
      className={showInfo ? "circles hover" : "circles"}
      onClick={handleClick}
    >
      <span className="circlesText" title={tooltip}></span>
      {showInfo && (
        <div className="infoTab">
          <div
            className="card"
            style={{
              width: "200px",
              height: "170px",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            <div className="card-header d-flex justify-content-end">
              <button
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>
            <div className="card-body" style={{ padding: "8px" }}>
              <h3 className="card-title" style={{ fontSize: "20px" }}>
                {tooltip}
              </h3>
              <hr style={{ margin: "8px 0" }} />
              <p className="card-text" style={{ margin: "3px 0" }}>
                Type: {placetype}
              </p>
              <p className="card-text" style={{ margin: "3px 0px 5px 0px" }}>
                Price: {price}
              </p>
              {/* <Link to={`/detail/${text}`} className="btn btn-primary" style={{padding:"2px"}}>
              View Details
            </Link> */}
              {isbooked ? (
                <button
                  disabled={true}
                  className="btn btn-primary btn-sm"
                  style={{ background: "#534173", borderColor: "#534173" }}
                >
                  Already Booked!
                </button>
              ) : (
                <Link to={`/detail/${text}`}>
                  <button className="btn btn-primary btn-sm">
                    View Details
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMarker;
