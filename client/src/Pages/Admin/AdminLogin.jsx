import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Only allow hr role — candidates must use Candidate login
      if (data.role !== "hr") {
        alert("Access denied. Please use the Candidate login page.");
        setLoading(false);
        return;
      }

      // Store session (same pattern as CandidateLogin)
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.role);

      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>JA</div>
          <div>
            <h2 style={styles.logoTitle}>JAPS</h2>
            <p style={styles.logoSub}>Admin Login</p>
          </div>
        </div>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/jobs" style={styles.navLink}>Jobs</Link>
          <Link to="/candidate-login" style={styles.navLink}>Candidate</Link>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>Admin Login</h1>
          <p style={styles.subtitle}>
            Access your dashboard to track applications and interview updates.
          </p>

          <form style={styles.form} onSubmit={handleSubmit}>
            <label style={styles.label} htmlFor="email">Email address</label>
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

            <label style={styles.label} htmlFor="password">Password</label>
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

            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={styles.footerText}>
            New admin?{" "}
            <Link to="/admin-signup" style={styles.link}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 28px",
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
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
    minHeight: "100vh",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "92px 28px 20px",
  },
  loginCard: {
    width: "100%",
    maxWidth: "520px",
    background: "#ffffff",
    borderRadius: "28px",
    padding: "36px",
    boxShadow: "0 20px 45px rgba(15,23,42,0.10)",
    border: "1px solid #e2e8f0",
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
    gap: "12px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#334155",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    color: "#0f172a",
  },
  submitButton: {
    width: "100%",
    boxSizing: "border-box",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
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

export default AdminLogin;