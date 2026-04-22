import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./LayOut/AdminLayout";

import Home from "./Pages/Candidate/Home";
import Jobs from "./Pages/Candidate/Jobs";
import JobDetails from "./Pages/Candidate/JobDetails.jsx";
import Apply from "./Pages/Candidate/Apply";
import ApplicationSuccess from "./Pages/Candidate/ApplicationSuccess";
import CandidateLogin from "./Pages/Candidate/CandidateLogin";
import CandidateSignup from "./Pages/Candidate/CandidateSignup";
import CandidateDashboard from "./Pages/Candidate/CandidateDashboard.jsx";
import ApplicationStatus from "./Pages/Candidate/ApplicationStatus.jsx";

import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminLogin from "./Pages/Admin/AdminLogin";
import ManageJobs from "./Pages/Admin/ManageJobs";
import Applications from "./Pages/Admin/Applications";
import CandidateDetails from "./Pages/Admin/CandidateDetails";
import ShortlistManagement from "./Pages/Admin/ShortlistManagement";
import InterviewSchedule from "./Pages/Admin/InterviewSchedule";
import FeedbackDecision from "./Pages/Admin/FeedbackDecision";
import Reports from "./Pages/Admin/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/apply/:id" element={<Apply />} />
        <Route path="/application-success" element={<ApplicationSuccess />} />
        <Route path="/candidate-login" element={<CandidateLogin />} />
        <Route path="/candidate-signup" element={<CandidateSignup />} />
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
        <Route path="/application-status" element={<ApplicationStatus />} />

        {/* Admin Pages */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/jobs" element={<ManageJobs />} />
          <Route path="/admin/applications" element={<Applications />} />
          <Route path="/admin/candidate-details" element={<CandidateDetails />} />
          <Route path="/admin/shortlist" element={<ShortlistManagement />} />
          <Route path="/admin/interview" element={<InterviewSchedule />} />
          <Route path="/admin/feedback" element={<FeedbackDecision />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;