import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllUsers } from "../../services/userService";
import { getAllCampaigns } from "../../services/campaignService";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([getAllUsers(), getAllCampaigns()])
            .then(([userData, campaignData]) => {
                setUsers(userData || []);
                setCampaigns(campaignData || []);
            })
            .catch(err => setError(err.message || "Unable to load admin data"))
            .finally(() => setLoading(false));
    }, []);

    const brandCount = users.filter(u => u.role === "BRAND").length;
    const influencerCount = users.filter(u => u.role === "INFLUENCER").length;
    const activeCampaigns = campaigns.filter(
        c => String(c.status).toUpperCase() === "ACTIVE"
    ).length;

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand">
                    <span className="brand-mark">b</span>
                    brandfluence
                </div>

                <p className="workspace-label">ADMIN CONSOLE</p>

                <div className="sidebar-bottom">
                    <div className="user-mini">
                        <div className="avatar violet">
                            {user?.name?.slice(0, 2).toUpperCase() || "AD"}
                        </div>
                        <div>
                            <strong>{user?.name || "Admin"}</strong>
                            <small>{user?.role || ""} account</small>
                        </div>
                    </div>
                    <button className="outline compact" style={{ marginTop: 12, width: "100%" }} onClick={logout}>
                        Log out
                    </button>
                </div>
            </aside>

            <main className="content">
                <div className="content-inner">
                    <section className="page">
                        <p className="eyebrow">ADMIN</p>
                        <h1>Platform overview</h1>
                        <p className="subtext">
                            Monitor users and campaigns across BrandFluence.
                        </p>

                        {error && <div className="error-message">{error}</div>}

                        {loading ? (
                            <Loading text="Loading platform data..." />
                        ) : (
                            <>
                                <div className="stats">
                                    <div className="stat">
                                        <div className="stat-icon">◉</div>
                                        <strong>{users.length}</strong>
                                        <span>Total users</span>
                                        <small>Registered accounts</small>
                                    </div>

                                    <div className="stat">
                                        <div className="stat-icon">◒</div>
                                        <strong>{brandCount}</strong>
                                        <span>Brands</span>
                                        <small>Brand accounts</small>
                                    </div>

                                    <div className="stat">
                                        <div className="stat-icon">◎</div>
                                        <strong>{influencerCount}</strong>
                                        <span>Creators</span>
                                        <small>Influencer accounts</small>
                                    </div>

                                    <div className="stat">
                                        <div className="stat-icon">✦</div>
                                        <strong>{campaigns.length}</strong>
                                        <span>Campaigns</span>
                                        <small>{activeCampaigns} currently active</small>
                                    </div>
                                </div>

                                <section className="panel">
                                    <div className="panel-title">
                                        <div>
                                            <h2>Recent users</h2>
                                            <p>Latest accounts on the platform.</p>
                                        </div>
                                    </div>

                                    {users.length === 0 ? (
                                        <EmptyState
                                            title="No users yet"
                                            description="Registered users will appear here."
                                        />
                                    ) : (
                                        <div className="application-list">
                                            {users.slice(0, 8).map((u) => (
                                                <div className="application-row" key={u.id}>
                                                    <div className="avatar lavender">
                                                        {u.name?.slice(0, 2).toUpperCase() || "U"}
                                                    </div>

                                                    <div className="application-main">
                                                        <h3>{u.name}</h3>
                                                        <p>{u.email}</p>
                                                    </div>

                                                    <span className="badge-role">{u.role}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
