import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllCampaigns } from "../../services/campaignService";
import { getMyApplications } from "../../services/collaborationService";
import { getMyInfluencerProfile } from "../../services/influencerService";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

export default function InfluencerDashboard({ setPage }) {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [applications, setApplications] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const [campaignData, applicationData, profileData] =
                    await Promise.all([
                        getAllCampaigns(),
                        getMyApplications(),
                        getMyInfluencerProfile()
                    ]);

                setCampaigns(campaignData || []);
                setApplications(applicationData || []);
                setProfile(profileData);
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

    return (
        <section className="page">
            <div className="hero-row">
                <div>
                    <p className="eyebrow">CREATOR WORKSPACE</p>
                    <h1>
                        Good morning, {user?.name || "Creator"} <span>✦</span>
                    </h1>
                    <p className="subtext">
                        Discover campaigns and grow meaningful brand partnerships.
                    </p>
                </div>

                <button
                    className="primary"
                    onClick={() => setPage("Discover campaigns")}
                >
                    Discover campaigns →
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="stats">
                <div className="stat">
                    <div className="stat-icon">◒</div>
                    <strong>{activeCampaigns.length}</strong>
                    <span>Active campaigns</span>
                    <small>Available opportunities</small>
                </div>

                <div className="stat">
                    <div className="stat-icon">↗</div>
                    <strong>{applications.length}</strong>
                    <span>My applications</span>
                    <small>Campaign applications</small>
                </div>

                <div className="stat">
                    <div className="stat-icon">♡</div>
                    <strong>
                        {applications.filter(
                            a => String(a.status).toUpperCase() === "ACCEPTED"
                        ).length}
                    </strong>
                    <span>Accepted</span>
                    <small>Active partnerships</small>
                </div>

                <div className="stat">
                    <div className="stat-icon">◎</div>
                    <strong>{profile?.followers ?? 0}</strong>
                    <span>Followers</span>
                    <small>{profile?.niche || "Complete your profile"}</small>
                </div>
            </div>

            <div className="grid-two">
                <section className="panel">
                    <div className="panel-title">
                        <div>
                            <h2>Latest campaigns</h2>
                            <p>Find your next opportunity.</p>
                        </div>

                        <button
                            className="link-button"
                            onClick={() => setPage("Discover campaigns")}
                        >
                            View all →
                        </button>
                    </div>

                    {activeCampaigns.length === 0 ? (
                        <EmptyState
                            title="No active campaigns"
                            description="New opportunities will appear here."
                        />
                    ) : (
                        <div className="campaign-list">
                            {activeCampaigns.slice(0, 4).map((campaign) => (
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
                                        onClick={() => setPage("Discover campaigns")}
                                    >
                                        View
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="panel">
                    <div className="panel-title">
                        <div>
                            <h2>My applications</h2>
                            <p>Track your partnership requests.</p>
                        </div>

                        <button
                            className="link-button"
                            onClick={() => setPage("My applications")}
                        >
                            View all →
                        </button>
                    </div>

                    {applications.length === 0 ? (
                        <EmptyState
                            title="No applications yet"
                            description="Apply to a campaign to see it here."
                            action={
                                <button
                                    className="primary compact"
                                    onClick={() => setPage("Discover campaigns")}
                                >
                                    Find campaigns
                                </button>
                            }
                        />
                    ) : (
                        <div className="activity">
                            {applications.slice(0, 4).map((application) => (
                                <div className="activity-item" key={application.id}>
                                    <div className="avatar lavender">
                                        {application.status === "ACCEPTED" ? "✓" : "◌"}
                                    </div>

                                    <div>
                                        <p>
                                            <b>{application.campaignTitle || "Campaign"}</b>
                                        </p>
                                        <small>
                                            {application.status} · {application.brandName || "Brand"}
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
