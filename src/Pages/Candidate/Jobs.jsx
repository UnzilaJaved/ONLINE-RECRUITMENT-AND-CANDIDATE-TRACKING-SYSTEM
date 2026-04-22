import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

function Jobs() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Karachi",
      type: "Full Time",
      salary: "PKR 120,000 - 180,000",
      experience: "2+ Years",
      description:
        "Build modern user interfaces, reusable React components, and responsive dashboards.",
    },
    {
      id: 2,
      title: "Backend Developer",
      department: "Engineering",
      location: "Lahore",
      type: "Full Time",
      salary: "PKR 140,000 - 200,000",
      experience: "3+ Years",
      description:
        "Work on APIs, database integration, authentication, and backend services.",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote",
      type: "Remote",
      salary: "PKR 100,000 - 150,000",
      experience: "1+ Year",
      description:
        "Design user flows, wireframes, and polished product interfaces for web platforms.",
    },
    {
      id: 4,
      title: "HR Associate",
      department: "Human Resources",
      location: "Karachi",
      type: "Part Time",
      salary: "PKR 70,000 - 95,000",
      experience: "1+ Year",
      description:
        "Assist in recruitment coordination, candidate communication, and hiring support.",
    },
    {
      id: 5,
      title: "QA Engineer",
      department: "Quality Assurance",
      location: "Remote",
      type: "Contract",
      salary: "PKR 90,000 - 130,000",
      experience: "2+ Years",
      description:
        "Test system functionality, identify bugs, and maintain product quality standards.",
    },
    {
      id: 6,
      title: "Project Coordinator",
      department: "Operations",
      location: "Islamabad",
      type: "Full Time",
      salary: "PKR 85,000 - 120,000",
      experience: "2+ Years",
      description:
        "Coordinate project timelines, teams, meetings, and progress reporting.",
    },
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.department.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase());

      const matchType = selectedType === "All" || job.type === selectedType;
      const matchLocation =
        selectedLocation === "All" || job.location === selectedLocation;

      return matchSearch && matchType && matchLocation;
    });
  }, [search, selectedType, selectedLocation]);

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
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navLink}>
            Home
          </Link>
          <Link to="/jobs" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.activeNavLink}>
            Jobs
          </Link>
          <Link to="/candidate-login" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.login}>
            Login
          </Link>
        </div>
      </nav>

      <section style={styles.hero}>
        <div>
          <p style={styles.heroMini}>Career Opportunities</p>
          <h1 style={styles.heroTitle}>Find the role that fits you best</h1>
          <p style={styles.heroText}>
            Explore premium opportunities, compare requirements, and apply in a
            smooth and modern experience.
          </p>
        </div>

        <div style={styles.heroBadgeBox}>
          <div style={styles.heroBadge}>
            <h3 style={styles.heroBadgeValue}>{jobs.length}</h3>
            <p style={styles.heroBadgeLabel}>Open Positions</p>
          </div>
          <div style={styles.heroBadge}>
            <h3 style={styles.heroBadgeValue}>6</h3>
            <p style={styles.heroBadgeLabel}>Departments Hiring</p>
          </div>
        </div>
      </section>

      <section style={styles.filterSection}>
        <div style={styles.searchWrap}>
          <input
            type="text"
            placeholder="Search jobs by title, department, or skill"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterWrap}>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={styles.select}
          >
            <option>All</option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Remote</option>
            <option>Contract</option>
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={styles.select}
          >
            <option>All</option>
            <option>Karachi</option>
            <option>Lahore</option>
            <option>Islamabad</option>
            <option>Remote</option>
          </select>
        </div>
      </section>

      <section style={styles.resultsBar}>
        <p style={styles.resultsText}>
          Showing <strong>{filteredJobs.length}</strong> available jobs
        </p>
      </section>

      <section style={styles.jobsGrid}>
        {filteredJobs.map((job) => (
          <div key={job.id} style={styles.jobCard}>
            <div style={styles.cardTop}>
              <div>
                <p style={styles.departmentTag}>{job.department}</p>
                <h3 style={styles.jobTitle}>{job.title}</h3>
              </div>
              <span style={styles.typeBadge}>{job.type}</span>
            </div>

            <div style={styles.metaRow}>
              <span style={styles.metaPill}>📍 {job.location}</span>
              <span style={styles.metaPill}>💼 {job.experience}</span>
              <span style={styles.metaPill}>💰 {job.salary}</span>
            </div>

            <p style={styles.jobDescription}>{job.description}</p>

            <div style={styles.cardButtons}>
              <Link to={`/jobs/${job.id}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.viewButton}>
                View Details
              </Link>
              <Link to={`/apply/${job.id}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.applyButton}>
                Apply Now
              </Link>
            </div>
          </div>
        ))}
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
  login: {
    textDecoration: "none",
    color: "#fff",
    background: "#0f172a",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: "700",
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
  hero: {
    margin: "28px 36px 20px 36px",
    background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
    borderRadius: "30px",
    padding: "38px",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  heroMini: {
    margin: 0,
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "14px",
  },
  heroTitle: {
    margin: "12px 0 14px 0",
    fontSize: "46px",
    lineHeight: 1.1,
    maxWidth: "720px",
    color: "#2563eb",
  },
  heroText: {
    margin: 0,
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.8,
    maxWidth: "680px",
  },
  heroBadgeBox: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  heroBadge: {
    minWidth: "160px",
    background: "#ffffff",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
  },
  heroBadgeValue: {
    margin: 0,
    fontSize: "30px",
  },
  heroBadgeLabel: {
    margin: "8px 0 0 0",
    color: "#64748b",
  },
  filterSection: {
    margin: "0 36px 18px 36px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "18px",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  searchWrap: {
    flex: 1,
    minWidth: "280px",
  },
  searchInput: {
    width: "100%",
    height: "54px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    padding: "0 16px",
    fontSize: "15px",
    background: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
  },
  filterWrap: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  select: {
    height: "54px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    padding: "0 14px",
    background: "#f8fafc",
    fontSize: "14px",
    fontWeight: "600",
    outline: "none",
  },
  resultsBar: {
    margin: "0 36px 18px 36px",
  },
  resultsText: {
    margin: 0,
    color: "#475569",
    fontSize: "15px",
  },
  jobsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    padding: "0 36px 36px 36px",
  },
  jobCard: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  departmentTag: {
    margin: 0,
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#3730a3",
    fontSize: "12px",
    fontWeight: "700",
  },
  jobTitle: {
    margin: "12px 0 0 0",
    fontSize: "24px",
  },
  typeBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#ecfeff",
    color: "#155e75",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  metaRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  metaPill: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#f1f5f9",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "700",
  },
  jobDescription: {
    margin: 0,
    color: "#475569",
    fontSize: "15px",
    lineHeight: 1.8,
  },
  cardButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "22px",
    flexWrap: "wrap",
  },
  viewButton: {
    textDecoration: "none",
    color: "#0f172a",
    background: "#ffffff",
    border: "1px solid #dbe2ea",
    padding: "12px 15px",
    borderRadius: "12px",
    fontWeight: "700",
  },
  applyButton: {
    textDecoration: "none",
    color: "#ffffff",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    padding: "12px 15px",
    borderRadius: "12px",
    fontWeight: "700",
  },
};

export default Jobs;