import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function CandidateSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    navigate("/candidate-login");
  };

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>
            <div style={styles.logoInner}>JA</div>
          </div>
          <div>
            <h2 style={styles.logoTitle}>JAPS</h2>
            <p style={styles.logoSub}>Premium Recruitment Platform</p>
          </div>
        </div>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>
            Home
          </Link>
          <Link to="/jobs" style={styles.navLink}>
            Jobs
          </Link>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.signupCard}>
          <div style={styles.headerDecoration}>
            <div style={styles.iconWrapper}>
              <div style={styles.icon}>👤</div>
            </div>
          </div>

          <div style={styles.content}>
            <h1 style={styles.title}>Create Your Premium Account</h1>
            <p style={styles.subtitle}>
              Sign up now to unlock exclusive jobs, deeper insights, and
              priority support.
            </p>

            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.nameRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label} htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    style={styles.input}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label} htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    style={styles.input}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label} htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@company.com"
                  style={styles.input}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label} htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password (min. 8 characters)"
                  style={styles.input}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label} htmlFor="confirmPassword">
                  Confirm Password
                </label>
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

              <button type="submit" style={styles.submitButton}>
                <span style={styles.buttonText}>Get Started</span>
                <div style={styles.buttonGlow}></div>
              </button>
            </form>

            <div style={styles.divider}>
              <span style={styles.dividerText}>Already have an account?</span>
            </div>

            <Link to="/candidate-login" style={styles.loginLink}>
              Sign in to your account
            </Link>
          </div>
        </div>

        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🎯</div>
            <h3 style={styles.featureTitle}>Personalized Matches</h3>
            <p style={styles.featureText}>
              AI-powered job recommendations tailored to your profile
            </p>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureTitle}>Advanced Analytics</h3>
            <p style={styles.featureText}>
              Track application performance and interview progress
            </p>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}>🚀</div>
            <h3 style={styles.featureTitle}>Priority Support</h3>
            <p style={styles.featureText}>
              Dedicated assistance for premium members
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#0f172a",
    position: "relative",
    overflow: "hidden",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 40px",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    position: "sticky",
    top: 0,
    zIndex: 10,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  logo: {
    width: "56px",
    height: "56px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
    position: "relative",
  },
  logoInner: {
    color: "#fff",
    fontWeight: "800",
    fontSize: "20px",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  logoTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  logoSub: {
    margin: "4px 0 0 0",
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  navLinks: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  navLink: {
    textDecoration: "none",
    color: "#475569",
    fontWeight: "600",
    padding: "12px 20px",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    fontSize: "14px",
  },
  container: {
    minHeight: "calc(100vh - 97px)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 20px",
    gap: "60px",
    flexWrap: "wrap",
  },
  signupCard: {
    flex: "1 1 480px",
    minWidth: "320px",
    maxWidth: "520px",
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "0",
    boxShadow:
      "0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    position: "relative",
    overflow: "hidden",
  },
  headerDecoration: {
    height: "120px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
  icon: {
    fontSize: "32px",
    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
  },
  content: {
    padding: "40px",
  },
  title: {
    margin: "0 0 12px 0",
    fontSize: "32px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textAlign: "center",
  },
  subtitle: {
    margin: "0 0 32px 0",
    color: "#64748b",
    lineHeight: 1.6,
    fontSize: "16px",
    textAlign: "center",
    fontWeight: "400",
  },
  form: {
    display: "grid",
    gap: "24px",
  },
  nameRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  inputGroup: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    fontSize: "15px",
    color: "#111827",
    background: "#ffffff",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
  },
  submitButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "16px 24px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    transition: "all 0.3s ease",
  },
  buttonText: {
    position: "relative",
    zIndex: 2,
  },
  buttonGlow: {
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
    transition: "left 0.5s ease",
  },
  divider: {
    margin: "32px 0",
    textAlign: "center",
    position: "relative",
  },
  dividerText: {
    background: "#ffffff",
    padding: "0 16px",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "500",
  },
  loginLink: {
    display: "block",
    textDecoration: "none",
    color: "#667eea",
    fontWeight: "600",
    fontSize: "16px",
    textAlign: "center",
    padding: "12px 24px",
    borderRadius: "12px",
    background: "rgba(102, 126, 234, 0.1)",
    border: "1px solid rgba(102, 126, 234, 0.2)",
    transition: "all 0.3s ease",
  },
  features: {
    flex: "0 0 340px",
    display: "grid",
    gap: "24px",
    maxWidth: "340px",
    minWidth: "280px",
  },
  feature: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "22px",
    padding: "28px",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "transform 0.3s ease",
  },
  featureIcon: {
    fontSize: "32px",
    marginBottom: "12px",
  },
  featureTitle: {
    margin: "0 0 8px 0",
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
  },
  featureText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.5,
  },
};

export default CandidateSignup;