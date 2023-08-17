import "../../assets/styles/filter.css";
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { url } from "../../utils/Constants";
import list from "../../assets/data/cities.json";
import swal from "sweetalert";
import CircularProgress from "@mui/material/CircularProgress";

import {UserContext} from "../../context/UserContext.jsx";

function Hotel() {
  const [hotels, setHotels] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem("token");
  const {islogin,setIslogin,setFilterData,filterData} = useContext(UserContext);
  const navigate = useNavigate();

  const [filter, setFilter] = useState({
    address: "",
    placetype: "Hotel",
  });

  const [filterDatas, setFilterDatas] = useState({
    address: "",
    placetype: "Hotel",
  });

  const onChange = (event) => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFilterData(filter);
    setFilterDatas(filter);    
  };

  const handleReset = async (e) => {
    e.preventDefault();

    setFilter({
      address: "",
      placetype: "Hotel",
    });
    setFilterData({
      address: "",
      placetype: "Hotel",
    });

    await getData();
  };

  const removeFilter = async (f) => {
    setFilterData({ ...filterData, [f]: "" });
    setFilter({ ...filter, [f]: "" });
  };

  //for pagination
  //for pagination

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
    setIsLoading(true);
    try{
    const req = `${url}/places?page=${currentPage}&size=${pageSize}&address=${filterData.address}&placetype=hotel`;

    const response = await fetch(req, {
      method: "GET",
      mode: "cors",
      referrerPolicy: "origin-when-cross-origin",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    const responseData = await response.json();

    if (response.status === 200) {
      setHotels(responseData.placesdata);
      setPageCount(responseData.Pagination.pageCount);
      setTotalCount(responseData.Pagination.count);
    }
    
    setFilterData({
      address: "",
    });
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

  useEffect(() => {  
    getData();
  }, [currentPage, pageSize,filterDatas]);

  const addtosaved = async (id) => {
    if (!islogin) {
      swal({
        title: "Login Required!" ,
        text: "Go to Login Page!",
        icon: "error",
        button: "Ok!",
      });
      navigate("/login");
    } else {
      try{
    const checkResponse = await fetch(`${url}/booking/addsaved/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        token: authToken,
      },
    });
    const data1 = await checkResponse.json();
    if (data1.success === true) {
      swal({
        title: "Done!",
        text: "place successfully added to wishlist !",
        icon: "success",
        button: "Ok!",
      });
      navigate("/profile/saved");
    } else {
      swal({
        title: "Already Exist!" ,
        text: "Place Already Exist in Wishlist!",
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

  return (
    <div className="container-fluid section">
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-10">
          <div className="mx-0 my-4 p-0 outer-border ">
            <form onSubmit={handleSubmit}>
              <div className="header-header">
                <div className="header-title">Search For Hotels</div>
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
              <b>Total {totalCount} Hotels Available</b>
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
              ) : !hotels ? ( 
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
            ) : hotels.length === 0 ? (
              <div className="container mt-5">
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <div className="text-center d-grid" style={{gap:"6px"}}>
                      <h1>No Data Found</h1>
                      <p>
                        Sorry, there is no data available to display at the
                        moment.
                      </p>
                      <a href="#"
                        onClick={handleReset} className="btn btn-primary">
                        Remove All Filters
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (

              hotels.map((hotel) => (
                <div className="shadow-0 border rounded-3 card mx-4 mt-4 mb-2">
                  <div className="card-body px-4 py-4">
                    <div className="row">
                      <div className="col-md-12 col-lg-3 mb-4 mb-lg-0">
                        <div className="bg-image rounded hover-zoom hover-overlay ripple">
                          <img
                            src={
                              hotel.photos && hotel.photos.length > 0
                                ? hotel.photos[0]
                                : require("./hotel1.jpg")
                            }
                            fluid
                            className="w-100"
                            alt={
                              hotel.photos && hotel.photos.length > 0
                                ? "Hotel Photo"
                                : "Default Hotel Photo"
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
                        <h5>{hotel.title}</h5>
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
                            {hotel.perks &&
                              hotel.perks.length > 0 &&
                              hotel.perks.join(" • ")}
                          </span>
                          <br />
                        </div>
                        <div className="mb-2 text-muted small">
                          <span>Owner</span>
                          <span className="text-primary"> : </span>
                          <span>{hotel.ownername}</span>
                          <br />
                        </div>
                        <p className="text-truncate mb-4 mb-md-0">
                          {hotel.description}
                        </p>
                      </div>
                      <div className="col-md-6 col-lg-3 border-sm-start-none border-start">
                        <div className="d-flex flex-row align-items-center mb-1">
                          <h4 className="me-1">₹{hotel.price}</h4>
                          <span className="text-danger">
                            <s>₹{hotel.price + 20}</s>
                          </span>
                        </div>
                        <h6 className="text-success">{hotel.address}</h6>
                        <div className="d-flex flex-column mt-4">
                          {/* <Link to={`/detail/${hotel._id}`}>
                            <button className="btn btn-primary btn-sm">
                              Details
                            </button>
                          </Link> */}
                          {hotel.isbooked ? (
                              <button disabled={true} className="btn btn-primary btn-sm" style={{"background" : "#534173" ,
                                "borderColor" : "#534173"}}>
                                Already Booked!
                              </button>
                            ) : (
                              <Link to={`/detail/${hotel._id}`}>
                                <button className="btn btn-primary btn-sm">
                                  Details
                                </button>
                              </Link>
                            )}
                          <button className="btn btn-outline-primary btn-sm mt-2" onClick={() => addtosaved(hotel._id)} >
                            Add to wish list
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
              <button disabled={currentPage === 1} onClick={handlePreviousPage}>
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
  );
}

export default Hotel;
