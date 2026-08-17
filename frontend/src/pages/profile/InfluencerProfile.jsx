import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
    getMyInfluencerProfile,
    saveInfluencerProfile
} from "../../services/influencerService";
import Loading from "../../components/common/Loading";

const emptyForm = {
    bio: "",
    instagramHandle: "",
    youtubeHandle: "",
    followers: "",
    engagementRate: "",
    niche: "",
    city: "",
    profileImage: ""
};

export default function InfluencerProfile() {
    const { user } = useAuth();
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        getMyInfluencerProfile()
            .then((profile) => {
                if (profile) {
                    setForm({
                        bio: profile.bio || "",
                        instagramHandle: profile.instagramHandle || "",
                        youtubeHandle: profile.youtubeHandle || "",
                        followers: profile.followers ?? "",
                        engagementRate: profile.engagementRate ?? "",
                        niche: profile.niche || "",
                        city: profile.city || "",
                        profileImage: profile.profileImage || ""
                    });
                }
            })
            .catch(() => {
                // No profile yet — keep the blank form so the creator can create one.
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setNotice("");
        setError("");

        const payload = {
            ...form,
            followers: form.followers === "" ? null : Number(form.followers),
            engagementRate: form.engagementRate === "" ? null : Number(form.engagementRate)
        };

        try {
            await saveInfluencerProfile(payload);
            setNotice("Profile saved successfully.");
        } catch (err) {
            setError(err.message || "Unable to save profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <section className="page"><Loading text="Loading your profile..." /></section>;
    }

    return (
        <section className="page">
            <p className="eyebrow">MY PROFILE</p>
            <h1>Creator profile</h1>
            <p className="subtext">
                Keep your profile up to date so brands can find and trust you.
            </p>

            {notice && <div className="success-message">{notice}</div>}
            {error && <div className="error-message">{error}</div>}

            <section className="panel form-panel">
                <div className="panel-title">
                    <div>
                        <h2>{user?.name}</h2>
                        <p>{user?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>
                        Bio
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            placeholder="Tell brands about your content and audience..."
                            rows="4"
                        />
                    </label>

                    <div className="form-grid">
                        <label>
                            Niche
                            <input
                                name="niche"
                                value={form.niche}
                                onChange={handleChange}
                                placeholder="Beauty, Fitness, Tech..."
                            />
                        </label>

                        <label>
                            City
                            <input
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                placeholder="Indore"
                            />
                        </label>
                    </div>

                    <div className="form-grid">
                        <label>
                            Followers
                            <input
                                type="number"
                                name="followers"
                                value={form.followers}
                                onChange={handleChange}
                                min="0"
                                placeholder="10000"
                            />
                        </label>

                        <label>
                            Engagement rate (%)
                            <input
                                type="number"
                                step="0.01"
                                name="engagementRate"
                                value={form.engagementRate}
                                onChange={handleChange}
                                min="0"
                                placeholder="3.5"
                            />
                        </label>
                    </div>

                    <div className="form-grid">
                        <label>
                            Instagram handle
                            <input
                                name="instagramHandle"
                                value={form.instagramHandle}
                                onChange={handleChange}
                                placeholder="@yourhandle"
                            />
                        </label>

                        <label>
                            YouTube handle
                            <input
                                name="youtubeHandle"
                                value={form.youtubeHandle}
                                onChange={handleChange}
                                placeholder="@yourchannel"
                            />
                        </label>
                    </div>

                    <label>
                        Profile image URL
                        <input
                            name="profileImage"
                            value={form.profileImage}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </label>

                    <button className="primary" disabled={saving}>
                        {saving ? "Saving..." : "Save profile"}
                    </button>
                </form>
            </section>
        </section>
    );
}
