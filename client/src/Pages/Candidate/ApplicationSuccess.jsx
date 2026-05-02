import { Link } from "react-router-dom";

function ApplicationSuccess() {
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
        <div style={styles.successCard}>
          <div style={styles.iconWrap}>✓</div>

          <p style={styles.successMini}>Application Submitted</p>
          <h1 style={styles.successTitle}>Your application was sent successfully</h1>
          <p style={styles.successText}>
            Thank you for applying. Your application has been received and is now
            under initial review. You can track the progress of your application
            from your candidate dashboard.
          </p>

          <div style={styles.summaryBox}>
            <h3 style={styles.summaryTitle}>What happens next?</h3>

            <div style={styles.stepList}>
              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>1</div>
                <div>
                  <h4 style={styles.stepTitle}>Application Review</h4>
                  <p style={styles.stepText}>
                    Our team will review your submitted profile and supporting
                    details.
                  </p>
                </div>
              </div>

              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>2</div>
                <div>
                  <h4 style={styles.stepTitle}>Shortlisting Decision</h4>
                  <p style={styles.stepText}>
                    If your profile matches the role, you may be shortlisted for
                    the next stage.
                  </p>
                </div>
              </div>

              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>3</div>
                <div>
                  <h4 style={styles.stepTitle}>Interview or Final Update</h4>
                  <p style={styles.stepText}>
                    You will receive status updates through your application
                    dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.buttonRow}>
            <Link to="/candidate-dashboard" style={styles.primaryButton}>
              Go to Dashboard
            </Link>
            <Link to="/jobs" style={styles.secondaryButton}>
              Explore More Jobs
            </Link>
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
    minHeight: "calc(100vh - 93px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "36px",
  },
  successCard: {
    width: "100%",
    maxWidth: "900px",
    background: "#ffffff",
    borderRadius: "32px",
    padding: "40px",
    boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
    border: "1px solid #eef2f7",
    textAlign: "center",
  },
  iconWrap: {
    width: "88px",
    height: "88px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "38px",
    fontWeight: "800",
    margin: "0 auto 20px auto",
    boxShadow: "0 15px 35px rgba(34,197,94,0.25)",
  },
  successMini: {
    margin: 0,
    color: "#16a34a",
    fontWeight: "700",
    fontSize: "14px",
  },
  successTitle: {
    margin: "12px 0 14px 0",
    fontSize: "42px",
    lineHeight: 1.15,
  },
  successText: {
    margin: "0 auto",
    maxWidth: "700px",
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.8,
  },
  summaryBox: {
    marginTop: "28px",
    background: "#f8fafc",
    borderRadius: "24px",
    padding: "24px",
    textAlign: "left",
    border: "1px solid #e2e8f0",
  },
  summaryTitle: {
    margin: "0 0 18px 0",
    fontSize: "24px",
    textAlign: "center",
  },
  stepList: {
    display: "grid",
    gap: "16px",
  },
  stepItem: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "16px",
    border: "1px solid #e2e8f0",
  },
  stepNumber: {
    width: "40px",
    height: "40px",
    borderRadius: "14px",
    background: "#dbeafe",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    flexShrink: 0,
  },
  stepTitle: {
    margin: 0,
    fontSize: "18px",
  },
  stepText: {
    margin: "8px 0 0 0",
    color: "#475569",
    lineHeight: 1.7,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    marginTop: "28px",
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
};

export default ApplicationSuccess;