import { useEffect, useState } from "react";
import { getAllInfluencers, searchInfluencers } from "../../services/influencerService";
import { getInfluencerReviews } from "../../services/reviewService";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

export default function DiscoverCreators() {
    const [creators, setCreators] = useState([]);
    const [niche, setNiche] = useState("");
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    const loadAll = async () => {
        try {
            setCreators(await getAllInfluencers());
        } catch (err) {
            setError(err.message || "Unable to load creators");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearching(true);
        setError("");

        try {
            setCreators(await searchInfluencers(niche, city));
        } catch (err) {
            setError(err.message || "Unable to search creators");
        } finally {
            setSearching(false);
        }
    };

    const resetSearch = async () => {
        setNiche("");
        setCity("");
        setLoading(true);
        await loadAll();
    };

    const openProfile = async (creator) => {
        setSelected(creator);
        setReviews([]);
        setReviewsLoading(true);

        try {
            setReviews(await getInfluencerReviews(creator.id));
        } catch {
            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    };

    if (loading) {
        return <section className="page"><Loading text="Finding creators..." /></section>;
    }

    return (
        <section className="page">
            <p className="eyebrow">CREATOR DIRECTORY</p>

            <div className="hero-row">
                <div>
                    <h1>Discover creators</h1>
                    <p className="subtext">
                        Search for creators that match your brand's audience.
                    </p>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form className="search-bar" onSubmit={handleSearch}>
                <div className="search">
                    <span>⌕</span>
                    <input
                        value={niche}
                        onChange={e => setNiche(e.target.value)}
                        placeholder="Niche, e.g. Beauty, Fitness, Tech..."
                    />
                </div>

                <div className="search">
                    <span>⚲</span>
                    <input
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="City"
                    />
                </div>

                <button className="primary compact" disabled={searching}>
                    {searching ? "Searching..." : "Search"}
                </button>

                <button type="button" className="outline compact" onClick={resetSearch}>
                    Reset
                </button>
            </form>

            {creators.length === 0 ? (
                <EmptyState
                    title="No creators found"
                    description="Try a different niche or city."
                />
            ) : (
                <div className="creator-grid">
                    {creators.map((creator) => (
                        <article className="creator-card" key={creator.id}>
                            <div className="avatar violet large">
                                {creator.name?.slice(0, 2).toUpperCase() || "CR"}
                            </div>

                            <h3>{creator.name}</h3>
                            <p className="creator-niche">{creator.niche || "General creator"}</p>
                            <p className="creator-city">{creator.city || "Location not set"}</p>

                            <div className="creator-stats">
                                <div>
                                    <strong>{(creator.followers ?? 0).toLocaleString("en-IN")}</strong>
                                    <small>Followers</small>
                                </div>
                                <div>
                                    <strong>{creator.engagementRate ?? 0}%</strong>
                                    <small>Engagement</small>
                                </div>
                            </div>

                            <button
                                className="outline full-width"
                                onClick={() => openProfile(creator)}
                            >
                                View profile
                            </button>
                        </article>
                    ))}
                </div>
            )}

            {selected && (
                <div className="modal-backdrop" onMouseDown={() => setSelected(null)}>
                    <div className="modal modal-wide" onMouseDown={e => e.stopPropagation()}>
                        <div className="modal-title">
                            <div>
                                <h2>{selected.name}</h2>
                                <p>{selected.niche || "General creator"} · {selected.city || "—"}</p>
                            </div>

                            <button type="button" onClick={() => setSelected(null)}>×</button>
                        </div>

                        <p className="subtext">{selected.bio || "This creator hasn't added a bio yet."}</p>

                        <div className="creator-stats modal-stats">
                            <div>
                                <strong>{(selected.followers ?? 0).toLocaleString("en-IN")}</strong>
                                <small>Followers</small>
                            </div>
                            <div>
                                <strong>{selected.engagementRate ?? 0}%</strong>
                                <small>Engagement</small>
                            </div>
                            <div>
                                <strong>{selected.instagramHandle || "—"}</strong>
                                <small>Instagram</small>
                            </div>
                            <div>
                                <strong>{selected.youtubeHandle || "—"}</strong>
                                <small>YouTube</small>
                            </div>
                        </div>

                        <h3 className="reviews-heading">Reviews</h3>

                        {reviewsLoading ? (
                            <Loading text="Loading reviews..." />
                        ) : reviews.length === 0 ? (
                            <EmptyState
                                icon="★"
                                title="No reviews yet"
                                description="This creator hasn't been reviewed yet."
                            />
                        ) : (
                            <div className="review-list">
                                {reviews.map((review) => (
                                    <div className="review-row" key={review.id}>
                                        <div className="review-top">
                                            <b>{review.reviewerName || "Brand"}</b>
                                            <span className="rating">
                                                {"★".repeat(review.rating || 0)}
                                                {"☆".repeat(5 - (review.rating || 0))}
                                            </span>
                                        </div>
                                        <p>{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="modal-actions">
                            <button className="outline" onClick={() => setSelected(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
