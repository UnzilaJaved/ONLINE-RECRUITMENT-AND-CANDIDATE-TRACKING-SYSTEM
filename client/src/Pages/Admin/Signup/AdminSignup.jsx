import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Admin account created successfully.");
      } else {
        alert(data.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* ── Top Bar: heading stays left, same as AdminDashboard ── */}
      <div style={styles.topBar}>
        <div>
          <p style={styles.topSmall}>HR Portal</p>
          <h1 style={styles.topHeading}>Create Admin Account</h1>
          <p style={styles.topSub}>
            Register a new HR/Admin account to manage jobs, applications, and
            interviews across the recruitment platform.
          </p>
        </div>
      </div>

      {/* ── Form centered on the page ── */}
      <div style={styles.formCenter}>
        <div style={styles.largePanel}>

          <div style={styles.panelHeader}>
            <div>
              <p style={styles.panelMini}>New Account</p>
              <h3 style={styles.panelTitle}>Admin Registration</h3>
            </div>
          </div>

          <form style={styles.form} onSubmit={handleSubmit}>

            {/* Name row */}
            <div style={styles.nameRow}>
              <div style={styles.inputGroup}>
                <label style={styles.fieldLabel} htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                  style={styles.input}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.fieldLabel} htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  style={styles.input}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div style={styles.inputGroup}>
              <label style={styles.fieldLabel} htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@company.com"
                style={styles.input}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password row */}
            <div style={styles.nameRow}>
              <div style={styles.inputGroup}>
                <label style={styles.fieldLabel} htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  style={styles.input}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.fieldLabel} htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  style={styles.input}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              style={{ ...styles.submitButton, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Admin Account"}
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}

const styles = {
  // ── Page ──────────────────────────────────────────────────────────────────
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "28px",
    fontFamily: "Arial, sans-serif",
  },

  // ── Top bar: heading pinned to the left, exactly like AdminDashboard ──────
  topBar: {
    display: "flex",
    justifyContent: "flex-start",      // left-align only
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  topSmall: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  topHeading: {
    margin: "8px 0 10px 0",
    fontSize: "38px",
    lineHeight: 1.1,
    color: "#0f172a",
  },
  topSub: {
    margin: 0,
    maxWidth: "560px",
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "15px",
  },

  // ── Form: centered horizontally on the page ───────────────────────────────
  formCenter: {
    display: "flex",
    justifyContent: "center",          // horizontally centered
    alignItems: "flex-start",
  },
  largePanel: {
    width: "100%",
    maxWidth: "620px",                 // comfortable reading width
    background: "#ffffff",
    borderRadius: "26px",
    padding: "28px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },

  // ── Panel header ──────────────────────────────────────────────────────────
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "24px",
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
  panelLink: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "14px",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },

  // ── Form fields ───────────────────────────────────────────────────────────
  form: {
    display: "grid",
    gap: "16px",
  },
  nameRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  inputGroup: {
    display: "grid",
    gap: "8px",
  },
  fieldLabel: {
    textAlign: "left",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
    padding: 0,
    margin: 0,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
  },

  // ── Role notice ───────────────────────────────────────────────────────────
  noteItem: {
    padding: "15px 16px",
    borderRadius: "16px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  // ── Submit button ─────────────────────────────────────────────────────────
  submitButton: {
    width: "100%",
    boxSizing: "border-box",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "16px",
    padding: "16px 20px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "4px",
  },
};

export default AdminSignup;