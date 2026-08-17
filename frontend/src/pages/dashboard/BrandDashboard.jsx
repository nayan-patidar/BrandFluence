import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyCampaigns } from "../../services/campaignService";
import { getReceivedRequests } from "../../services/collaborationService";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

export default function BrandDashboard({ setPage }) {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const [campaignData, requestData] = await Promise.all([
                    getMyCampaigns(),
                    getReceivedRequests()
                ]);

                setCampaigns(campaignData || []);
                setRequests(requestData || []);
            } catch (err) {
                setError(err.message || "Unable to load dashboard");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    if (loading) {
        return <section className="page"><Loading text="Loading your workspace..." /></section>;
    }

    const activeCampaigns = campaigns.filter(
        c => String(c.status).toUpperCase() === "ACTIVE"
    );

    const pendingRequests = requests.filter(
        r => String(r.status).toUpperCase() === "PENDING"
    );

    const acceptedRequests = requests.filter(
        r => String(r.status).toUpperCase() === "ACCEPTED"
    );

    const totalBudget = campaigns.reduce(
        (sum, c) => sum + Number(c.budget || 0),
        0
    );

    return (
        <section className="page">
            <div className="hero-row">
                <div>
                    <p className="eyebrow">BRAND WORKSPACE</p>
                    <h1>
                        Welcome back, {user?.name || "Brand"} <span>✦</span>
                    </h1>
                    <p className="subtext">
                        Manage your campaigns and creator partnerships.
                    </p>
                </div>

                <button
                    className="primary"
                    onClick={() => setPage("Campaigns")}
                >
                    Manage campaigns →
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="stats">
                <div className="stat">
                    <div className="stat-icon">◒</div>
                    <strong>{campaigns.length}</strong>
                    <span>Campaigns</span>
                    <small>{activeCampaigns.length} currently active</small>
                </div>

                <div className="stat">
                    <div className="stat-icon">₹</div>
                    <strong>{totalBudget.toLocaleString("en-IN")}</strong>
                    <span>Total budget</span>
                    <small>Across all campaigns</small>
                </div>

                <div className="stat">
                    <div className="stat-icon">↗</div>
                    <strong>{pendingRequests.length}</strong>
                    <span>Pending requests</span>
                    <small>Awaiting your response</small>
                </div>

                <div className="stat">
                    <div className="stat-icon">♡</div>
                    <strong>{acceptedRequests.length}</strong>
                    <span>Collaborations</span>
                    <small>Active partnerships</small>
                </div>
            </div>

            <div className="grid-two">
                <section className="panel">
                    <div className="panel-title">
                        <div>
                            <h2>Your campaigns</h2>
                            <p>Recently created campaigns.</p>
                        </div>

                        <button
                            className="link-button"
                            onClick={() => setPage("Campaigns")}
                        >
                            View all →
                        </button>
                    </div>

                    {campaigns.length === 0 ? (
                        <EmptyState
                            title="No campaigns yet"
                            description="Create your first campaign to start finding creators."
                            action={
                                <button
                                    className="primary compact"
                                    onClick={() => setPage("Campaigns")}
                                >
                                    Create campaign
                                </button>
                            }
                        />
                    ) : (
                        <div className="campaign-list">
                            {campaigns.slice(0, 4).map((campaign) => (
                                <div className="campaign-row" key={campaign.id}>
                                    <div className="campaign-art pink">✦</div>

                                    <div className="campaign-info">
                                        <h3>{campaign.title}</h3>
                                        <p>
                                            {campaign.category || "General"} · ₹
                                            {Number(campaign.budget || 0).toLocaleString("en-IN")}
                                        </p>

                                        <span>
                                            <i className="status-dot" />
                                            {campaign.status}
                                        </span>
                                    </div>

                                    <button
                                        className="outline compact"
                                        onClick={() => setPage("Campaigns")}
                                    >
                                        Manage
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="panel">
                    <div className="panel-title">
                        <div>
                            <h2>Creator requests</h2>
                            <p>Applications from creators.</p>
                        </div>

                        <button
                            className="link-button"
                            onClick={() => setPage("Collaborations")}
                        >
                            View all →
                        </button>
                    </div>

                    {requests.length === 0 ? (
                        <EmptyState
                            title="No requests yet"
                            description="Creator applications will appear here."
                        />
                    ) : (
                        <div className="activity">
                            {requests.slice(0, 4).map((request) => (
                                <div className="activity-item" key={request.id}>
                                    <div className="avatar lavender">
                                        {request.status === "ACCEPTED" ? "✓" : "◌"}
                                    </div>

                                    <div>
                                        <p>
                                            <b>{request.influencerName || "Creator"}</b>
                                        </p>
                                        <small>
                                            {request.status} · {request.campaignTitle || "Campaign"}
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </section>
    );
}
