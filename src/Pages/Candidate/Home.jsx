import { Link } from "react-router-dom";

function Home() {
  const features = [
    {
      title: "Easy Job Search",
      text: "Browse open positions and find roles that match your skills and goals.",
    },
    {
      title: "Quick Application",
      text: "Apply with your details, upload your CV, and submit in a smooth process.",
    },
    {
      title: "Track Your Status",
      text: "Check whether your application is under review, shortlisted, or selected.",
    },
  ];

  const topJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      location: "Karachi",
      type: "Full Time",
    },
    {
      id: 2,
      title: "Backend Developer",
      location: "Lahore",
      type: "Full Time",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      location: "Remote",
      type: "Remote",
    },
  ];

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
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navLink}>Home</Link>
          <Link to="/jobs" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navLink}>Jobs</Link>
          <Link to="/candidate-login" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navLink}>Login</Link>
          <Link to="/admin-login" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.adminButton}>Admin</Link>
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <p style={styles.heroTag}>Smart Hiring Experience</p>
          <h1 style={styles.heroTitle}>
            Find the right job and apply with confidence
          </h1>
          <p style={styles.heroText}>
            Explore available opportunities, submit your application online,
            and track your progress from one simple and modern platform.
          </p>

          <div style={styles.heroButtons}>
            <Link to="/jobs" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.primaryButton}>Explore Jobs</Link>
            <Link to="/candidate-login" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.secondaryButton}>
              Track Application
            </Link>
          </div>
        </div>

        <div style={styles.heroCard}>
          <h3 style={styles.heroCardTitle}>Why use JAPS?</h3>
          <div style={styles.heroStatBox}>
            <div style={styles.heroStat}>
              <h2 style={styles.heroStatValue}>150+</h2>
              <p style={styles.heroStatLabel}>Applications Processed</p>
            </div>
            <div style={styles.heroStat}>
              <h2 style={styles.heroStatValue}>24</h2>
              <p style={styles.heroStatLabel}>Open Positions</p>
            </div>
            <div style={styles.heroStat}>
              <h2 style={styles.heroStatValue}>8</h2>
              <p style={styles.heroStatLabel}>Departments Hiring</p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionMini}>Platform Benefits</p>
          <h2 style={styles.sectionTitle}>Everything candidates need</h2>
        </div>

        <div style={styles.featureGrid}>
          {features.map((item, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureIcon}>{index + 1}</div>
              <h3 style={styles.featureTitle}>{item.title}</h3>
              <p style={styles.featureText}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.jobsSection}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionMini}>Opportunities</p>
          <h2 style={styles.sectionTitle}>Featured Open Roles</h2>
        </div>

        <div style={styles.jobGrid}>
          {topJobs.map((job) => (
            <div key={job.id} style={styles.jobCard}>
              <h3 style={styles.jobTitle}>{job.title}</h3>
              <p style={styles.jobMeta}>📍 {job.location}</p>
              <p style={styles.jobMeta}>💼 {job.type}</p>

              <div style={styles.jobActions}>
                <Link to={`/jobs/${job.id}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.jobViewButton}>
                  View Details
                </Link>
                <Link to={`/apply/${job.id}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.jobApplyButton}>
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.centerButtonWrap}>
          <Link to="/jobs" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.primaryButton}>See All Jobs</Link>
        </div>
      </section>
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
  adminButton: {
    textDecoration: "none",
    color: "#fff",
    background: "#0f172a",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: "700",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "24px",
    padding: "48px 36px",
    alignItems: "center",
  },
  heroLeft: {
    background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
    borderRadius: "28px",
    padding: "40px",
  },
  heroTag: {
    display: "inline-block",
    margin: 0,
    padding: "8px 14px",
    background: "#dbeafe",
    color: "#1d4ed8",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "13px",
  },
  heroTitle: {
    fontSize: "52px",
    lineHeight: 1.1,
    margin: "18px 0 16px 0",
    color: "#2563eb",
  },
  heroText: {
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.8,
    maxWidth: "640px",
  },
  heroButtons: {
    display: "flex",
    gap: "14px",
    marginTop: "26px",
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
  heroCard: {
    background: "#0f172a",
    color: "#fff",
    borderRadius: "28px",
    padding: "34px",
    minHeight: "100%",
  },
  heroCardTitle: {
    margin: 0,
    fontSize: "26px",
  },
  heroStatBox: {
    display: "grid",
    gap: "18px",
    marginTop: "24px",
  },
  heroStat: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "18px",
  },
  heroStatValue: {
    margin: 0,
    fontSize: "34px",
  },
  heroStatLabel: {
    margin: "8px 0 0 0",
    color: "#cbd5e1",
  },
  featuresSection: {
    padding: "10px 36px 36px 36px",
  },
  sectionHeader: {
    marginBottom: "20px",
  },
  sectionMini: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  sectionTitle: {
    margin: "8px 0 0 0",
    fontSize: "34px",
    color: "#2563eb",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
  },
  featureCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  featureIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    background: "#eef2ff",
    color: "#3730a3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    marginBottom: "14px",
  },
  featureTitle: {
    margin: 0,
    fontSize: "20px",
  },
  featureText: {
    margin: "10px 0 0 0",
    color: "#475569",
    lineHeight: 1.7,
  },
  jobsSection: {
    padding: "0 36px 50px 36px",
  },
  jobGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
  },
  jobCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  jobTitle: {
    margin: 0,
    fontSize: "22px",
  },
  jobMeta: {
    margin: "10px 0 0 0",
    color: "#64748b",
  },
  jobActions: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  jobViewButton: {
    textDecoration: "none",
    color: "#0f172a",
    background: "#fff",
    border: "1px solid #dbe2ea",
    padding: "11px 14px",
    borderRadius: "12px",
    fontWeight: "700",
  },
  jobApplyButton: {
    textDecoration: "none",
    color: "#fff",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    padding: "11px 14px",
    borderRadius: "12px",
    fontWeight: "700",
  },
  centerButtonWrap: {
    marginTop: "24px",
    textAlign: "center",
  },
};

export default Home;