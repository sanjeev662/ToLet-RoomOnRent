import "../../../assets/styles/filter.css";
import AccountNav from "../AccountNav";
import React, { useEffect, useState, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { url } from "../../../utils/Constants";
import list from "../../../assets/data/cities.json";
import { UserContext } from "../../../context/UserContext.jsx";
import swal from "sweetalert";

import CircularProgress from "@mui/material/CircularProgress";

function Saved() {
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem("token");
  const { islogin, setIslogin } = useContext(UserContext);
  const navigate = useNavigate();

  const [filter, setFilter] = useState({
    address: "",
    placetype: "",
  });

  const [filterData, setFilterData] = useState({
    address: "",
    placetype: "",
  });

  const onChange = (event) => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFilterData(filter);
  };

  const handleReset = async (e) => {
    e.preventDefault();

    setFilter({
      address: "",
      placetype: "",
    });
    setFilterData({
      address: "",
      placetype: "",
    });

    await getData();
  };

  const removeFilter = async (f) => {
    setFilterData({ ...filterData, [f]: "" });
    setFilter({ ...filter, [f]: "" });
  };

  //for pagination
  //for pagination

  // const [data, setdata] = useState([]);
  const [saved, setSaved] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE_OPTIONS = [5, 10, 20];

  const handlePreviousPage = async () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = async () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageSizeChange = async (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  //for pagination only ended
  //for pagination only ended

  const getData = async () => {
    const req = `${url}/booking/savedplaces?page=${currentPage}&size=${pageSize}&address=${filterData.address}&placetype=${filterData.placetype}`;
    setIsLoading(true);
    try {
      const response = await fetch(req, {
        method: "GET",
        mode: "cors",
        referrerPolicy: "origin-when-cross-origin",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          token: authToken,
        },
      });

      const responseData = await response.json();

      if (response.status === 200) {
        setSaved(responseData.saveddata);
        setPageCount(responseData.Pagination.pageCount);
        setTotalCount(responseData.Pagination.count);
      }
    } catch (err) {
      swal({
        title: "Try Again!",
        text: "server is down!",
        icon: "error",
        button: "Ok!",
      });
    }
    setIsLoading(false);
  };

  const removedata = async (id) => {
    try {
      const res = await fetch(`${url}/booking/removesaved/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          token: authToken,
        },
      });
      const data = await res.json();

      if (res.status === 400 || !data) {
        swal({
          title: "Error!",
          text: "error at remove time",
          icon: "error",
          button: "Ok!",
        });
      } else {
        swal({
          title: "Removed!",
          text: "Data removed from wishlist!",
          icon: "success",
          button: "Ok!",
        });
        setIsLoading(true);
        getData();
      }
    } catch (error) {
      swal({
        title: "Server is down!",
        text: "error",
        icon: "error",
        button: "Ok!",
      });
    }
  };

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
      getData();
    }
  }, [currentPage, pageSize, filterData]);

  return (
    <div className="section">
      <AccountNav />
      <div className="container-fluid section">
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-10">
            <div className="mx-0 my-4 p-0 outer-border ">
              <form onSubmit={handleSubmit}>
                <div className="header-header">
                  <div className="header-title">Search For Saved</div>
                  <div className="header-utilBar">
                    <div className="autocomplete-searchBar">
                      <input
                        list="data"
                        name="address"
                        value={filter.address}
                        onChange={onChange}
                        className="autocomplete-search form-select"
                        type="text"
                        placeholder="Search by City"
                      />
                      <datalist id="data">
                        {list.map((op, i) => (
                          <option>
                            {op.name} , {op.state}
                          </option>
                        ))}
                      </datalist>
                    </div>

                    <div className="autocomplete-searchBar">
                      <select
                        name="placetype"
                        value={filter.placetype}
                        className="autocomplete-search form-select p-2"
                        onChange={onChange}
                        type="text"
                      >
                        <option value="">Placetype</option>
                        <option value="Hotel">Hotel</option>
                        <option value="Flat">Flat</option>
                        <option value="Room">Room</option>
                      </select>
                    </div>
                    <div className="header-divider"></div>

                    <div className="header-filters">
                      {/* <div className="d-flex justify-content-end">
                      <select
                        name="sort"
                        // value={filter.sort}
                        className="sortBy-filterButton p-1"
                        // onChange={onChange}
                      >
                        <option value="">Sort By</option>
                        <option value="Increasing-Price">Increasing Price</option>
                        <option value="Decreasing-Price">Decreasing Price</option>
                        <option value="Increasing Rating">Increasing Rating</option>
                        <option value="Decreasing-Rating">Decreasing Rating</option>
                      </select>
                      <select
                        name="price"
                        // value={filter.price}
                        className="sortBy-filterButton p-1 ml-2"
                        // onChange={onChange}
                      >
                        <option value="">Price Range</option>
                        <option value="100-500">100rs-500rs</option>
                        <option value="501-1000">500rs-1000rs</option>
                      </select>
                      <select
                        name="stay-duration"
                        // value={filter.stay-duration}
                        className="sortBy-filterButton p-1 ml-2"
                        // onChange={onChange}
                      >
                        <option value="">Stay Duration</option>
                        <option value="1-15">1days-15days</option>
                        <option value="15-30">15days-30days</option>
                      </select>
                    </div> */}
                      <div className="d-flex justify-content-end">
                        <a
                          href="#"
                          onClick={handleReset}
                          className="bg-primary text-white px-4 py-2 rounded"
                        >
                          Reset All
                        </a>
                        <button
                          name="submit"
                          className="bg-primary text-white px-4 py-1 rounded ml-2"
                        >
                          Filter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              <div className="px-4 pt-3">
                <b>Total {totalCount} options Available</b>
              </div>

              {/* card code */}
              {/* card code */}

              {isLoading ? (
                <div
                  className="circle"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </div>
                 ) : !saved ? ( 
                  <div className="container mt-5">
                  <div className="row justify-content-center">
                    <div className="col-md-6">
                    <div className="text-center d-grid" style={{gap:"6px"}}>
                      <h1><strong>Error!</strong></h1>
                        <p>
                          Sorry, Failed to Load !
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : saved.length === 0 ? (
                <div className="container mt-5">
                  <div className="row justify-content-center">
                    <div className="col-md-6">
                    <div className="text-center d-grid" style={{gap:"6px"}}>
                      <h1>No Data Found</h1>
                        <p>
                          Sorry, there is no data available to display at the
                          moment.
                        </p>
                        <Link
                          to="/"
                          className="btn btn-primary"
                        >
                          Add to Wishlist
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                saved.map((save) => (
                  <div className="shadow-0 border rounded-3 card mx-4 mt-4 mb-2">
                    <div className="card-body px-4 py-4">
                      <div className="row">
                        <div className="col-md-12 col-lg-3 mb-4 mb-lg-0">
                          <div className="bg-image rounded hover-zoom hover-overlay ripple">
                            <img
                              src={
                                save.photos && save.photos.length > 0
                                  ? save.photos[0]
                                  : require("./hotel1.jpg")
                              }
                              fluid
                              className="w-100"
                              alt={
                                save.photos && save.photos.length > 0
                                  ? "save Photo"
                                  : "Default save Photo"
                              }
                            />
                            <div
                              className="mask"
                              style={{
                                backgroundColor: "rgba(251, 251, 251, 0.15)",
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <h5>{save.title}</h5>
                          <div className="d-flex flex-row">
                            <div className="text-danger mb-1 me-2">
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                            </div>
                            <span>310</span>
                          </div>
                          <div className="mt-1 mb-0 text-muted small">
                            <span>
                              {save.perks &&
                                save.perks.length > 0 &&
                                save.perks.join(" • ")}
                            </span>
                            <br />
                          </div>
                          <div className="mb-2 text-muted small">
                            <span>Owner</span>
                            <span className="text-primary"> : </span>
                            <span>{save.ownername}</span>
                            <br />
                          </div>
                          <p className="text-truncate mb-4 mb-md-0">
                            {save.description}
                          </p>
                        </div>
                        <div className="col-md-6 col-lg-3 border-sm-start-none border-start">
                          <div className="d-flex flex-row align-items-center mb-1">
                            <h4 className="me-1">₹{save.price}</h4>
                            <span className="text-danger">
                              <s>₹{save.price + 20}</s>
                            </span>
                          </div>
                          <h6 className="text-success">{save.address}</h6>
                          <div className="d-flex flex-column mt-4">
                            {/* <Link to={`/detail/${save._id}`}>
                              <button className="btn btn-primary btn-sm">
                                Details
                              </button>
                            </Link> */}
                            {save.isbooked ? (
                              <button disabled={true} className="btn btn-primary btn-sm" style={{"background" : "#534173" ,
                              "borderColor" : "#534173"}}>
                                Already Booked!
                              </button>
                            ) : (
                              <Link to={`/detail/${save._id}`}>
                                <button className="btn btn-primary btn-sm">
                                  Details
                                </button>
                              </Link>
                            )}

                            <button
                              onClick={() => removedata(save._id)}
                              className="btn btn-outline-primary btn-sm mt-2"
                            >
                              Remove from wish list
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* card code ended*/}
              {/* card code ended*/}

              <div className="grid-size pb-2">
                <label htmlFor="pageSizeSelect">Page Size: </label>
                <select
                  id="pageSizeSelect"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid-contols p-4 pt-0">
                <button
                  disabled={currentPage === 1}
                  onClick={handlePreviousPage}
                >
                  Previous Page
                </button>
                <button
                  disabled={currentPage === pageCount}
                  onClick={handleNextPage}
                >
                  Next Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Saved;
