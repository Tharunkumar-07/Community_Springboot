import "./index.css";
import TopNavbar from "../TopNavbar";
import SideNavbar from "../SideNavbar";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { RotatingLines } from "react-loader-spinner";
import VendorSummaryCard from "../VendorSummaryCard";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { HiBuildingLibrary } from "react-icons/hi2";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdSpeakerNotes } from "react-icons/md";
import { IoCarSport } from "react-icons/io5";
import { FaBusinessTime } from "react-icons/fa6";
import { MdEvent } from "react-icons/md";
import { FaUserSecret } from "react-icons/fa";
import DashboardSummaryCard from "../DashboardSummaryCard";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const randomColors = ["#00A3FF", "#7C00C9", "#1974D9", "#EA7200", "#01E032"];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * randomColors.length);
  return randomColors[randomIndex];
};
const Dashboard = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [totalFlatsOccupied, setTotalFlatsOccupied] = useState(null);
  const [totalFlatsOccupiedA, setTotalFlatsOccupiedA] = useState(0);
  const [totalFlatsOccupiedB, setTotalFlatsOccupiedB] = useState(0);
  const [totalPeopleA, setTotalPeopleA] = useState(0);
  const [totalPeopleB, setTotalPeopleB] = useState(0);
  const [totalComplaints, setTotalComplaints] = useState(null);
  const [totalParkingPlots, setTotalParkingPlots] = useState(null);
  const [totalPeople, setTotalPeople] = useState(null);
  const [totalVendors, setTotalVendors] = useState(null);
  const [totalUpComingEvents, setTotalUpComingEvents] = useState(null);
  const [totalSecurities, setTotalSecurities] = useState(null);

  const fetchDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data; // Assuming `id` is the societyId

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/management-service/residents/findby-societyid/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        const residentsAndAdminsData = await response.json();
        console.log("residentsAndAdminsData", residentsAndAdminsData);
        const residents = residentsAndAdminsData.filter(
          (each) => each.role !== "ADMIN"
        );
        console.log("residents", residents);
        const uniqueFlats = new Set(
          residents.map((resident) => resident.flatNo)
        );
        console.log("uniqueFlats", uniqueFlats);
        let countA = 0;
        let countB = 0;
        let peopleA = 0;
        let peopleB = 0;
        uniqueFlats.forEach((flat) => {
          if (flat.startsWith("A")) {
            countA += 1;
          } else {
            countB += 1;
          }
        });

        residents.forEach((resident) => {
          if (resident.flatNo.startsWith("A")) {
            peopleA += 1;
          } else {
            peopleB += 1;
          }
        });

        setTotalFlatsOccupied(uniqueFlats.size);
        setTotalFlatsOccupiedA(countA);
        setTotalFlatsOccupiedB(countB);
        setTotalPeople(residents.length);
        setTotalPeopleA(peopleA);
        setTotalPeopleB(peopleB);

        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const fetchComplaintsdata = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data; // Assuming `id` is the societyId
    try {
      const response = await fetch(
        `http://localhost:9999/api/community/complaint-service/complaints/by-society/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        const complaintsData = await response.json();
        setTotalComplaints(complaintsData.length);

        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching complaints Data:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };
  const fetchParkingdata = async () => {
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
        const parkingData = await response.json();
        const filteredData = parkingData.filter(
          (item) => !item.parkingNo.startsWith("P-ADMIN")
        );
        setTotalParkingPlots(filteredData.length);

        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching Parking Plots Data:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };
  const fetchVendorsdata = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data; // Assuming `id` is the societyId
    try {
      const response = await fetch(
        `http://localhost:9999/api/community/complaint-service/vendor/getBySociety/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        const VendorsData = await response.json();
        setTotalVendors(VendorsData.length);

        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching Vendors Data:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };
  const fetchSecuritiesdata = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data; // Assuming `id` is the societyId
    try {
      const response = await fetch(
        `http://localhost:9999/api/community/management-service/security-details/get-by-society/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        const SecuritiesData = await response.json();
        setTotalSecurities(SecuritiesData.length);

        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching Securities Guard Data:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };
  const fetchEventsdata = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data; // Assuming `id` is the societyId
    try {
      const response = await fetch(
        `http://localhost:9999/api/community/event-service/event/event-by-society/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        const eventsData = await response.json();
        const now = new Date();

        // Filter upcoming events
        const upcomingEvents = eventsData.filter((event) => {
          const eventDate = new Date(event.eventDate);
          return eventDate > now;
        });

        setTotalUpComingEvents(upcomingEvents.length);

        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching Securities Guard Data:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Call all the fetch functions concurrently
        await Promise.all([
          fetchDetails(),
          fetchComplaintsdata(),
          fetchParkingdata(),
          fetchVendorsdata(),
          fetchSecuritiesdata(),
          fetchEventsdata(),
        ]);
      } catch (error) {
        console.error("Error fetching all data:", error);
        setApiStatus(apiStatusConstants.failure);
      }
    };

    fetchAllData();
  }, []);

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

  const renderSuccessView = () => {
    const occupancyPercentage1 = ((totalFlatsOccupiedA / 20) * 100).toFixed(0);
    const occupancyPercentage2 = ((totalFlatsOccupiedB / 20) * 100).toFixed(0);
    const circleRadius = 22.5;
    const circlePerimeter = 2 * Math.PI * circleRadius;
    const strokeDashoffset1 =
      ((100 - occupancyPercentage1) / 100) * circlePerimeter;
    const strokeDashoffset2 =
      ((100 - occupancyPercentage2) / 100) * circlePerimeter;

    return (
      <div className="apartment-right-main-sec space-below">
        <div className="vendor-services-summary">
          <VendorSummaryCard
            title="Total no of blocks"
            icon={<PiBuildingOfficeFill />}
            value="2"
            color={getRandomColor()}
          />
          <VendorSummaryCard
            title="Total no of Flats"
            icon={<HiBuildingLibrary />}
            value="40"
            color={getRandomColor()}
          />
          <VendorSummaryCard
            title="Total no of Flats Occupied"
            icon={<HiBuildingLibrary />}
            value={totalFlatsOccupied}
            color={getRandomColor()}
          />
          <VendorSummaryCard
            title="Total no of People in the Society"
            icon={<BsFillPeopleFill />}
            value={totalPeople}
            color={getRandomColor()}
          />
        </div>
        <div className="blocks-summary-sec">
          <div className="block-summary-card">
            <div className="block-info">
              <h3>Block - A</h3>
              <p>Total no of flats : 20</p>
              <p>Total no of Members : {totalPeopleA}</p>
              <p>Total no of flats Occupied : {totalFlatsOccupiedA}</p>
              <p>Total no of flats Unoccupied : {20 - totalFlatsOccupiedA}</p>
            </div>
            <div className="progress-circle">
              <div className="circle">
                <div className="inner-circle">
                  <span className="per-text">{occupancyPercentage1}%</span>
                </div>
                <svg className="progress svg" viewBox="0 0 50 50">
                  <path
                    className="circle-bg"
                    d="M25 2.5
        a 22.5 22.5 0 0 1 0 45
        a 22.5 22.5 0 0 1 0 -45"
                  />
                  <path
                    className="circle-fill"
                    strokeDasharray={circlePerimeter}
                    strokeDashoffset={strokeDashoffset1}
                    d="M25 2.5
        a 22.5 22.5 0 0 1 0 45
        a 22.5 22.5 0 0 1 0 -45"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="block-summary-card">
            <div className="block-info">
              <h3>Block - B</h3>
              <p>Total no of flats : 20</p>
              <p>Total no of Members : {totalPeopleB}</p>
              <p>Total no of flats Occupied : {totalFlatsOccupiedB}</p>
              <p>Total no of flats Unoccupied : {20 - totalFlatsOccupiedB}</p>
            </div>
            <div className="progress-circle">
              <div className="circle">
                <div className="inner-circle">
                  <span className="per-text">{occupancyPercentage2}%</span>
                </div>
                <svg className="progress svg" viewBox="0 0 50 50">
                  <path
                    className="circle-bg"
                    d="M25 2.5
        a 22.5 22.5 0 0 1 0 45
        a 22.5 22.5 0 0 1 0 -45"
                  />
                  <path
                    className="circle-fill"
                    strokeDasharray={circlePerimeter}
                    strokeDashoffset={strokeDashoffset2}
                    d="M25 2.5
        a 22.5 22.5 0 0 1 0 45
        a 22.5 22.5 0 0 1 0 -45"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="overall-summary-sec">
          <DashboardSummaryCard
            icon={<MdSpeakerNotes />}
            value={totalComplaints}
            title="Total Complaints"
          />
          <DashboardSummaryCard
            icon={<IoCarSport />}
            value={totalParkingPlots}
            title="Total Parking Plots"
          />
          <DashboardSummaryCard
            icon={<FaBusinessTime />}
            value={totalVendors}
            title="Total Vendors"
          />
          <DashboardSummaryCard
            icon={<MdEvent />}
            value={totalUpComingEvents}
            title="Total Upcoming Events"
          />
          <DashboardSummaryCard
            icon={<FaUserSecret />}
            value={totalSecurities}
            title="Total Securities"
          />
        </div>
      </div>
    );
  };

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
        <TopNavbar heading="Dashboard" full={false} />

        {getView()}
      </div>
    </div>
  );
};

export default Dashboard;
