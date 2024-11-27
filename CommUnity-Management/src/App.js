import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import JoinHere from "./components/JoinHere";
import { ToastContainer } from "react-toastify";
import AdminRegisterPage from "./components/AdminRegisterPage";
import UserSignUpPage from "./components/UserSignUpPage";
import LoginPage from "./components/LoginPage";
import Apartment from "./components/Apartment";
import RequestsPage from "./components/RequestsPage";
import Complaints from "./components/Complaints";
import SecurityGPage from "./components/SecurityGPage";
import Parking from "./components/Parking";
import NoticePage from "./components/NoticePage";
import PostsMainPage from "./components/PostsRecPage";
import EmergencyContacts from "./components/EmergencyConPage";
import UserProfile from "./components/UserProfile";
import Events from "./components/Events";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./components/NewSignUp";
import BillingPage from "./components/BillingPage";
import FeedbackPage from "./components/FeedbackPage";
import Dashboard from "./components/Dashboard";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/join-here" element={<JoinHere />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-signup" element={<SignUp />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-register" element={<AdminRegisterPage />} />
          <Route path="/user-register" element={<UserSignUpPage />} />
          <Route path="/apartment" element={<Apartment />} />
          <Route path="/request" element={<RequestsPage />} />
          <Route path="/complaint" element={<Complaints />} />
          <Route path="/notice-board" element={<NoticePage />} />
          <Route path="/parking" element={<Parking />} />
          <Route path="/posts" element={<PostsMainPage />} />
          <Route path="/security-guards" element={<SecurityGPage />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/events" element={<Events />} />
          <Route path="/billings" element={<BillingPage />} />
          <Route path="/feedback/:eventId" element={<FeedbackPage />} />
        </Route>

        {/* Redirect to home for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
