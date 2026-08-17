import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { register, loading } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "INFLUENCER"
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            await register(form);

            setSuccess("Account created successfully. You can now sign in.");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (err) {
            setError(err.message || "Registration failed");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-brand">
                    <span className="brand-mark">b</span>
                    brandfluence
                </div>

                <h1>Create your account</h1>

                <p className="subtext">
                    Join BrandFluence and start building meaningful partnerships.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>
                        Full name
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                        />
                    </label>

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

                    <label>
                        I am a
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="INFLUENCER">
                                Influencer
                            </option>

                            <option value="BRAND">
                                Brand
                            </option>
                        </select>
                    </label>

                    <button
                        type="submit"
                        className="primary auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>

                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="link-button"
                        onClick={() => navigate("/login")}
                    >
                        Sign in
                    </button>
                </p>

            </div>
        </div>
    );
}