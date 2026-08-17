import { useEffect, useState } from "react";
import {
    getMyNotifications,
    markNotificationAsRead
} from "../../services/notificationService";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            setNotifications(await getMyNotifications());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const markRead = async (id) => {
        await markNotificationAsRead(id);
        setNotifications(items =>
            items.map(item =>
                item.id === id ? { ...item, read: true } : item
            )
        );
    };

    if (loading) {
        return <section className="page"><Loading text="Loading notifications..." /></section>;
    }

    return (
        <section className="page">
            <p className="eyebrow">UPDATES</p>
            <h1>Notifications</h1>
            <p className="subtext">
                Stay updated on your BrandFluence activity.
            </p>

            {notifications.length === 0 ? (
                <EmptyState
                    icon="♧"
                    title="You're all caught up"
                    description="New activity will appear here."
                />
            ) : (
                <section className="panel notification-list">
                    {notifications.map(item => (
                        <div
                            className={`notification-row ${item.read ? "" : "unread"}`}
                            key={item.id}
                        >
                            <div className="avatar lavender">♧</div>

                            <div>
                                <p>{item.message}</p>
                                <small>
                                    {item.type || "Notification"}
                                    {item.createdAt ? ` · ${new Date(item.createdAt).toLocaleString()}` : ""}
                                </small>
                            </div>

                            {!item.read && (
                                <button
                                    className="outline compact"
                                    onClick={() => markRead(item.id)}
                                >
                                    Mark read
                                </button>
                            )}
                        </div>
                    ))}
                </section>
            )}
        </section>
    );
}
