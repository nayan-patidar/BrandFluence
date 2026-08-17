import { useEffect, useMemo, useState } from "react";
import {
    getReceivedRequests,
    acceptCollaboration,
    rejectCollaboration
} from "../../services/collaborationService";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

const tabs = ["All", "Pending", "Accepted", "Rejected"];

export default function ReceivedRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [tab, setTab] = useState("All");
    const [actingId, setActingId] = useState(null);

    const load = async () => {
        try {
            setRequests(await getReceivedRequests());
        } catch (err) {
            setError(err.message || "Unable to load collaboration requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(() => {
        if (tab === "All") return requests;
        return requests.filter(
            r => String(r.status).toUpperCase() === tab.toUpperCase()
        );
    }, [requests, tab]);

    const handleAccept = async (id) => {
        setActingId(id);
        setError("");

        try {
            await acceptCollaboration(id);
            setNotice("Request accepted.");
            setRequests(items =>
                items.map(r => (r.id === id ? { ...r, status: "ACCEPTED" } : r))
            );
        } catch (err) {
            setError(err.message || "Unable to accept request");
        } finally {
            setActingId(null);
        }
    };

    const handleReject = async (id) => {
        setActingId(id);
        setError("");

        try {
            await rejectCollaboration(id);
            setNotice("Request rejected.");
            setRequests(items =>
                items.map(r => (r.id === id ? { ...r, status: "REJECTED" } : r))
            );
        } catch (err) {
            setError(err.message || "Unable to reject request");
        } finally {
            setActingId(null);
        }
    };

    if (loading) {
        return <section className="page"><Loading text="Loading collaboration requests..." /></section>;
    }

    return (
        <section className="page">
            <p className="eyebrow">PARTNERSHIPS</p>
            <h1>Collaboration requests</h1>
            <p className="subtext">
                Review and respond to creators who applied to your campaigns.
            </p>

            {notice && <div className="success-message">{notice}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="tabs">
                {tabs.map((t) => (
                    <button
                        key={t}
                        className={`tab ${tab === t ? "active" : ""}`}
                        onClick={() => setTab(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <EmptyState
                    title="No requests here"
                    description="Creator applications will show up in this list."
                />
            ) : (
                <section className="panel">
                    <div className="application-list">
                        {filtered.map((item) => (
                            <div className="application-row" key={item.id}>
                                <div className="avatar lavender">
                                    {item.influencerName?.slice(0, 2).toUpperCase() || "CR"}
                                </div>

                                <div className="application-main">
                                    <h3>{item.influencerName || "Creator"}</h3>
                                    <p>{item.campaignTitle || "Campaign"}</p>
                                    <small>{item.message}</small>
                                </div>

                                <span className={`status-pill ${String(item.status).toLowerCase()}`}>
                                    {item.status}
                                </span>

                                {String(item.status).toUpperCase() === "PENDING" && (
                                    <div className="manage-actions">
                                        <button
                                            className="outline compact"
                                            onClick={() => handleAccept(item.id)}
                                            disabled={actingId === item.id}
                                        >
                                            Accept
                                        </button>

                                        <button
                                            className="outline compact danger"
                                            onClick={() => handleReject(item.id)}
                                            disabled={actingId === item.id}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </section>
    );
}
