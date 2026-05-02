import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch data from backend
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    fetch(`/api/candidate/dashboard/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 🔹 Dynamic Stats
  const stats = [
    {
      label: "Applications Submitted",
      value: applications.length,
      note: "Across active roles",
      trend: "",
    },
    {
      label: "Under Review",
      value: applications.filter(a => a.status === "applied").length,
      note: "Waiting on recruiter review",
      trend: "",
    },
    {
      label: "Shortlisted",
      value: applications.filter(a => a.status === "shortlisted").length,
      note: "Moved to next stage",
      trend: "",
    },
    {
      label: "Interviews",
      value: applications.filter(a => a.status === "interview").length,
      note: "Upcoming interview round",
      trend: "",
    },
  ];

  if (loading) return <h2 style={{ padding: "40px" }}>Loading...</h2>;

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>JA</div>
          <div>
            <h2 style={styles.logoTitle}>JAPS</h2>
            <p style={styles.logoSub}>Candidate Dashboard</p>
          </div>
        </div>

        <div style={styles.navLinks}>
          <Link to="/candidate-dashboard" 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={styles.navLink}>
            Home
          </Link>
          {/*}
          <Link to="/jobs" style={styles.navLink}>Jobs</Link>
          */}
          <Link to="/application-status" 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
          style={styles.activeNavLink}>
            Status
          </Link>
          <Link to="/candidate-login" 
          onClick={() => {
            localStorage.removeItem("user");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} 
          style={styles.logout}>
            Logout
          </Link>
        </div>
      </nav>

      <div style={styles.container}>
        <section style={styles.heroSection}>
          <div style={styles.heroLeft}>
            <p style={styles.heroMini}>Welcome back</p>
            <h1 style={styles.heroTitle}>Your hiring journey, all in one place</h1>
            <p style={styles.heroText}>
              Track applications, monitor progress, and follow interview updates.
            </p>
          </div>
        </section>

        {/* 🔹 Dynamic Stats */}
        <section style={styles.statsGrid}>
          {stats.map((item, index) => (
            <div key={index} style={styles.statCard}>
              <p style={styles.statLabel}>{item.label}</p>
              <h2 style={styles.statValue}>{item.value}</h2>
              <p style={styles.statNote}>{item.note}</p>
            </div>
          ))}
        </section>

        {/* 🔹 Applications */}
        <section style={styles.panel}>
          <h3 style={styles.panelTitle}>My Applications</h3>

          <div style={styles.applicationGrid}>
            {applications.length === 0 && <p>No applications yet</p>}

            {applications.map((app, index) => (
              <div key={index} style={styles.applicationCard}>
                <h4 style={styles.appRole}>{app.jobs?.title}</h4>

                <p style={styles.appCompany}>
                  Status:{" "}
                  <span
                    style={{
                      ...styles.statusBadge,
                      background: getStatusStyle(app.status).bg,
                      color: getStatusStyle(app.status).text,
                    }}
                  >
                    {app.status}
                  </span>
                </p>

                {app.interviews?.length > 0 && (
                  <p style={styles.appMeta}>
                    Interview: {app.interviews[0].interview_date}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// 🔹 Status colors
function getStatusStyle(status) {
  if (status === "shortlisted") return { bg: "#dcfce7", text: "#166534" };
  if (status === "interview") return { bg: "#ede9fe", text: "#5b21b6" };
  if (status === "rejected") return { bg: "#fee2e2", text: "#991b1b" };
  return { bg: "#dbeafe", text: "#1d4ed8" };
}

const styles = {
  page: { padding: "20px", fontFamily: "Arial" },
  navbar: { display: "flex", justifyContent: "space-between" },
  logoWrap: { display: "flex", gap: "10px" },
  logo: { background: "#2563eb", color: "#fff", padding: "10px" },
  navLinks: { display: "flex", gap: "10px" },
  navLink: { textDecoration: "none" },
  activeNavLink: { color: "blue" },
  container: { padding: "28px 36px 36px 36px"},
  heroSection: { marginBottom: "20px" },
  statsGrid: { display: "flex", gap: "10px" },
  statCard: { padding: "10px", border: "1px solid #ddd" },
  applicationGrid: { display: "grid", gap: "10px" },
  applicationCard: { padding: "10px", border: "1px solid #ddd" },
  statusBadge: { padding: "5px 10px", borderRadius: "10px" },
  logout: { textDecoration: "none", color: "#dc2626", fontWeight: "700", background: "#fee2e2", padding: "10px 14px", borderRadius: "12px" },
};

export default CandidateDashboard;