import { useEffect, useMemo, useState } from "react";
import { getAllCampaigns } from "../../services/campaignService";
import { applyToCampaign } from "../../services/collaborationService";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

export default function DiscoverCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        getAllCampaigns()
            .then(setCampaigns)
            .catch(err => setError(err.message || "Unable to load campaigns"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = query.toLowerCase();

        return campaigns.filter(c =>
            `${c.title} ${c.category} ${c.platform}`
                .toLowerCase()
                .includes(q)
        );
    }, [campaigns, query]);

    const submitApplication = async (e) => {
        e.preventDefault();

        if (!selected) return;

        setSubmitting(true);
        setError("");

        try {
            await applyToCampaign(selected.id, message);

            setNotice("Application submitted successfully.");
            setSelected(null);
            setMessage("");
        } catch (err) {
            setError(err.message || "Unable to apply");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <section className="page"><Loading text="Finding campaigns..." /></section>;
    }

    return (
        <section className="page">
            <p className="eyebrow">CAMPAIGN DIRECTORY</p>

            <div className="hero-row">
                <div>
                    <h1>Discover campaigns</h1>
                    <p className="subtext">
                        Find brands and opportunities that match your audience.
                    </p>
                </div>
            </div>

            {notice && <div className="success-message">{notice}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="search">
                <span>⌕</span>
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search by campaign, category or platform..."
                />
            </div>

            {filtered.length === 0 ? (
                <EmptyState
                    title="No campaigns found"
                    description="Try another search."
                />
            ) : (
                <div className="campaign-grid">
                    {filtered.map(campaign => (
                        <article className="campaign-card" key={campaign.id}>
                            <div className="campaign-card-art">
                                <span>✦</span>
                            </div>

                            <div className="campaign-card-body">
                                <div className="card-topline">
                                    <span className="tag">
                                        {campaign.category || "General"}
                                    </span>

                                    <span className="live-label">
                                        <i className="status-dot" />
                                        {campaign.status}
                                    </span>
                                </div>

                                <h2>{campaign.title}</h2>

                                <p>
                                    {campaign.description ||
                                        "Brand campaign looking for creative partners."}
                                </p>

                                <div className="campaign-details">
                                    <div>
                                        <small>Budget</small>
                                        <b>₹{Number(campaign.budget || 0).toLocaleString("en-IN")}</b>
                                    </div>

                                    <div>
                                        <small>Platform</small>
                                        <b>{campaign.platform || "Any"}</b>
                                    </div>
                                </div>

                                <button
                                    className="primary full-width"
                                    onClick={() => setSelected(campaign)}
                                >
                                    Apply to campaign
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {selected && (
                <div
                    className="modal-backdrop"
                    onMouseDown={() => !submitting && setSelected(null)}
                >
                    <form
                        className="modal"
                        onSubmit={submitApplication}
                        onMouseDown={e => e.stopPropagation()}
                    >
                        <div className="modal-title">
                            <div>
                                <h2>Apply to campaign</h2>
                                <p>{selected.title}</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                            >
                                ×
                            </button>
                        </div>

                        <label>
                            Message
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Tell the brand why you're a good fit..."
                                required
                                rows="5"
                            />
                        </label>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="outline"
                                onClick={() => setSelected(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="primary"
                                disabled={submitting}
                            >
                                {submitting ? "Applying..." : "Submit application"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}
