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

  if (loading) return <h2 style={{ padding: "40px" }}>Loading...</h2>;
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
          <Link to={`/jobs/${job.id}`} style={styles.breadcrumbLink}>
            ← Back to Job Details
          </Link>
        </div>

        <div style={styles.grid}>
          <div style={styles.leftColumn}>
            <div style={styles.heroCard}>
              <h1 style={styles.heroTitle}>Apply for {job.title}</h1>
              <div style={styles.jobMetaRow}>
                <span style={styles.metaPill}>📍 {job.location}</span>
                <span style={styles.metaPill}>💼 {job.type}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <input name="fullName" onChange={handleChange} placeholder="Full Name" />
              <input name="email" onChange={handleChange} placeholder="Email" />
              <input name="phone" onChange={handleChange} placeholder="Phone" />
              <input name="city" onChange={handleChange} placeholder="City" />
              <input name="education" onChange={handleChange} placeholder="Education" />
              <input name="experience" onChange={handleChange} placeholder="Experience" />
              <input name="skills" onChange={handleChange} placeholder="Skills" />
              <textarea name="coverLetter" onChange={handleChange} placeholder="Cover Letter" />
              <input type="file" name="resume" onChange={handleChange} />

              <button type="submit">Submit Application</button>
            </form>
          </div>

          <div style={styles.rightColumn}>
            <h3>{job.title}</h3>
            <p>{job.location}</p>
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
  cardMini: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
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