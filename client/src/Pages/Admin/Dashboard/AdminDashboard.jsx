import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile]                     = useState(null);
  const [counts, setCounts]                       = useState(null);
  const [pipeline, setPipeline]                   = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading]                     = useState(true);

  // ── Auth guard + fetch ───────────────────────────────────────────────────
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    const role   = localStorage.getItem("role");

    if (!stored || role !== "hr") {
      navigate("/admin-login");
      return;
    }

    Promise.all([
      fetch(`/api/admin/dashboard`).then((r) => r.json()),
      fetch(`/api/admin/profile/${stored.id}`).then((r) => r.json()),
    ])
      .then(([dashData, profileData]) => {
        if (dashData.error)   console.error("Dashboard error:", dashData.error);
        if (profileData.error) console.error("Profile error:", profileData.error);

        setCounts(dashData.counts             ?? null);
        setPipeline(dashData.pipeline         ?? []);
        setRecentApplications(dashData.recentApplications ?? []);
        setUpcomingInterviews(dashData.upcomingInterviews  ?? []);
        setProfile(profileData.error ? null : profileData);
      })
      .catch((err) => console.error("Admin dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/admin-login");
  };

  // ── Derived values ───────────────────────────────────────────────────────
  const storedUser   = JSON.parse(localStorage.getItem("user") || "null");
  const displayName  = profile?.full_name || storedUser?.email?.split("@")[0] || "Admin";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const topStats = [
    {
      label: "Total Applications",
      value: loading ? "…" : (counts?.totalApps ?? 0),
      note:  "all time",
    },
    {
      label: "Open Positions",
      value: loading ? "…" : (counts?.openJobs ?? 0),
      note:  "currently active",
    },
    {
      label: "Shortlisted",
      value: loading ? "…" : (counts?.shortlisted ?? 0),
      note:  "pipeline",
    },
    {
      label: "Interviews Scheduled",
      value: loading ? "…" : (counts?.scheduledInterviews ?? 0),
      note:  "upcoming",
    },
  ];

  // Build pipeline bar widths relative to the largest stage count
  const maxPipelineCount = Math.max(...pipeline.map((p) => p.count), 1);
  const pipelineDisplay = pipeline.map((p) => ({
    stage: formatStage(p.status),
    count: p.count,
    width: `${Math.round((p.count / maxPipelineCount) * 100)}%`,
  }));

  const quickActions = [
    { label: "Manage Jobs",      path: "/admin/jobs" },
    { label: "View Applications",    path: "/Admin/Applications" },
    { label: "Shortlist Candidates", path: "/admin/shortlist" },
    { label: "Schedule Interview",   path: "/admin/interview" },
    { label: "Manage Admins",        path: "/admin/signup"},
    { label: "Open Reports",         path: "/admin/reports" },
  ];

  if (loading) return null;

  return (
    <div style={styles.page}>

      {/* ── Top Bar ── */}
      <div style={styles.topBar}>
        <div>
          <p style={styles.topSmall}>Welcome back</p>
          <h1 style={styles.topHeading}>Admin Dashboard</h1>
          <p style={styles.topSub}>
            Monitor recruitment activity, hiring stages, interviews, and job
            performance from one premium command center.
          </p>
        </div>

        <div style={styles.topRight}>
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="Search candidates, jobs, reports..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.profileCard}>
            <div style={styles.profileAvatar}>{avatarLetter}</div>
            <div>
              <p style={styles.profileName}>{displayName}</p>
              <p style={styles.profileRole}>HR Operations Manager</p>
            </div>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <section style={styles.statGrid}>
        {topStats.map((item, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statTop}>
              <p style={styles.statLabel}>{item.label}</p>
            </div>
            <h2 style={styles.statValue}>{item.value}</h2>
            <p style={styles.statNote}>{item.note}</p>
          </div>
        ))}
      </section>

      {/* ── Pipeline + Quick Actions ── */}
      <section style={styles.heroGrid}>
        <div style={styles.heroLeft}>
          <div style={styles.panelHeader}>
            <div>
              <p style={styles.panelMini}>Overview</p>
              <h3 style={styles.panelTitle}>Hiring Pipeline</h3>
            </div>
          </div>

          <div style={styles.pipelineList}>
            {pipelineDisplay.map((item, index) => (
              <div key={index} style={styles.pipelineRow}>
                <div style={styles.pipelineTop}>
                  <span style={styles.pipelineStage}>{item.stage}</span>
                  <span style={styles.pipelineCount}>{item.count}</span>
                </div>
                <div style={styles.pipelineBarBg}>
                  <div
                    style={{ ...styles.pipelineBarFill, width: item.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.panelHeader}>
            <div>
              <p style={styles.panelMini}>Actions</p>
              <h3 style={styles.panelTitle}>Quick Access</h3>
            </div>
          </div>

          <div style={styles.quickGrid}>
            {quickActions.map((item, index) => (
              <button
                key={index}
                style={styles.quickAction}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Applications + Interviews ── */}
      <section style={styles.lowerGrid}>
        <div style={styles.largePanel}>
          <div style={styles.panelHeader}>
            <div>
              <p style={styles.panelMini}>Live Updates</p>
              <h3 style={styles.panelTitle}>Recent Applications</h3>
            </div>
            <span style={styles.panelLink}>View all</span>
          </div>

          {recentApplications.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              No applications yet.
            </p>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Candidate</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Experience</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((item, index) => (
                    <tr key={item.id || index}>
                      <td style={styles.td}>{item.candidateName}</td>
                      <td style={styles.td}>{item.jobTitle}</td>
                      <td style={styles.td}>{item.experience}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: getStatusColor(item.status).bg,
                            color:           getStatusColor(item.status).text,
                          }}
                        >
                          {formatStage(item.status)}
                        </span>
                      </td>
                      <td style={styles.td}>{formatDate(item.appliedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={styles.rightColumn}>
          {/* Upcoming Interviews */}
          <div style={styles.smallPanel}>
            <div style={styles.panelHeader}>
              <div>
                <p style={styles.panelMini}>Today &amp; Upcoming</p>
                <h3 style={styles.panelTitle}>Interviews</h3>
              </div>
            </div>

            {upcomingInterviews.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                No upcoming interviews.
              </p>
            ) : (
              <div style={styles.interviewList}>
                {upcomingInterviews.map((item, index) => (
                  <div key={item.id || index} style={styles.interviewCard}>
                    <div>
                      <h4 style={styles.interviewName}>{item.candidateName}</h4>
                      <p style={styles.interviewRole}>{item.jobTitle}</p>
                    </div>
                    <div style={styles.interviewMeta}>
                      <span style={styles.interviewTime}>
                        {formatTime(item.interviewDate)}
                      </span>
                      <span style={styles.interviewMode}>
                        {item.mode === "online" ? "Google Meet" : "On-site"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team Notes — static insights */}
          <div style={styles.smallPanel}>
            <div style={styles.panelHeader}>
              <div>
                <p style={styles.panelMini}>Insights</p>
                <h3 style={styles.panelTitle}>Team Notes</h3>
              </div>
            </div>

            <div style={styles.notesList}>
              <div style={styles.noteItem}>
                Total of <strong>{counts?.totalApps ?? 0}</strong> applications
                received across all open positions.
              </div>
              <div style={styles.noteItem}>
                <strong>{counts?.shortlisted ?? 0}</strong> candidates currently
                shortlisted and moving through the pipeline.
              </div>
              <div style={styles.noteItem}>
                <strong>{counts?.scheduledInterviews ?? 0}</strong> interviews
                scheduled — check the upcoming panel for details.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatStage(status) {
  const map = {
    applied:     "Applied",
    shortlisted: "Shortlisted",
    interview:   "Interview",
    offered:     "Offered",
    rejected:    "Rejected",
  };
  return map[status] || status;
}

function getStatusColor(status) {
  if (status === "shortlisted") return { bg: "#dcfce7", text: "#166534" };
  if (status === "interview")   return { bg: "#ede9fe", text: "#5b21b6" };
  if (status === "offered")     return { bg: "#fef9c3", text: "#854d0e" };
  if (status === "rejected")    return { bg: "#fee2e2", text: "#991b1b" };
  return                               { bg: "#dbeafe", text: "#1d4ed8" };
}

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatTime(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Styles (identical to original AdminDashboard) ──────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "28px",
    fontFamily: "Arial, sans-serif",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  topSmall: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  topHeading: {
    margin: "8px 0 10px 0",
    fontSize: "38px",
    lineHeight: 1.1,
    color: "#0f172a",
  },
  topSub: {
    margin: 0,
    maxWidth: "760px",
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  topRight: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  searchBox: {
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 12px 35px rgba(15,23,42,0.06)",
    padding: "8px 12px",
  },
  searchInput: {
    width: "280px",
    maxWidth: "100%",
    height: "42px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "transparent",
  },
  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#ffffff",
    padding: "10px 14px",
    borderRadius: "20px",
    boxShadow: "0 12px 35px rgba(15,23,42,0.06)",
  },
  profileAvatar: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
  },
  profileName: {
    margin: 0,
    fontWeight: "700",
    color: "#0f172a",
  },
  profileRole: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#64748b",
  },
  logoutButton: {
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#b91c1c",
    fontWeight: "700",
    padding: "8px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "13px",
    marginLeft: "4px",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  statLabel: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
  },
  statValue: {
    margin: "14px 0 8px 0",
    fontSize: "34px",
    color: "#0f172a",
  },
  statNote: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "20px",
    marginBottom: "24px",
  },
  heroLeft: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  heroRight: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "18px",
  },
  panelMini: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  panelTitle: {
    margin: "6px 0 0 0",
    color: "#0f172a",
    fontSize: "24px",
  },
  panelLink: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
  },
  pipelineList: {
    display: "grid",
    gap: "18px",
    marginTop: "8px",
  },
  pipelineRow: {
    display: "grid",
    gap: "10px",
  },
  pipelineTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pipelineStage: {
    fontWeight: "700",
    color: "#1e293b",
  },
  pipelineCount: {
    fontWeight: "700",
    color: "#64748b",
  },
  pipelineBarBg: {
    width: "100%",
    height: "14px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },
  pipelineBarFill: {
    height: "100%",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    borderRadius: "999px",
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "14px",
    marginTop: "10px",
  },
  quickAction: {
    border: "1px solid #e2e8f0",
    color: "#0f172a",
    background: "#f8fafc",
    borderRadius: "18px",
    padding: "18px 16px",
    fontWeight: "700",
    textAlign: "center",
    cursor: "pointer",
  },
  lowerGrid: {
    display: "grid",
    gridTemplateColumns: "1.55fr 1fr",
    gap: "20px",
  },
  largePanel: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  rightColumn: {
    display: "grid",
    gap: "20px",
  },
  smallPanel: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "14px 10px",
    color: "#64748b",
    fontSize: "13px",
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "16px 10px",
    color: "#0f172a",
    fontSize: "14px",
    borderBottom: "1px solid #f1f5f9",
  },
  statusBadge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  interviewList: {
    display: "grid",
    gap: "14px",
  },
  interviewCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    borderRadius: "18px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  interviewName: {
    margin: 0,
    fontSize: "15px",
    color: "#0f172a",
  },
  interviewRole: {
    margin: "6px 0 0 0",
    color: "#64748b",
    fontSize: "13px",
  },
  interviewMeta: {
    display: "grid",
    justifyItems: "end",
    gap: "6px",
  },
  interviewTime: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "13px",
  },
  interviewMode: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "12px",
  },
  notesList: {
    display: "grid",
    gap: "12px",
  },
  noteItem: {
    padding: "15px 16px",
    borderRadius: "16px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "14px",
    lineHeight: 1.6,
  },
};

export default AdminDashboard;