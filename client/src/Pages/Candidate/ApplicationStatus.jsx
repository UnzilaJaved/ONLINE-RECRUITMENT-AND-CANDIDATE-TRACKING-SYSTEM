import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ApplicationStatus() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/candidate-login");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/candidate-login");
      return;
    }

    fetch(`/api/candidate/dashboard/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        const appList = Array.isArray(data) ? data : data.applications || [];
        setApplications(appList);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const candidateName = storedUser?.email
    ? storedUser.email.split("@")[0]
    : "Candidate";

  const stats = [
    {
      label: "Applications",
      value: applications.length,
      note: "Total submitted",
    },
    {
      label: "Under Review",
      value: applications.filter((app) => app.status === "applied").length,
      note: "Waiting recruiter review",
    },
    {
      label: "Shortlisted",
      value: applications.filter((app) => app.status === "shortlisted").length,
      note: "Moved to next stage",
    },
    {
      label: "Interviews",
      value: applications.filter((app) => app.status === "interview").length,
      note: "Scheduled rounds",
    },
  ];

  if (loading) return null;

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>JA</div>
          <div>
            <h2 style={styles.logoTitle}>JAPS</h2>
            <p style={styles.logoSub}>Candidate Status</p>
          </div>
        </div>

        <div style={styles.navLinks}>          
          <Link to="/candidate-dashboard" style={styles.navLink}>Dashboard</Link>
          <Link to="/jobs" style={styles.navLink}>Jobs</Link>
          <Link to="/application-status" style={styles.activeNavLink}>Status</Link>
          <button type="button" onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        <section style={styles.heroSection}>
          <div style={styles.heroLeft}>
            <p style={styles.heroMini}>Track Progress</p>
            <h1 style={styles.heroTitle}>Application Status Center</h1>
            <p style={styles.heroText}>
              Review all your submitted applications, track hiring pipeline
              movement, and stay ready for upcoming interview actions.
            </p>

            <div style={styles.heroButtons}>
              <Link to="/jobs" style={styles.primaryButton}>Apply to More Jobs</Link>
              <Link to="/candidate-dashboard" style={styles.secondaryButton}>Open Dashboard</Link>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.profileCard}>
              <div style={styles.profileTop}>
                <div style={styles.profileAvatar}>{candidateName.charAt(0).toUpperCase()}</div>
                <div>
                  <p style={styles.profileName}>{candidateName}</p>
                  <p style={styles.profileRole}>Candidate Portal</p>
                </div>
              </div>

              <div style={styles.profileDivider}></div>

              <div style={styles.profileInfoList}>
                <InfoRow label="Total Applications" value={`${stats[0].value}`} />
                <InfoRow label="Shortlisted" value={`${stats[2].value}`} />
                <InfoRow label="Interviews" value={`${stats[3].value}`} />
              </div>
            </div>
          </div>
        </section>

        <section style={styles.statsGrid}>
          {stats.map((item, index) => (
            <div key={index} style={styles.statCard}>
              <p style={styles.statLabel}>{item.label}</p>
              <h3 style={styles.statValue}>{item.value}</h3>
              <p style={styles.statNote}>{item.note}</p>
            </div>
          ))}
        </section>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <p style={styles.panelMini}>My Applications</p>
            <h2 style={styles.panelTitle}>Status Overview</h2>
          </div>

          {applications.length === 0 ? (
            <div style={styles.emptyCard}>
              <p style={styles.emptyTitle}>No applications yet</p>
              <p style={styles.emptyText}>You have not applied to any jobs yet. Explore open roles to get started.</p>
              <Link to="/jobs" style={styles.primaryButton}>Browse Jobs</Link>
            </div>
          ) : (
            <div style={styles.applicationGrid}>
              {applications.map((app, index) => (
                <div key={index} style={styles.applicationCard}>
                  <div style={styles.applicationTop}>
                    <div>
                      <h3 style={styles.appRole}>
                        {app.jobs?.title || "Untitled Role"}
                      </h3>
                      <p style={styles.appCompany}>
                        {app.jobs?.department || "General"}
                      </p>
                    </div>

                    <span
                      style={{
                        ...styles.statusBadge,
                        background: getStatusStyle(app.status).bg,
                        color: getStatusStyle(app.status).text,
                      }}
                    >
                      {formatStatus(app.status)}
                    </span>
                  </div>

                  <div style={styles.appMetaRow}>
                    <span style={styles.metaPill}>
                      📍 {app.location || app.jobs?.location || "-"}
                    </span>
                    <span style={styles.metaPill}>
                      💼 {app.jobs?.type || "-"}
                    </span>
                    <span style={styles.metaPill}>Progress: {getProgress(app.status)}%</span>
                  </div>

                  <div style={styles.progressWrap}>
                    <div style={styles.progressTop}>
                      <span style={styles.progressLabel}>Pipeline Progress</span>
                      <span style={styles.progressValue}>{getProgress(app.status)}%</span>
                    </div>
                    <div style={styles.progressBarBg}>
                      <div
                        style={{
                          ...styles.progressBarFill,
                          width: `${getProgress(app.status)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

function getStatusStyle(status) {
  if (status === "shortlisted") {
    return { bg: "#dcfce7", text: "#166534" };
  }
  if (status === "interview") {
    return { bg: "#ede9fe", text: "#5b21b6" };
  }
  if (status === "rejected") {
    return { bg: "#fee2e2", text: "#991b1b" };
  }
  return { bg: "#dbeafe", text: "#1d4ed8" };
}

function formatStatus(status) {
  const statusMap = {
    applied: "Under Review",
    shortlisted: "Shortlisted",
    interview: "Interview Scheduled",
    offered: "Offer Received",
    rejected: "Not Selected",
  };
  return statusMap[status] || status;
}

/* 🔥 PROGRESS LOGIC */
function getProgress(status) {
  switch (status) {
    case "applied":
      return 25;
    case "shortlisted":
      return 60;
    case "interview":
      return 85;
    case "offered":
      return 100;
    default:
      return 40;
  }
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "22px 36px",
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },

  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
  },
  logoTitle: {
    margin: 0,
    fontSize: "20px",
  },
  logoSub: {
    margin: "4px 0 0 0",
    fontSize: "12px",
    color: "#64748b",
  },

  navLinks: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },

  navLink: {
    textDecoration: "none",
    color: "#334155",
    fontWeight: "600",
    padding: "10px 14px",
  },

  activeNavLink: {
    textDecoration: "none",
    color: "#1d4ed8",
    background: "#eff6ff",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: "700",
  },

  logoutButton: {
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#b91c1c",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },

  container: {
    padding: "28px 36px 36px 36px",
  },

  heroSection: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "20px",
    marginBottom: "24px",
  },
  heroLeft: {
    background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
    borderRadius: "30px",
    padding: "34px",
  },
  heroMini: {
    margin: 0,
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "14px",
  },
  heroTitle: {
    margin: "14px 0 14px 0",
    fontSize: "44px",
    lineHeight: 1.08,
  },
  heroText: {
    margin: 0,
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.8,
  },
  heroButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
    flexWrap: "wrap",
  },
  primaryButton: {
    textDecoration: "none",
    display: "inline-block",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "14px 20px",
    borderRadius: "14px",
    fontWeight: "700",
  },
  secondaryButton: {
    textDecoration: "none",
    display: "inline-block",
    background: "#ffffff",
    color: "#0f172a",
    padding: "14px 20px",
    borderRadius: "14px",
    fontWeight: "700",
    border: "1px solid #dbe2ea",
  },
  heroRight: {
    display: "grid",
  },
  profileCard: {
    background: "#ffffff",
    borderRadius: "30px",
    padding: "28px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  profileTop: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  profileAvatar: {
    width: "58px",
    height: "58px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "22px",
  },
  profileName: {
    margin: 0,
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "18px",
  },
  profileRole: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#64748b",
  },
  profileDivider: {
    height: "1px",
    background: "#e2e8f0",
    margin: "18px 0",
  },
  profileInfoList: {
    display: "grid",
    gap: "12px",
  },

  statsGrid: {
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
  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  statValue: {
    margin: "12px 0 8px 0",
    fontSize: "32px",
    color: "#0f172a",
  },
  statNote: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },

  panel: {
    background: "#fff",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },

  panelHeader: { marginBottom: "16px" },
  panelMini: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  panelTitle: {
    margin: "6px 0 0 0",
    color: "#0f172a",
    fontSize: "28px",
  },

  applicationGrid: { display: "grid", gap: "16px" },

  applicationCard: {
    background: "#f8fafc",
    padding: "18px",
    borderRadius: "22px",
    border: "1px solid #e2e8f0",
  },

  applicationTop: {
    display: "flex",
    justifyContent: "space-between",
  },

  statusBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },
  appRole: {
    margin: "0 0 6px 0",
    fontSize: "22px",
    color: "#0f172a",
  },
  appCompany: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  appMetaRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    margin: "14px 0",
  },

  metaPill: {
    background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
    border: "1px solid #dbeafe",
    padding: "10px 14px",
    borderRadius: "999px",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: "700",
  },

  progressWrap: {
    display: "grid",
    gap: "10px",
  },
  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    color: "#334155",
    fontWeight: "700",
    fontSize: "14px",
  },
  progressValue: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "14px",
  },
  progressBarBg: {
    height: "10px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
  },

  emptyCard: {
    padding: "30px",
    textAlign: "center",
  },
  emptyTitle: {
    margin: 0,
    fontSize: "28px",
    color: "#0f172a",
  },
  emptyText: {
    margin: "10px 0 22px 0",
    color: "#64748b",
    lineHeight: 1.7,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    paddingBottom: "10px",
    borderBottom: "1px solid #edf2f7",
  },
  infoLabel: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600",
  },
  infoValue: {
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: "700",
    textAlign: "right",
  },
};

export default ApplicationStatus;