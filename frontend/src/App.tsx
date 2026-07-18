import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Careers from "./pages/Careers";
import JobDetails from "./pages/JobDetails";
import Apply from "./pages/Apply";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import CandidateDashboard from "./pages/candidate/Dashboard";
import CandidateApplications from "./pages/candidate/Applications";
import CandidateApplicationDetail from "./pages/candidate/ApplicationDetail";
import CandidateProfile from "./pages/candidate/Profile";
import CandidateNotifications from "./pages/candidate/Notifications";
import HRDashboard from "./pages/hr/Dashboard";
import HRApplicants from "./pages/hr/Applicants";
import HRApplicantDetail from "./pages/hr/ApplicantDetail";
import HRInterviews from "./pages/hr/Interviews";
import HRAnalytics from "./pages/hr/Analytics";
import HRSettings from "./pages/hr/Settings";
import NotFound from "./pages/not-found/NotFound";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-secondary-900">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <About />
                <Footer />
              </>
            }
          />
          <Route
            path="/services"
            element={
              <>
                <Navbar />
                <Services />
                <Footer />
              </>
            }
          />
          <Route
            path="/careers"
            element={
              <>
                <Navbar />
                <Careers />
                <Footer />
              </>
            }
          />
          <Route
            path="/careers/:id"
            element={
              <>
                <Navbar />
                <JobDetails />
                <Footer />
              </>
            }
          />
          <Route
            path="/apply/:jobId?"
            element={
              <>
                <Navbar />
                <Apply />
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <Contact />
                <Footer />
              </>
            }
          />
          <Route
            path="/privacy"
            element={
              <>
                <Navbar />
                <PrivacyPolicy />
                <Footer />
              </>
            }
          />
          <Route
            path="/terms"
            element={
              <>
                <Navbar />
                <Terms />
                <Footer />
              </>
            }
          />

          {/* Auth routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
          <Route path="/auth/verify-email/:token" element={<VerifyEmail />} />

          {/* Candidate dashboard routes */}
          <Route
            path="/candidate"
            element={
              <ProtectedRoute roles={["candidate"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CandidateDashboard />} />
            <Route path="applications" element={<CandidateApplications />} />
            <Route path="applications/:id" element={<CandidateApplicationDetail />} />
            <Route path="profile" element={<CandidateProfile />} />
            <Route path="notifications" element={<CandidateNotifications />} />
          </Route>

          {/* HR dashboard routes */}
          <Route
            path="/hr"
            element={
              <ProtectedRoute roles={["hr", "admin"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HRDashboard />} />
            <Route path="applicants" element={<HRApplicants />} />
            <Route path="applicants/:id" element={<HRApplicantDetail />} />
            <Route path="interviews" element={<HRInterviews />} />
            <Route path="analytics" element={<HRAnalytics />} />
            <Route path="settings" element={<HRSettings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
