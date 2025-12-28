import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loginError, setLoginError] = useState("");
  const { login } = useApp();
  const navigate = useNavigate();

  // Form validation function
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError("");
    setTouched({ email: true, password: true });

    if (validateForm()) {
      const success = login(email, password);
      if (!success) {
        setLoginError(
          "Invalid email or password. Try: kichu@gmail.com / kichuu"
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8 relative">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-indigo-700 font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-200 hover:border-indigo-300 z-10"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Home
      </button>

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-10 min-h-[580px] flex flex-col relative z-10">
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg">
              TA
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Trainer Attendance
          </h1>
          <p className="text-base text-slate-600 font-medium">
            Super Admin Portal
          </p>
          <p className="text-sm text-slate-500 mt-3">
            Welcome back! Please sign in to access the admin dashboard and
            manage trainer attendance records efficiently.
          </p>
        </div>

        {loginError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-start">
            <svg
              className="w-5 h-5 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{loginError}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-8 justify-center"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) validateForm();
              }}
              onBlur={() => handleBlur("email")}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                touched.email && errors.email
                  ? "border-red-400 focus:ring-red-100 focus:border-red-500"
                  : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-500"
              } bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:ring-4 outline-none transition-all duration-200`}
              placeholder="admin@trainer.com"
            />
            {touched.email && errors.email && (
              <p className="text-red-600 text-xs mt-1.5 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) validateForm();
              }}
              onBlur={() => handleBlur("password")}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                touched.password && errors.password
                  ? "border-red-400 focus:ring-red-100 focus:border-red-500"
                  : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-500"
              } bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:ring-4 outline-none transition-all duration-200`}
              placeholder="••••••••"
            />
            {touched.password && errors.password && (
              <p className="text-red-600 text-xs mt-1.5 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn btn-success py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-200 text-base font-semibold"
          >
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Sign In to Dashboard
            </span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center">
            <svg
              className="w-4 h-4 mr-1.5 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Secure encrypted connection · Admin access only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
