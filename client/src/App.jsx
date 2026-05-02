import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./utils/supabaseClient";

import ProtectedRoute from "./components/protectedRoutes";
import AdminLayout from "./LayOut/AdminLayout";

// Candidate Pages
import Home from "./Pages/Candidate/Home";
import Jobs from "./Pages/Candidate/Jobs";
import JobDetails from "./Pages/Candidate/JobDetails";
import Apply from "./Pages/Candidate/Apply";
import ApplicationSuccess from "./Pages/Candidate/ApplicationSuccess";
import CandidateLogin from "./Pages/Candidate/CandidateLogin";
import CandidateSignup from "./Pages/Candidate/CandidateSignup";
import CandidateDashboard from "./Pages/Candidate/CandidateDashboard";
import ApplicationStatus from "./Pages/Candidate/ApplicationStatus";

// HR Pages
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ManageJobs from "./Pages/Admin/ManageJobs";
import Applications from "./Pages/Admin/Applications";
import CandidateDetails from "./Pages/Admin/CandidateDetails";
import ShortlistManagement from "./Pages/Admin/ShortlistManagement";
import InterviewSchedule from "./Pages/Admin/InterviewSchedule";
import FeedbackDecision from "./Pages/Admin/FeedbackDecision";
import Reports from "./Pages/Admin/Reports";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Get logged in user
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        setRole(profile?.role);
      }
    });

    // Listen to auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();

        setRole(profile?.role);
      } else {
        setRole(null);
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Candidate Auth */}
        <Route path="/candidate-login" element={<CandidateLogin />} />
        <Route path="/candidate-signup" element={<CandidateSignup />} />

        {/* Candidate Protected */}
        <Route
          path="/apply/:id"
          element={
            <ProtectedRoute user={user} role={role} allowedRole="candidate">
              <Apply />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-dashboard"
          element={
            <ProtectedRoute user={user} role={role} allowedRole="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/application-status"
          element={
            <ProtectedRoute user={user} role={role} allowedRole="candidate">
              <ApplicationStatus />
            </ProtectedRoute>
          }
        />

        <Route path="/application-success" element={<ApplicationSuccess />} />

        {/* HR Protected Routes */}
        <Route
          element={
            <ProtectedRoute user={user} role={role} allowedRole="hr">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
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