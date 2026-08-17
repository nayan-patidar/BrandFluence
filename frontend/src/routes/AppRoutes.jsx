import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import DashboardLayout from "../layouts/DashboardLayout";

import InfluencerDashboard from "../pages/dashboard/InfluencerDashboard";
import DiscoverCampaigns from "../pages/campaigns/DiscoverCampaigns";
import MyApplications from "../pages/collaborations/MyApplications";
import InfluencerProfile from "../pages/profile/InfluencerProfile";

import BrandDashboard from "../pages/dashboard/BrandDashboard";
import MyCampaigns from "../pages/campaigns/MyCampaigns";
import DiscoverCreators from "../pages/creators/DiscoverCreators";
import ReceivedRequests from "../pages/collaborations/ReceivedRequests";
import BrandProfile from "../pages/profile/BrandProfile";

import Notifications from "../pages/notifications/Notifications";
import AdminDashboard from "../pages/dashboard/AdminDashboard";

function ProtectedRoute({ children }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function InfluencerWorkspace() {
    const [page, setPage] = useState("Dashboard");

    const renderPage = () => {
        switch (page) {
            case "Dashboard":
                return <InfluencerDashboard setPage={setPage} />;

            case "Discover campaigns":
                return <DiscoverCampaigns />;

            case "My applications":
                return <MyApplications />;

            case "Notifications":
                return <Notifications />;

            case "Profile":
                return <InfluencerProfile />;

            default:
                return <InfluencerDashboard setPage={setPage} />;
        }
    };

    return (
        <DashboardLayout page={page} setPage={setPage}>
            {renderPage()}
        </DashboardLayout>
    );
}

function BrandWorkspace() {
    const [page, setPage] = useState("Dashboard");

    const renderPage = () => {
        switch (page) {
            case "Dashboard":
                return <BrandDashboard setPage={setPage} />;

            case "Campaigns":
                return <MyCampaigns />;

            case "Discover creators":
                return <DiscoverCreators />;

            case "Collaborations":
                return <ReceivedRequests />;

            case "Notifications":
                return <Notifications />;

            case "Profile":
                return <BrandProfile />;

            default:
                return <BrandDashboard setPage={setPage} />;
        }
    };

    return (
        <DashboardLayout page={page} setPage={setPage}>
            {renderPage()}
        </DashboardLayout>
    );
}

function RoleRedirect() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === "INFLUENCER") {
        return <Navigate to="/influencer/dashboard" replace />;
    }

    if (user.role === "BRAND") {
        return <Navigate to="/dashboard" replace />;
    }

    if (user.role === "ADMIN") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<RoleRedirect />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <BrandWorkspace />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/influencer/dashboard"
                    element={
                        <ProtectedRoute>
                            <InfluencerWorkspace />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}
