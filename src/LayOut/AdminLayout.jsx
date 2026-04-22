import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div style={styles.page}>
      <aside className="admin-sidebar" style={styles.sidebar}>
        <div>
          <div style={styles.brandWrap}>
            <div style={styles.brandIcon}>JA</div>

            <div style={styles.brandText}>
              <h2 style={styles.brandTitle}>JAPS Admin</h2>
              <p style={styles.brandSub}>Hiring Intelligence Panel</p>
            </div>
          </div>

          <div style={styles.sidebarSection}>
            <p style={styles.sidebarLabel}>Main Menu</p>

            <Link to="/admin/dashboard" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navItem}>
              Dashboard
            </Link>

            <Link to="/admin/jobs" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navItem}>
              Manage Jobs
            </Link>

            <Link to="/admin/applications" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navItem}>
              Applications
            </Link>

            <Link to="/admin/shortlist" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navItem}>
              Shortlisting
            </Link>

            <Link to="/admin/interview" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navItem}>
              Interviews
            </Link>

            <Link to="/admin/feedback" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navItem}>
              Decisions
            </Link>

            <Link to="/admin/reports" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navItem}>
              Reports
            </Link>

            <Link to="/admin-login" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.Logout}>
              Logout
            </Link>
          </div>
        </div>
      </aside>

      <main className="admin-main" style={styles.main}>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const SIDEBAR_WIDTH = 290;

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif",
    overflowX: "hidden",
  },

  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: `${SIDEBAR_WIDTH}px`,
    height: "100vh",
    overflowY: "auto",
    background:
      "linear-gradient(180deg, #0f172a 0%, #111827 50%, #1e293b 100%)",
    color: "#fff",
    padding: "24px 18px",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    boxSizing: "border-box",
    zIndex: 1000,
  },

  main: {
    marginLeft: `${SIDEBAR_WIDTH}px`,
    width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
    minHeight: "100vh",
    padding: "32px",
    boxSizing: "border-box",
  },

  content: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  brandWrap: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "32px",
    minWidth: 0,
  },

  brandIcon: {
    width: "52px",
    height: "52px",
    minWidth: "52px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
    flexShrink: 0,
  },

  brandText: {
    minWidth: 0,
  },

  brandTitle: {
    margin: 0,
    fontSize: "20px",
    lineHeight: 1.2,
    wordBreak: "break-word",
  },

  brandSub: {
    margin: "4px 0 0 0",
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: 1.4,
    wordBreak: "break-word",
  },

  sidebarSection: {
    display: "grid",
    gap: "10px",
  },

  sidebarLabel: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "0 0 8px 4px",
  },

  navItem: {
    textDecoration: "none",
    color: "#cbd5e1",
    padding: "14px 16px",
    borderRadius: "16px",
    fontWeight: "600",
    display: "block",
    background: "rgba(255,255,255,0.03)",
    transition: "all 0.2s ease",
    wordBreak: "break-word",
  },

  navItem: {
    textDecoration: "none",
    color: "#cbd5e1",
    padding: "14px 16px",
    borderRadius: "16px",
    fontWeight: "600",
    display: "block",
    background: "rgba(255,255,255,0.03)",
    transition: "all 0.2s ease",
    wordBreak: "break-word",
  },

  Logout: {
    textDecoration: "none",
    color: "#dc2626",
    background: "#fee2e2",
    fontWeight: "700",
    marginTop: "122px",
    padding: "15px 14px",
    borderRadius: "12px",
  },
};

export default AdminLayout;