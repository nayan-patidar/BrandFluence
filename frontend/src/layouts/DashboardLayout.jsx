import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";

export default function DashboardLayout({ page, setPage, children }) {
    return (
        <div className="app-shell">
            <Sidebar
                page={page}
                setPage={setPage}
            />

            <main className="content">
                <Navbar
                    onNotifications={() => setPage("Notifications")}
                />

                <div className="content-inner">
                    {children}
                </div>
            </main>
        </div>
    );
}