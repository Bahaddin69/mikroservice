/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/api";

export default function LoginForm() {
    const [email, setEmail] = useState("test@test.com");
    const [password, setPassword] = useState("123456");

    // const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            console.log(email, password);
            const response = await loginApi({ email, password });

            if (response.status === 200) {
                console.log("response", response.data.token);
                localStorage.setItem("token", response.data.token);
                dispatch(login(response.data.token));
                navigate("/orders");
            }
        } catch (error) {
            console.error("Login failed:", error);
            // Handle error (e.g., display error message)
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="card w-96 bg-white p-6 shadow-xl">
                <h2 className="text-center text-2xl font-bold">Login</h2>
                <form onSubmit={handleLogin} className="mt-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="input input-bordered w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-control mt-2">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className="input input-bordered w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-control mt-4">
                        <button type="submit" className="btn btn-primary w-full">
                            Login
                        </button>
                    </div>
                </form>

                <p className="mt-4 text-center">
                    Don't have an account?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
}
