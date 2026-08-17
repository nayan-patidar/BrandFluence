import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllUsers, deleteUser } from "../../services/userService";
import { getAllCampaigns } from "../../services/campaignService";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

export default function AdminDashboard() {
    const { user, logout } = useAuth();

    const [users, setUsers] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [userData, campaignData] = await Promise.all([
                getAllUsers(),
                getAllCampaigns()
            ]);

            setUsers(userData || []);
            setCampaigns(campaignData || []);
        } catch (err) {
            setError(err.message || "Unable to load admin data");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userToDelete) => {
        if (userToDelete.id === user?.id) {
            alert("You cannot delete your own admin account.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${userToDelete.name || "this user"}?\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setDeletingId(userToDelete.id);
            setError("");

            await deleteUser(userToDelete.id);

            setUsers(prev =>
                prev.filter(u => u.id !== userToDelete.id)
            );
        } catch (err) {
            setError(err.message || "Unable to delete user");
        } finally {
            setDeletingId(null);
        }
    };

    const brandCount = users.filter(
        u => String(u.role).toUpperCase() === "BRAND"
    ).length;

    const influencerCount = users.filter(
        u => String(u.role).toUpperCase() === "INFLUENCER"
    ).length;

    const adminCount = users.filter(
        u => String(u.role).toUpperCase() === "ADMIN"
    ).length;

    const activeCampaigns = campaigns.filter(
        c => String(c.status).toUpperCase() === "ACTIVE"
    ).length;

    const filteredUsers = users.filter(u => {
        const searchText = search.toLowerCase().trim();

        const matchesSearch =
            !searchText ||
            u.name?.toLowerCase().includes(searchText) ||
            u.email?.toLowerCase().includes(searchText);

        const matchesRole =
            roleFilter === "ALL" ||
            String(u.role).toUpperCase() === roleFilter;

        return matchesSearch && matchesRole;
    });

    return (

<><style>
    {`
  .users-panel {
    overflow: hidden;
}

.users-header {
    align-items: flex-start;
}

.users-header .eyebrow {
    margin-bottom: 6px;
}

.user-summary {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 10px 16px;
    border-radius: 12px;
    background: #f7f5ff;
}

.user-summary strong {
    font-size: 22px;
    line-height: 1;
}

.user-summary span {
    margin-top: 5px;
    font-size: 12px;
    color: #777;
}

.user-toolbar {
    display: flex;
    gap: 12px;
    padding: 18px 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-top: 18px;
}

.search-box {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 44px;
    padding: 0 14px;
    border: 1px solid #dedede;
    border-radius: 10px;
    background: #fff;
}

.search-box span {
    font-size: 22px;
    color: #777;
}

.search-box input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
}

.role-filter {
    min-width: 150px;
    height: 44px;
    padding: 0 14px;
    border: 1px solid #dedede;
    border-radius: 10px;
    background: white;
    outline: none;
    cursor: pointer;
}

.users-table {
    width: 100%;
}

.users-table-head {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 100px;
    gap: 20px;
    padding: 15px 8px;
    font-size: 11px;
    font-weight: 700;
    color: #888;
    text-transform: uppercase;
    letter-spacing: .06em;
    border-bottom: 1px solid #eee;
}

.user-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 100px;
    gap: 20px;
    align-items: center;
    padding: 17px 8px;
    border-bottom: 1px solid #f0f0f0;
    transition: background .15s ease;
}

.user-row:hover {
    background: #faf9ff;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.user-info h3 {
    display: flex;
    align-items: center;
    gap: 7px;
    margin: 0 0 4px;
    font-size: 14px;
}

.user-info p {
    margin: 0;
    color: #888;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-id {
    color: #999;
    font-size: 13px;
}

.you-badge {
    padding: 3px 6px;
    border-radius: 5px;
    background: #ede9fe;
    color: #6d28d9;
    font-size: 9px;
    font-weight: 800;
}

.role-admin {
    background: #eee9ff;
    color: #6841d8;
}

.role-brand {
    background: #e8f5ff;
    color: #1671b8;
}

.role-influencer {
    background: #eaf8ef;
    color: #21834b;
}

.delete-user-btn {
    border: 1px solid #f0caca;
    background: #fff;
    color: #d64545;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all .15s ease;
}

.delete-user-btn:hover:not(:disabled) {
    background: #fff1f1;
    border-color: #e7a5a5;
}

.delete-user-btn:disabled {
    opacity: .45;
    cursor: not-allowed;
}

.no-results {
    text-align: center;
    padding: 60px 20px;
}

.no-results-icon {
    width: 46px;
    height: 46px;
    margin: 0 auto 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #f4f2ff;
    font-size: 24px;
}

.no-results h3 {
    margin: 0 0 5px;
}

.no-results p {
    margin: 0;
    color: #888;
    font-size: 14px;
}

.admin-summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-top: 18px;
}

.admin-summary > div {
    padding: 18px;
    border: 1px solid #eee;
    border-radius: 12px;
    background: #fff;
}

.admin-summary span {
    display: block;
    color: #888;
    font-size: 12px;
    margin-bottom: 7px;
}

.admin-summary strong {
    font-size: 22px;
}

@media (max-width: 900px) {
    .users-table-head {
        display: none;
    }

    .user-row {
        grid-template-columns: 1fr auto;
        gap: 12px;
    }

    .user-row > div:nth-child(2),
    .user-row > div:nth-child(3) {
        display: none;
    }

    .user-action {
        grid-column: 2;
        grid-row: 1;
    }

    .admin-summary {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .user-toolbar {
        flex-direction: column;
    }

    .role-filter {
        width: 100%;
    }

    .admin-summary {
        grid-template-columns: 1fr;
    }
}
`}
</style>


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

                    <button
                        className="outline compact"
                        style={{ marginTop: 12, width: "100%" }}
                        onClick={logout}
                    >
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
                            Manage users, monitor campaigns and control the BrandFluence platform.
                        </p>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <Loading text="Loading platform data..." />
                        ) : (
                            <>

                                <div className="stats">

                                    <div className="stat">
                                        <div className="stat-icon">◉</div>
                                        <strong>{users.length}</strong>
                                        <span>Total users</span>
                                        <small>All registered accounts</small>
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


                                <section className="panel users-panel">

                                    <div className="panel-title users-header">
                                        <div>
                                            <p className="eyebrow">USER MANAGEMENT</p>
                                            <h2>All users</h2>
                                            <p>
                                                Manage every account registered on BrandFluence.
                                            </p>
                                        </div>

                                        <div className="user-summary">
                                            <strong>{filteredUsers.length}</strong>
                                            <span>
                                                {filteredUsers.length === 1
                                                    ? "user shown"
                                                    : "users shown"}
                                            </span>
                                        </div>
                                    </div>


                                    <div className="user-toolbar">

                                        <div className="search-box">
                                            <span>⌕</span>

                                            <input
                                                type="text"
                                                placeholder="Search by name or email..."
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                            />
                                        </div>

                                        <select
                                            value={roleFilter}
                                            onChange={(e) =>
                                                setRoleFilter(e.target.value)
                                            }
                                            className="role-filter"
                                        >
                                            <option value="ALL">
                                                All roles
                                            </option>

                                            <option value="ADMIN">
                                                Admin
                                            </option>

                                            <option value="BRAND">
                                                Brand
                                            </option>

                                            <option value="INFLUENCER">
                                                Influencer
                                            </option>
                                        </select>

                                    </div>


                                    {users.length === 0 ? (
                                        <EmptyState
                                            title="No users yet"
                                            description="Registered users will appear here."
                                        />
                                    ) : filteredUsers.length === 0 ? (
                                        <div className="no-results">
                                            <div className="no-results-icon">⌕</div>
                                            <h3>No users found</h3>
                                            <p>
                                                Try changing your search or role filter.
                                            </p>
                                        </div>
                                    ) : (

                                        <div className="users-table">

                                            <div className="users-table-head">
                                                <span>User</span>
                                                <span>Role</span>
                                                <span>User ID</span>
                                                <span>Action</span>
                                            </div>

                                            {filteredUsers.map((u) => {

                                                const isCurrentUser =
                                                    u.id === user?.id;

                                                const role =
                                                    String(u.role || "").toUpperCase();

                                                return (
                                                    <div
                                                        className="user-row"
                                                        key={u.id}
                                                    >

                                                        <div className="user-info">

                                                            <div className="avatar lavender">
                                                                {u.name
                                                                    ?.slice(0, 2)
                                                                    .toUpperCase() ||
                                                                    "U"}
                                                            </div>

                                                            <div>
                                                                <h3>
                                                                    {u.name || "Unnamed user"}

                                                                    {isCurrentUser && (
                                                                        <span className="you-badge">
                                                                            YOU
                                                                        </span>
                                                                    )}
                                                                </h3>

                                                                <p>{u.email}</p>
                                                            </div>

                                                        </div>


                                                        <div>
                                                            <span
                                                                className={`badge-role role-${role.toLowerCase()}`}
                                                            >
                                                                {role}
                                                            </span>
                                                        </div>


                                                        <div className="user-id">
                                                            #{u.id}
                                                        </div>


                                                        <div className="user-action">

                                                            <button
                                                                className="delete-user-btn"
                                                                disabled={
                                                                    isCurrentUser ||
                                                                    deletingId === u.id
                                                                }
                                                                onClick={() =>
                                                                    handleDelete(u)
                                                                }
                                                                title={
                                                                    isCurrentUser
                                                                        ? "You cannot delete yourself"
                                                                        : "Delete user"
                                                                }
                                                            >
                                                                {deletingId === u.id
                                                                    ? "Deleting..."
                                                                    : "Delete"}
                                                            </button>

                                                        </div>

                                                    </div>
                                                );
                                            })}

                                        </div>
                                    )}

                                </section>


                                <section className="admin-summary">

                                    <div>
                                        <span>Admins</span>
                                        <strong>{adminCount}</strong>
                                    </div>

                                    <div>
                                        <span>Brands</span>
                                        <strong>{brandCount}</strong>
                                    </div>

                                    <div>
                                        <span>Influencers</span>
                                        <strong>{influencerCount}</strong>
                                    </div>

                                    <div>
                                        <span>Active campaigns</span>
                                        <strong>{activeCampaigns}</strong>
                                    </div>

                                </section>

                            </>
                        )}

                    </section>
                </div>
            </main>
        </div>
        </>
    );
}