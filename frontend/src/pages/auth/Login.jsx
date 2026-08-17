import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await login(form);

            if (response.role === "BRAND") {
                navigate("/dashboard");
            } else if (response.role === "INFLUENCER") {
                navigate("/influencer/dashboard");
            } else if (response.role === "ADMIN") {
                navigate("/admin/dashboard");
            }
        } catch (err) {
            setError(err.message || "Invalid email or password");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-brand">
                    <span className="brand-mark">b</span>
                    brandfluence
                </div>

                <h1>Welcome back</h1>

                <p className="subtext">
                    Sign in to manage your creator partnerships.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        className="primary auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        className="link-button"
                        onClick={() => navigate("/register")}
                    >
                        Create one
                    </button>
                </p>

            </div>
        </div>
    );
}