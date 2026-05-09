import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

const AdminLayout = lazy(() => import("./LayOut/AdminLayout"));

// Candidate Pages
const Home = lazy(() => import("./Pages/Candidate/Home"));
const Jobs = lazy(() => import("./Pages/Candidate/Jobs"));
const JobDetails = lazy(() => import("./Pages/Candidate/JobDetails"));
const Apply = lazy(() => import("./Pages/Candidate/Apply"));
const ApplicationSuccess = lazy(() => import("./Pages/Candidate/ApplicationSuccess"));
const CandidateLogin = lazy(() => import("./Pages/Candidate/CandidateLogin"));
const CandidateSignup = lazy(() => import("./Pages/Candidate/CandidateSignup"));
const CandidateDashboard = lazy(() => import("./Pages/Candidate/CandidateDashboard"));
const ApplicationStatus = lazy(() => import("./Pages/Candidate/ApplicationStatus"));

// HR Pages
const AdminSignup = lazy(() => import("./Pages/Admin/Signup/AdminSignup"));
const AdminLogin = lazy(() => import("./Pages/Admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./Pages/Admin/Dashboard/AdminDashboard"));
const ManageJobs = lazy(() => import("./Pages/Admin/ManageJobs"));
const Applications = lazy(() => import("./Pages/Admin/Applications"));
const CandidateDetails = lazy(() => import("./Pages/Admin/CandidateDetails"));
const ShortlistManagement = lazy(() => import("./Pages/Admin/ShortlistManagement"));
const InterviewSchedule = lazy(() => import("./Pages/Admin/InterviewSchedule"));
const FeedbackDecision = lazy(() => import("./Pages/Admin/FeedbackDecision"));
const Reports = lazy(() => import("./Pages/Admin/Reports"));

// ── Loader styles (injected once, no external deps) ───────────────────────────
const css = `
  @keyframes japs-bounce {
    0%, 80%, 100% { transform: scale(0.4); opacity: 0.4; }
    40%           { transform: scale(1.0); opacity: 1.0; }
  }
  .japs-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    display: inline-block;
    animation: japs-bounce 1.4s ease-in-out infinite;
  }
  .japs-dot:nth-child(1) { animation-delay: 0s;    }
  .japs-dot:nth-child(2) { animation-delay: 0.2s;  }
  .japs-dot:nth-child(3) { animation-delay: 0.4s;  }
`;

if (!document.getElementById("japs-loader-style")) {
  const tag = document.createElement("style");
  tag.id = "japs-loader-style";
  tag.textContent = css;
  document.head.appendChild(tag);
}

function PageLoader() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
      background: "#f4f7fb",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <span className="japs-dot" />
        <span className="japs-dot" />
        <span className="japs-dot" />
      </div>
      <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px", fontWeight: "600" }}>
        Loading...
      </p>
    </div>
  );
}

// ── Routes ────────────────────────────────────────────────────────────────────
function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    const handleGlobalClick = (event) => {
      const target = event.target.closest("a,button");
      if (!target) return;
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Candidate Auth */}
        <Route path="/candidate-login" element={<CandidateLogin />} />
        <Route path="/candidate-signup" element={<CandidateSignup />} />

        {/* Candidate Pages */}
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
        <Route path="/application-status" element={<ApplicationStatus />} />
        <Route path="/apply/:id" element={<Apply />} />
        <Route path="/application-success" element={<ApplicationSuccess />} />

        {/* HR */}
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/jobs" element={<ManageJobs />} />
          <Route path="/admin/applications" element={<Applications />} />
          <Route path="/admin/candidate-details" element={<CandidateDetails />} />
          <Route path="/admin/shortlist" element={<ShortlistManagement />} />
          <Route path="/admin/interview" element={<InterviewSchedule />} />
          <Route path="/admin/feedback" element={<FeedbackDecision />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Route>

      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;