import { useState, useEffect } from "react";
import { AiOutlineCar } from "react-icons/ai";
import { BsFillCarFrontFill } from "react-icons/bs";
import "./index.css";
import VendorSummaryCard from "../VendorSummaryCard";
import Cookies from "js-cookie";
import SideNavbar from "../SideNavbar";
import TopNavbar from "../TopNavbar";
import { RotatingLines } from "react-loader-spinner";

const randomColors = ["#00A3FF", "#7C00C9", "#1974D9", "#01E032", "#EA7200"];

const calculateParkingSummary = (parkingData) => {
  const totalParkingLots = 50;
  const occupiedLots = parkingData.length;
  const unoccupiedLots = totalParkingLots - occupiedLots;

  return [
    {
      title: "Total no of Parking lots",
      value: totalParkingLots,
      icon: <AiOutlineCar />,
    },
    {
      title: "No of Parking lots Occupied",
      value: occupiedLots,
      icon: <BsFillCarFrontFill />,
    },
    {
      title: "No of Parking lots Unoccupied",
      value: unoccupiedLots,
      icon: <AiOutlineCar />,
    },
  ];
};

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const Parking = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [parkingData, setParkingData] = useState([]);

  const filterParkingData = () => {
    let filteredData = parkingData;

    if (activeFilter !== "All") {
      const block = activeFilter.split(" - ")[1]; // Get the block letter (e.g., "A" or "B")
      filteredData = filteredData.filter(
        (data) => data.flatNo && data.flatNo[0] === block
      );
    }

    if (searchQuery) {
      filteredData = filteredData.filter(
        (data) =>
          data.ownerName &&
          data.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredData;
  };

  const fetchNotices = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data; // Assuming `id` is the societyId

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/management-service/parking/by-society/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        const fetchedData = await response.json();
        const filteredData = fetchedData.filter(
          (each) => !each.parkingNo.startsWith("P-ADMIN")
        );

        setParkingData(filteredData); // Set the fetched data here

        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const parkingSummary = calculateParkingSummary(parkingData);
  const filteredParkingData = filterParkingData();

  const renderFailureView = () => (
    <div className="error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="failure"
        className="failure-img"
      />
      <h1 className="failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  );

  const renderLoadingView = () => (
    <div className="loader-container">
      <RotatingLines
        visible={true}
        height="96"
        width="96"
        color="#1a4258"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
  const renderSuccessView = () => (
    <div className="apartment-right-main-sec">
      <div className="vendor-services-summary">
        {parkingSummary.map((summary, index) => {
          const randomColor = randomColors[index % randomColors.length];
          return (
            <VendorSummaryCard
              key={index}
              title={summary.title}
              value={summary.value}
              color={randomColor}
              icon={summary.icon}
            />
          );
        })}
      </div>
      <div className="complaints-filter">
        {["All", "Block - A", "Block - B"].map((filter) => (
          <button
            key={filter}
            className={`c-block-button ${
              activeFilter === filter ? "active" : ""
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
        {/* <div className="search-container">
        <input
          type="text"
          placeholder="Search by owner name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ap-search-input"
        />
        <IoSearch className="ap-search-icon" />
      </div> */}
        <div className="complaints-display-sec">
          <div className="p-add-sec">
            <h1 className="ap-head1">Parking Lot List</h1>
            {/* <button className="login-submit-button no-space">
            + Add Parking Lot
          </button> */}
          </div>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Parking ID</th>
                <th>Flat Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredParkingData.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data.parkingNo}</td>
                  <td>{data.flatNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const getView = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <div className="apartment-container">
      <SideNavbar />
      <div className="apartment-right-sec">
        <TopNavbar heading="Parking Lots" full={false} />
        {getView()}
      </div>
    </div>
  );
};

export default Parking;
