import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyCampaigns } from "../../services/campaignService";
import { getReceivedRequests } from "../../services/collaborationService";
import Loading from "../../components/common/Loading";

export default function BrandProfile() {
    const { user, logout } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getMyCampaigns(), getReceivedRequests()])
            .then(([campaignData, requestData]) => {
                setCampaigns(campaignData || []);
                setRequests(requestData || []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <section className="page"><Loading text="Loading your profile..." /></section>;
    }

    const acceptedCount = requests.filter(
        r => String(r.status).toUpperCase() === "ACCEPTED"
    ).length;

    const totalBudget = campaigns.reduce(
        (sum, c) => sum + Number(c.budget || 0),
        0
    );

    return (
        <section className="page">
            <p className="eyebrow">MY PROFILE</p>
            <h1>Brand account</h1>
            <p className="subtext">
                Your BrandFluence account details and activity summary.
            </p>

            <section className="panel form-panel">
                <div className="panel-title">
                    <div className="profile-header">
                        <div className="avatar violet large">
                            {user?.name?.slice(0, 2).toUpperCase() || "BR"}
                        </div>

                        <div>
                            <h2>{user?.name}</h2>
                            <p>{user?.email}</p>
                            <span className="badge-role">{user?.role}</span>
                        </div>
                    </div>
                </div>

                <div className="stats">
                    <div className="stat">
                        <div className="stat-icon">◒</div>
                        <strong>{campaigns.length}</strong>
                        <span>Campaigns</span>
                        <small>Created so far</small>
                    </div>

                    <div className="stat">
                        <div className="stat-icon">₹</div>
                        <strong>{totalBudget.toLocaleString("en-IN")}</strong>
                        <span>Total spend</span>
                        <small>Across campaigns</small>
                    </div>

                    <div className="stat">
                        <div className="stat-icon">♡</div>
                        <strong>{acceptedCount}</strong>
                        <span>Collaborations</span>
                        <small>Accepted partnerships</small>
                    </div>
                </div>

                <button className="outline" onClick={logout}>
                    Log out
                </button>
            </section>
        </section>
    );
}
