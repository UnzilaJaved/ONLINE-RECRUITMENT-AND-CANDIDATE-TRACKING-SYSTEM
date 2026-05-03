import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    education: "",
    experience: "",
    skills: "",
    coverLetter: "",
    resume: null,
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/candidate-login");
  };

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // 🔥 Submit application to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        jobId: id,
        ...formData,
      }),
    });

    if (res.ok) {
      navigate("/application-success");
    } else {
      alert("Error submitting application");
    }
  };

  if (loading) return null;
  if (!job) return <h2 style={{ padding: "40px" }}>Job not found</h2>;

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
          <Link to="/candidate-dashboard" style={styles.navLink}>
            Dashboard
          </Link>
          <Link to="/jobs" style={styles.navLink}>
             Jobs
          </Link>
          <Link to="/application-status" style={styles.activeNavLink}>
            Status
          </Link>
          <button type="button" onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <Link to={`/jobs/${job.id}`} style={styles.breadcrumbLink}>
            ← Back to Job Details
          </Link>
        </div>

        <div style={styles.grid}>
          <div style={styles.leftColumn}>
            <div style={styles.heroCard}>
              <p style={styles.heroMini}>Application Form</p>
              <h1 style={styles.heroTitle}>Apply for {job.title}</h1>
              <p style={styles.heroText}>
                Fill in your profile details carefully. Your application moves
                directly into the recruiter pipeline shown on your dashboard.
              </p>
              <div style={styles.jobMetaRow}>
                <span style={styles.metaPill}>📍 {job.location}</span>
                <span style={styles.metaPill}>💼 {job.type}</span>
              </div>
            </div>

            <div style={styles.formCard}>
              <p style={styles.cardMini}>Candidate Details</p>
              <h3 style={styles.cardTitle}>Application Information</h3>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGrid}>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label} htmlFor="fullName">Full Name</label>
                    <input id="fullName" name="fullName" onChange={handleChange} placeholder="Enter your full name" style={styles.input} required />
                  </div>

                  <div style={styles.fieldWrap}>
                    <label style={styles.label} htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" onChange={handleChange} placeholder="you@example.com" style={styles.input} required />
                  </div>

                  <div style={styles.fieldWrap}>
                    <label style={styles.label} htmlFor="phone">Phone</label>
                    <input id="phone" name="phone" onChange={handleChange} placeholder="+92 300 0000000" style={styles.input} required />
                  </div>

                  <div style={styles.fieldWrap}>
                    <label style={styles.label} htmlFor="city">City</label>
                    <input id="city" name="city" onChange={handleChange} placeholder="Lahore" style={styles.input} required />
                  </div>

                  <div style={styles.fieldWrap}>
                    <label style={styles.label} htmlFor="education">Education</label>
                    <input id="education" name="education" onChange={handleChange} placeholder="BS Computer Science" style={styles.input} required />
                  </div>

                  <div style={styles.fieldWrap}>
                    <label style={styles.label} htmlFor="experience">Experience</label>
                    <input id="experience" name="experience" onChange={handleChange} placeholder="2 years" style={styles.input} required />
                  </div>
                </div>

                <div style={styles.fullWidthField}>
                  <label style={styles.label} htmlFor="skills">Skills</label>
                  <input id="skills" name="skills" onChange={handleChange} placeholder="React, Node.js, PostgreSQL" style={styles.input} required />
                </div>

                <div style={styles.fullWidthField}>
                  <label style={styles.label} htmlFor="coverLetter">Cover Letter</label>
                  <textarea id="coverLetter" name="coverLetter" onChange={handleChange} placeholder="Tell us why you are a good fit for this role" style={styles.textarea} required />
                </div>

                <div style={styles.fullWidthField}>
                  <label style={styles.label} htmlFor="resume">Resume</label>
                  <input id="resume" type="file" name="resume" onChange={handleChange} style={styles.fileInput} />
                </div>

                <div style={styles.actionRow}>
                  <Link to={`/jobs/${job.id}`} style={styles.cancelButton}>Cancel</Link>
                  <button type="submit" style={styles.submitButton}>Submit Application</button>
                </div>
              </form>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={{ ...styles.summaryCard, ...styles.roleSummaryCard }}>
              <p style={{ ...styles.cardMini, ...styles.roleSummaryMini }}>Role Summary</p>
              <h3 style={styles.cardTitle}>{job.title}</h3>

              <div style={styles.infoList}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Location</span>
                  <span style={styles.infoValue}>{job.location || "-"}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Type</span>
                  <span style={styles.infoValue}>{job.type || "-"}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Department</span>
                  <span style={styles.infoValue}>{job.department || "General"}</span>
                </div>
              </div>
            </div>

            <div style={{ ...styles.summaryCard, ...styles.tipsSummaryCard }}>
              <p style={{ ...styles.cardMini, ...styles.tipsSummaryMini }}>Tips</p>
              <h3 style={styles.cardTitle}>Before You Submit</h3>
              <div style={styles.tipList}>
                <div style={{ ...styles.tipItem, ...styles.tipItemOne }}>Keep your cover letter role-specific and concise.</div>
                <div style={{ ...styles.tipItem, ...styles.tipItemTwo }}>Highlight measurable achievements in your skills and experience.</div>
                <div style={{ ...styles.tipItem, ...styles.tipItemThree }}>Double-check contact details so recruiters can reach you quickly.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  breadcrumb: {
    marginBottom: "18px",
  },
  breadcrumbLink: {
    textDecoration: "none",
    color: "#2563eb",
    fontWeight: "700",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.3fr 0.7fr",
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
  heroCard: {
    background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
    borderRadius: "28px",
    padding: "30px",
  },
  heroMini: {
    margin: 0,
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "14px",
  },
  heroTitle: {
    margin: "12px 0 12px 0",
    fontSize: "40px",
    lineHeight: 1.1,
  },
  heroText: {
    margin: 0,
    color: "#475569",
    fontSize: "15px",
    lineHeight: 1.8,
  },
  jobMetaRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "20px",
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
  formCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  summaryCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  roleSummaryCard: {
    background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 55%)",
    border: "1px solid #dbeafe",
  },
  tipsSummaryCard: {
    background: "linear-gradient(135deg, #f5f3ff 0%, #ffffff 55%)",
    border: "1px solid #e9d5ff",
  },
  cardMini: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  roleSummaryMini: {
    color: "#1d4ed8",
    fontWeight: "700",
    letterSpacing: "0.2px",
  },
  tipsSummaryMini: {
    color: "#6d28d9",
    fontWeight: "700",
    letterSpacing: "0.2px",
  },
  cardTitle: {
    margin: "8px 0 18px 0",
    fontSize: "24px",
  },
  form: {
    display: "grid",
    gap: "18px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },
  fieldWrap: {
    display: "grid",
    gap: "8px",
  },
  fullWidthField: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#334155",
    fontWeight: "700",
  },
  input: {
    height: "52px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    padding: "0 14px",
    fontSize: "14px",
    outline: "none",
    background: "#f8fafc",
    boxSizing: "border-box",
  },
  textarea: {
    minHeight: "130px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    padding: "14px",
    fontSize: "14px",
    outline: "none",
    background: "#f8fafc",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },
  fileInput: {
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    padding: "14px",
    fontSize: "14px",
    background: "#f8fafc",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
  },
  cancelButton: {
    textDecoration: "none",
    background: "#ffffff",
    color: "#0f172a",
    padding: "14px 20px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    fontWeight: "700",
  },
  submitButton: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "14px 20px",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  tipList: {
    display: "grid",
    gap: "12px",
  },
  tipItem: {
    padding: "14px 16px",
    borderRadius: "16px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    lineHeight: 1.6,
    fontSize: "14px",
  },
  tipItemOne: {
    background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
    border: "1px solid #bfdbfe",
  },
  tipItemTwo: {
    background: "linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)",
    border: "1px solid #ddd6fe",
  },
  tipItemThree: {
    background: "linear-gradient(135deg, #ecfeff 0%, #ffffff 100%)",
    border: "1px solid #a5f3fc",
  },
  infoList: {
    display: "grid",
    gap: "14px",
    marginTop: "8px",
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
};

export default Apply;