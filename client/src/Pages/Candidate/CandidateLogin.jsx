import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function CandidateLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    const data = await res.json()

    if (res.ok) {
      navigate('/candidate-dashboard')
    } else {
      alert(data.error)
    }
  }

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>JA</div>
          <div>
            <h2 style={styles.logoTitle}>JAPS</h2>
            <p style={styles.logoSub}>Candidate Login</p>
          </div>
        </div>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>
            Home
          </Link>
          <Link to="/jobs" style={styles.navLink}>
            Jobs
          </Link>
          <Link to="/candidate-login" style={styles.activeNavLink}>
            Login
          </Link>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>Candidate Login</h1>
          <p style={styles.subtitle}>
            Access your dashboard to track applications and interview updates.
          </p>

          <form style={styles.form} onSubmit={handleSubmit}>
            <label style={styles.label} htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              style={styles.input}
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              style={styles.input}
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            <button type="submit" style={styles.submitButton}>
              Sign In
            </button>
          </form>

          <p style={styles.footerText}>
            Don't have an account? <Link to="/candidate-signup" style={styles.link}>Create one</Link>
          </p>
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
  container: {
    minHeight: "calc(100vh - 93px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "36px",
  },
  loginCard: {
    width: "100%",
    maxWidth: "520px",
    background: "#ffffff",
    borderRadius: "28px",
    padding: "36px",
    boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
    border: "1px solid #eef2f7",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    color: "#0f172a",
  },
  subtitle: {
    margin: "12px 0 28px",
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  form: {
    display: "grid",
    gap: "18px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    color: "#0f172a",
  },
  submitButton: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "16px",
    padding: "14px 20px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },
  footerText: {
    margin: "24px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "700",
  },
};

export default CandidateLogin;
