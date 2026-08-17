import { useEffect, useState } from "react";
import {
    getMyCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign
} from "../../services/campaignService";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

const emptyForm = {
    title: "",
    description: "",
    budget: "",
    platform: "Instagram",
    category: "",
    status: "ACTIVE",
    startDate: "",
    endDate: ""
};

export default function MyCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const load = async () => {
        try {
            setCampaigns(await getMyCampaigns());
        } catch (err) {
            setError(err.message || "Unable to load campaigns");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEdit = (campaign) => {
        setEditingId(campaign.id);
        setForm({
            title: campaign.title || "",
            description: campaign.description || "",
            budget: campaign.budget ?? "",
            platform: campaign.platform || "Instagram",
            category: campaign.category || "",
            status: campaign.status || "ACTIVE",
            startDate: campaign.startDate || "",
            endDate: campaign.endDate || ""
        });
        setModalOpen(true);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const closeModal = () => {
        if (saving) return;
        setModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        const payload = {
            ...form,
            budget: form.budget === "" ? null : Number(form.budget),
            startDate: form.startDate || null,
            endDate: form.endDate || null
        };

        try {
            if (editingId) {
                await updateCampaign(editingId, payload);
                setNotice("Campaign updated successfully.");
            } else {
                await createCampaign(payload);
                setNotice("Campaign created successfully.");
            }

            setModalOpen(false);
            await load();
        } catch (err) {
            setError(err.message || "Unable to save campaign");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this campaign? This cannot be undone.")) {
            return;
        }

        setDeletingId(id);
        setError("");

        try {
            await deleteCampaign(id);
            setNotice("Campaign deleted.");
            setCampaigns(items => items.filter(c => c.id !== id));
        } catch (err) {
            setError(err.message || "Unable to delete campaign");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return <section className="page"><Loading text="Loading your campaigns..." /></section>;
    }

    return (
        <section className="page">
            <div className="hero-row">
                <div>
                    <p className="eyebrow">CAMPAIGN MANAGEMENT</p>
                    <h1>Your campaigns</h1>
                    <p className="subtext">
                        Create, edit and track every campaign you run.
                    </p>
                </div>

                <button className="primary" onClick={openCreate}>
                    + New campaign
                </button>
            </div>

            {notice && <div className="success-message">{notice}</div>}
            {error && <div className="error-message">{error}</div>}

            {campaigns.length === 0 ? (
                <EmptyState
                    title="No campaigns yet"
                    description="Create your first campaign to start receiving applications."
                    action={
                        <button className="primary compact" onClick={openCreate}>
                            Create campaign
                        </button>
                    }
                />
            ) : (
                <section className="panel manage-list">
                    {campaigns.map((campaign) => (
                        <div className="manage-row" key={campaign.id}>
                            <div className="campaign-art pink">✦</div>

                            <div className="manage-info">
                                <h3>{campaign.title}</h3>
                                <p>
                                    {campaign.category || "General"} · {campaign.platform || "Any"} · ₹
                                    {Number(campaign.budget || 0).toLocaleString("en-IN")}
                                </p>
                                <small>
                                    {campaign.startDate || "No start date"}
                                    {campaign.endDate ? ` → ${campaign.endDate}` : ""}
                                </small>
                            </div>

                            <span className={`status-pill ${String(campaign.status).toLowerCase()}`}>
                                {campaign.status}
                            </span>

                            <div className="manage-actions">
                                <button
                                    className="outline compact"
                                    onClick={() => openEdit(campaign)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="outline compact danger"
                                    onClick={() => handleDelete(campaign.id)}
                                    disabled={deletingId === campaign.id}
                                >
                                    {deletingId === campaign.id ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {modalOpen && (
                <div className="modal-backdrop" onMouseDown={closeModal}>
                    <form
                        className="modal modal-wide"
                        onSubmit={handleSubmit}
                        onMouseDown={e => e.stopPropagation()}
                    >
                        <div className="modal-title">
                            <div>
                                <h2>{editingId ? "Edit campaign" : "Create campaign"}</h2>
                                <p>Tell creators what you're looking for.</p>
                            </div>

                            <button type="button" onClick={closeModal}>×</button>
                        </div>

                        <label>
                            Title
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Summer skincare launch"
                                required
                            />
                        </label>

                        <label>
                            Description
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the campaign, deliverables and expectations..."
                                rows="4"
                            />
                        </label>

                        <div className="form-grid">
                            <label>
                                Budget (₹)
                                <input
                                    type="number"
                                    name="budget"
                                    value={form.budget}
                                    onChange={handleChange}
                                    placeholder="25000"
                                    min="0"
                                    required
                                />
                            </label>

                            <label>
                                Platform
                                <select name="platform" value={form.platform} onChange={handleChange}>
                                    <option>Instagram</option>
                                    <option>YouTube</option>
                                    <option>TikTok</option>
                                    <option>Twitter</option>
                                    <option>Multi-platform</option>
                                </select>
                            </label>
                        </div>

                        <div className="form-grid">
                            <label>
                                Category
                                <input
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    placeholder="Beauty, Fashion, Tech..."
                                />
                            </label>

                            <label>
                                Status
                                <select name="status" value={form.status} onChange={handleChange}>
                                    <option value="ACTIVE">Active</option>
                                    <option value="PAUSED">Paused</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </label>
                        </div>

                        <div className="form-grid">
                            <label>
                                Start date
                                <input
                                    type="date"
                                    name="startDate"
                                    value={form.startDate || ""}
                                    onChange={handleChange}
                                />
                            </label>

                            <label>
                                End date
                                <input
                                    type="date"
                                    name="endDate"
                                    value={form.endDate || ""}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="outline" onClick={closeModal}>
                                Cancel
                            </button>

                            <button className="primary" disabled={saving}>
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Save changes"
                                        : "Create campaign"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}
