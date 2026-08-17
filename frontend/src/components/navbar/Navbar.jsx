import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onNotifications }) {
    const { user, logout } = useAuth();

    const initials = user?.name
        ? user.name.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase()
        : "U";

    return (
        <header className="topbar">
            <div className="mobile-brand">
                <span className="brand-mark">b</span>
                brandfluence
            </div>

            <div className="top-actions">
                <button className="icon-button" title="Help">?</button>

                <button
                    className="icon-button notification-button"
                    onClick={onNotifications}
                    title="Notifications"
                >
                    ♧
                </button>

                <div className="profile-menu">
                    <div className="avatar violet">{initials}</div>
                    <div className="profile-text">
                        <strong>{user?.name || "User"}</strong>
                        <small>{user?.role || ""}</small>
                    </div>
                    <button className="logout-button" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
