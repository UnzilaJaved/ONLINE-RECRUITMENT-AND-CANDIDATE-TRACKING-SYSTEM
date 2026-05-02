import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch job from backend
  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <h2 style={{ padding: "40px" }}>Loading job...</h2>;
  if (!job) return <h2 style={{ padding: "40px" }}>Job not found</h2>;

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>JA</div>
          <div>
            <h2 style={styles.logoTitle}>JAPS</h2>
            <p style={styles.logoSub}>Job Application Processing System</p>
          </div>
        </div>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/jobs" style={styles.navLink}>Jobs</Link>
          <Link to="/candidate-login" style={styles.navLink}>Login</Link>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <Link to="/jobs" style={styles.breadcrumbLink}>
            ← Back to Jobs
          </Link>
        </div>

        <section style={styles.heroCard}>
          <div style={styles.heroLeft}>
            <p style={styles.departmentTag}>{job.department}</p>
            <h1 style={styles.heroTitle}>{job.title}</h1>
            <p style={styles.heroText}>{job.description}</p>

            <div style={styles.metaRow}>
              <span style={styles.metaPill}>📍 {job.location}</span>
              <span style={styles.metaPill}>💼 {job.type}</span>
              <span style={styles.metaPill}>⭐ {job.experience || "-"}</span>
              <span style={styles.metaPill}>💰 {job.salary || "-"}</span>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>Job Summary</h3>

              <div style={styles.infoList}>
                <InfoRow label="Job Type" value={job.type} />
                <InfoRow label="Location" value={job.location} />
                <InfoRow label="Department" value={job.department} />
              </div>

              <Link to={`/apply/${job.id}`} style={styles.applyButton}>
                Apply for this Job
              </Link>
            </div>
          </div>
        </section>

        {/* 🔹 OPTIONAL: Static sections if DB doesn't have them */}
        <section style={styles.contentGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Description</h3>
              <p style={styles.cardText}>{job.description}</p>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Apply Now</h3>
              <Link to={`/apply/${job.id}`} style={styles.applyButtonFull}>
                Apply Now
              </Link>
            </div>
          </div>
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
  container: {
    padding: "28px 36px 36px 36px",
  },
  breadcrumb: {
    marginBottom: "18px",
  },
  breadcrumbLink: {
    textDecoration: "none",
    color: "#2563eb",
    fontWeight: "700",
  },
  heroCard: {
    display: "grid",
    gridTemplateColumns: "1.3fr 0.7fr",
    gap: "20px",
    marginBottom: "24px",
  },
  heroLeft: {
    background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
    borderRadius: "28px",
    padding: "32px",
  },
  heroRight: {
    display: "grid",
  },
  departmentTag: {
    margin: 0,
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: "700",
  },
  heroTitle: {
    margin: "16px 0 14px 0",
    fontSize: "46px",
    lineHeight: 1.1,
  },
  heroText: {
    margin: 0,
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.8,
  },
  metaRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "24px",
  },
  metaPill: {
    padding: "9px 13px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "700",
    border: "1px solid #e2e8f0",
  },
  summaryCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  summaryTitle: {
    margin: 0,
    fontSize: "24px",
  },
  infoList: {
    display: "grid",
    gap: "14px",
    marginTop: "20px",
    marginBottom: "22px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    paddingBottom: "12px",
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
  applyButton: {
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "14px 18px",
    borderRadius: "14px",
    fontWeight: "700",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1.25fr 0.75fr",
    gap: "20px",
  },
  leftColumn: {
    display: "grid",
    gap: "20px",
  },
  rightColumn: {
    display: "grid",
    gap: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  cardMini: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  cardTitle: {
    margin: "8px 0 16px 0",
    fontSize: "26px",
  },
  cardText: {
    margin: 0,
    color: "#475569",
    fontSize: "15px",
    lineHeight: 1.8,
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
  },
  listItem: {
    marginBottom: "12px",
    color: "#334155",
    lineHeight: 1.7,
  },
  applyButtonFull: {
    textDecoration: "none",
    display: "inline-block",
    marginTop: "22px",
    textAlign: "center",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "14px 18px",
    borderRadius: "14px",
    fontWeight: "700",
  },
};

export default JobDetails;