import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function CandidateDashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);

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
        console.log("DASHBOARD DATA:", data);

        setApplications(data.applications || []);
        setProfile(data.profile || {});
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  // 🔥 DYNAMIC STATS
  const stats = [
    {
      label: "Applications Submitted",
      value: applications.length,
      note: "Across active roles",
      trend: `${applications.length} total`,
    },
    {
      label: "Under Review",
      value: applications.filter((a) => a.status === "applied").length,
      note: "Waiting on recruiter review",
      trend: "In progress",
    },
    {
      label: "Shortlisted",
      value: applications.filter((a) => a.status === "shortlisted").length,
      note: "Moved to next stage",
      trend: "Strong profile",
    },
    {
      label: "Interviews",
      value: applications.filter((a) => a.status === "interview").length,
      note: "Upcoming interview round",
      trend: "Scheduled",
    },
  ];

  // 🔥 DYNAMIC APPLICATIONS
  const mappedApplications = applications.map((app, index) => ({
    id: `APP-${index + 1}`,
    role: app.jobs?.title,
    company: app.jobs?.department,
    date: new Date(app.applied_at).toDateString(),
    status: formatStatus(app.status),
    progress: getProgress(app.status),
  }));

  // 🔥 DYNAMIC UPDATES
  const updates = applications.map((app) => ({
    title: app.jobs?.title,
    text: `Your application is currently ${formatStatus(app.status)}.`,
  }));

  const timeline = [
    { step: "Application Submitted", active: true },
    { step: "Initial Review", active: true },
    { step: "Shortlisting", active: true },
    { step: "Interview", active: true },
    { step: "Final Decision", active: false },
  ];

  return (
    <div style={styles.page}>
      {/* NAVBAR SAME */}
      <nav style={styles.navbar}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>JA</div>
          <div>
            <h2 style={styles.logoTitle}>JAPS</h2>
            <p style={styles.logoSub}>Candidate Dashboard</p>
          </div>
        </div>

        <div style={styles.navLinks}>
          <Link to="/candidate-dashboard" style={styles.navLink}>
            Dashboard
          </Link>
          <Link to="/jobs" style={styles.navLink}>
            Jobs
          </Link>
          <Link to="/application-status" style={styles.activeNavLink}>
            Status
          </Link>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        {/* HERO */}
        <section style={styles.heroSection}>
          <div style={styles.heroLeft}>
            <p style={styles.heroMini}>Welcome back</p>
            <h1 style={styles.heroTitle}>Your hiring journey, all in one place</h1>

            <div style={styles.heroButtons}>
              <Link to="/application-status" style={styles.primaryButton}>
                View Full Status
              </Link>
              <Link to="/jobs" style={styles.secondaryButton}>
                Explore More Jobs
              </Link>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.profileCard}>
              <div style={styles.profileTop}>
                <div style={styles.profileAvatar}>
                  {profile?.full_name?.charAt(0) || "U"}
                </div>
                <div>
                  <p style={styles.profileName}>
                    {profile?.full_name || "User"}
                  </p>
                  <p style={styles.profileRole}>Candidate Portal</p>
                </div>
              </div>

              <div style={styles.profileDivider}></div>

              <div style={styles.profileInfoList}>
                <InfoRow label="Candidate ID" value={profile?.id?.slice(0, 8)} />
                <InfoRow label="Active Applications" value={applications.length} />
                <InfoRow label="Interview Stage" value={
                  applications.filter(a => a.status === "interview").length
                } />
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section style={styles.statsGrid}>
          {stats.map((item, index) => (
            <div key={index} style={styles.statCard}>
              <p style={styles.statLabel}>{item.label}</p>
              <h2 style={styles.statValue}>{item.value}</h2>
              <p style={styles.statNote}>{item.note}</p>
            </div>
          ))}
        </section>

        {/* APPLICATIONS */}
        <section style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.panel}>
              <h3 style={styles.panelTitle}>Application Overview</h3>

              <div style={styles.applicationGrid}>
                {mappedApplications.map((item, index) => (
                  <div key={index} style={styles.applicationCard}>
                    <div style={styles.applicationTop}>
                      <div>
                        <p style={styles.appId}>{item.id}</p>
                        <h4 style={styles.appRole}>{item.role}</h4>
                        <p style={styles.appCompany}>{item.company}</p>
                      </div>

                      <span style={styles.statusBadge}>
                        {item.status}
                      </span>
                    </div>

                    <div style={styles.progressBarBg}>
                      <div
                        style={{
                          ...styles.progressBarFill,
                          width: `${item.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UPDATES */}
            <div style={styles.panel}>
              <h3 style={styles.panelTitle}>Recent Updates</h3>

              {updates.map((u, i) => (
                <div key={i}>
                  <h4>{u.title}</h4>
                  <p>{u.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TIMELINE */}
          <div style={styles.rightColumn}>
            <div style={styles.panel}>
              <h3 style={styles.panelTitle}>Hiring Timeline</h3>

              {timeline.map((t, i) => (
                <div key={i}>{t.step}</div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* HELPERS */
function InfoRow({ label, value }) {
  return (
    <div style={styles.infoRow}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function formatStatus(status) {
  const map = {
    applied: "Under Review",
    shortlisted: "Shortlisted",
    interview: "Interview Scheduled",
    offered: "Offer Received",
  };
  return map[status] || status;
}

function getProgress(status) {
  switch (status) {
    case "applied": return 25;
    case "shortlisted": return 60;
    case "interview": return 85;
    case "offered": return 100;
    default: return 40;
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
    background: "#ffffff",
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
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
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
    fontWeight: "700",
    padding: "10px 14px",
    borderRadius: "12px",
  },
  logoutButton: {
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#b91c1c",
    fontWeight: "700",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
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
    maxWidth: "680px",
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
  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
  },
  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  statTrend: {
    padding: "7px 10px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#3730a3",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
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
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.35fr 0.65fr",
    gap: "20px",
  },
  leftColumn: {
    display: "grid",
    gap: "20px",
  },
  rightColumn: {
    display: "grid",
    gap: "20px",
    alignContent: "start",
  },
  panel: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  panelHeader: {
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
  applicationGrid: {
    display: "grid",
    gap: "16px",
  },
  applicationCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "18px",
  },
  applicationTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "14px",
  },
  appId: {
    margin: 0,
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "12px",
  },
  appRole: {
    margin: "8px 0 6px 0",
    fontSize: "22px",
    color: "#0f172a",
  },
  appCompany: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  statusBadge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  appMetaRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },
  metaPill: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid #e2e8f0",
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
    width: "100%",
    height: "12px",
    borderRadius: "999px",
    background: "#e2e8f0",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
  },
  updateList: {
    display: "grid",
    gap: "12px",
  },
  updateItem: {
    padding: "16px",
    borderRadius: "18px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  updateTitle: {
    margin: 0,
    fontSize: "17px",
    color: "#0f172a",
  },
  updateText: {
    margin: "8px 0 0 0",
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "14px",
  },
  timelineList: {
    display: "grid",
    gap: "14px",
  },
  timelineItem: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "14px",
  },
  timelineDot: {
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    flexShrink: 0,
  },
  timelineText: {
    margin: 0,
    fontWeight: "700",
  },
  interviewCard: {
    background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
    borderRadius: "22px",
    padding: "18px",
  },
  interviewRole: {
    margin: 0,
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "13px",
  },
  interviewHeading: {
    margin: "8px 0 10px 0",
    fontSize: "24px",
    color: "#0f172a",
  },
  interviewDetail: {
    margin: "0 0 8px 0",
    color: "#475569",
    lineHeight: 1.7,
  },
  primaryButtonFull: {
    textDecoration: "none",
    display: "inline-block",
    marginTop: "14px",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "13px 16px",
    borderRadius: "14px",
    fontWeight: "700",
  },
  actionList: {
    display: "grid",
    gap: "12px",
  },
  actionButton: {
    textDecoration: "none",
    color: "#0f172a",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "15px 16px",
    fontWeight: "700",
    textAlign: "center",
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

export default CandidateDashboard;

