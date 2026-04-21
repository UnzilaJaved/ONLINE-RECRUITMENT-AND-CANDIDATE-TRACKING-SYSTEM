import { Link, useParams } from "react-router-dom";

function JobDetails() {
  const { id } = useParams();

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Karachi",
      type: "Full Time",
      salary: "PKR 120,000 - 180,000",
      experience: "2+ Years",
      postedDate: "20 Apr 2026",
      deadline: "30 Apr 2026",
      about:
        "We are looking for a skilled Frontend Developer to build responsive, modern, and scalable user interfaces for our web platform.",
      responsibilities: [
        "Develop reusable React components and responsive pages",
        "Work closely with UI/UX designers for accurate implementation",
        "Integrate frontend with backend APIs",
        "Improve performance and user experience across the platform",
      ],
      requirements: [
        "Strong command of React.js and JavaScript",
        "Good understanding of HTML, CSS, and responsive design",
        "Experience with Git and component-based development",
        "Ability to work in a collaborative team environment",
      ],
      benefits: [
        "Competitive salary package",
        "Growth opportunities and mentorship",
        "Supportive team environment",
        "Performance-based bonuses",
      ],
    },
    {
      id: 2,
      title: "Backend Developer",
      department: "Engineering",
      location: "Lahore",
      type: "Full Time",
      salary: "PKR 140,000 - 200,000",
      experience: "3+ Years",
      postedDate: "19 Apr 2026",
      deadline: "29 Apr 2026",
      about:
        "We need a Backend Developer to build secure APIs, manage database operations, and support scalable application logic.",
      responsibilities: [
        "Develop and maintain backend APIs",
        "Handle authentication and database logic",
        "Optimize server-side performance",
        "Collaborate with frontend and QA teams",
      ],
      requirements: [
        "Experience with backend frameworks",
        "Good knowledge of SQL and database design",
        "Understanding of REST APIs",
        "Problem-solving and debugging skills",
      ],
      benefits: [
        "Medical support",
        "Flexible learning environment",
        "Career development opportunities",
        "Team collaboration culture",
      ],
    },
    {
      id: 3,
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote",
      type: "Remote",
      salary: "PKR 100,000 - 150,000",
      experience: "1+ Year",
      postedDate: "18 Apr 2026",
      deadline: "28 Apr 2026",
      about:
        "We are hiring a UI/UX Designer to create engaging digital experiences, user flows, and polished product designs.",
      responsibilities: [
        "Create wireframes and design mockups",
        "Design intuitive user journeys",
        "Maintain design consistency",
        "Work with product and development teams",
      ],
      requirements: [
        "Proficiency in Figma or similar tools",
        "Understanding of UX principles",
        "Strong visual design skills",
        "Good communication and collaboration",
      ],
      benefits: [
        "Remote flexibility",
        "Creative work environment",
        "Project ownership opportunities",
        "Skill development support",
      ],
    },
  ];

  const job = jobs.find((item) => item.id === Number(id)) || jobs[0];

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
          <Link to="/" style={styles.navLink}>
            Home
          </Link>
          <Link to="/jobs" style={styles.navLink}>
            Jobs
          </Link>
          <Link to="/candidate-login" style={styles.navLink}>
            Login
          </Link>
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
            <p style={styles.heroText}>{job.about}</p>

            <div style={styles.metaRow}>
              <span style={styles.metaPill}>📍 {job.location}</span>
              <span style={styles.metaPill}>💼 {job.type}</span>
              <span style={styles.metaPill}>⭐ {job.experience}</span>
              <span style={styles.metaPill}>💰 {job.salary}</span>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>Job Summary</h3>

              <div style={styles.infoList}>
                <InfoRow label="Posted On" value={job.postedDate} />
                <InfoRow label="Deadline" value={job.deadline} />
                <InfoRow label="Job Type" value={job.type} />
                <InfoRow label="Location" value={job.location} />
              </div>

              <Link to={`/apply/${job.id}`} style={styles.applyButton}>
                Apply for this Job
              </Link>
            </div>
          </div>
        </section>

        <section style={styles.contentGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.card}>
              <p style={styles.cardMini}>Role Details</p>
              <h3 style={styles.cardTitle}>Key Responsibilities</h3>
              <ul style={styles.list}>
                {job.responsibilities.map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.card}>
              <p style={styles.cardMini}>Candidate Profile</p>
              <h3 style={styles.cardTitle}>Requirements</h3>
              <ul style={styles.list}>
                {job.requirements.map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.card}>
              <p style={styles.cardMini}>What You Get</p>
              <h3 style={styles.cardTitle}>Benefits</h3>
              <ul style={styles.list}>
                {job.benefits.map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.card}>
              <p style={styles.cardMini}>Ready to Apply?</p>
              <h3 style={styles.cardTitle}>Start Your Application</h3>
              <p style={styles.cardText}>
                Submit your details, upload your CV, and move one step closer to
                your next opportunity.
              </p>

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