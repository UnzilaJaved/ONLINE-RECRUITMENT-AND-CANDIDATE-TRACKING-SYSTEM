import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./LayOut/AdminLayout";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
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
        <Route element={<AdminLayout />}>
          <Route path="/" element={<AdminDashboard />} />
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