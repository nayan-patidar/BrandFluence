import { useAuth } from "../../context/AuthContext";

const brandItems = [
    ["Dashboard", "⌂"],
    ["Campaigns", "◒"],
    ["Discover creators", "◎"],
    ["Collaborations", "♡"],
    ["Notifications", "♧"],
    ["Profile", "◉"]
];

const influencerItems = [
    ["Dashboard", "⌂"],
    ["Discover campaigns", "◒"],
    ["My applications", "♡"],
    ["Notifications", "♧"],
    ["Profile", "◉"]
];

export default function Sidebar({ page, setPage }) {
    const { user } = useAuth();

    const items = user?.role === "INFLUENCER"
        ? influencerItems
        : brandItems;

    return (
        <aside className="sidebar">
            <button className="brand" onClick={() => setPage("Dashboard")}>
                <span className="brand-mark">b</span>
                brandfluence
            </button>

            <p className="workspace-label">
                {user?.role === "INFLUENCER"
                    ? "CREATOR WORKSPACE"
                    : "BRAND WORKSPACE"}
            </p>

            <nav>
                {items.map(([name, icon]) => (
                    <button
                        key={name}
                        className={`nav-item ${page === name ? "active" : ""}`}
                        onClick={() => setPage(name)}
                    >
                        <span className="nav-icon">{icon}</span>
                        {name}
                    </button>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <div className="user-mini">
                    <div className="avatar violet">
                        {user?.name?.slice(0, 2).toUpperCase() || "U"}
                    </div>
                    <div>
                        <strong>{user?.name || "User"}</strong>
                        <small>{user?.role || ""} account</small>
                    </div>
                </div>
            </div>
        </aside>
    );
}
