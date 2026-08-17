import { useEffect, useState } from "react";
import { getMyApplications } from "../../services/collaborationService";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getMyApplications()
            .then(setApplications)
            .catch(err => setError(err.message || "Unable to load applications"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <section className="page"><Loading text="Loading applications..." /></section>;
    }

    return (
        <section className="page">
            <p className="eyebrow">PARTNERSHIPS</p>
            <h1>My applications</h1>
            <p className="subtext">
                Keep track of every campaign you've applied to.
            </p>

            {error && <div className="error-message">{error}</div>}

            {applications.length === 0 ? (
                <EmptyState
                    title="No applications"
                    description="Your campaign applications will appear here."
                />
            ) : (
                <section className="panel">
                    <div className="application-list">
                        {applications.map(item => (
                            <div className="application-row" key={item.id}>
                                <div className="avatar lavender">
                                    {item.status === "ACCEPTED" ? "✓" : "◌"}
                                </div>

                                <div className="application-main">
                                    <h3>{item.campaignTitle || "Campaign"}</h3>
                                    <p>{item.brandName || "Brand"}</p>
                                    <small>{item.message}</small>
                                </div>

                                <span className={`status-pill ${String(item.status).toLowerCase()}`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </section>
    );
}
