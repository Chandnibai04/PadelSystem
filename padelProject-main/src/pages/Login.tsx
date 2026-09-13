import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { token } = useParams(); // check if reset-password token exists

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // if token is present in URL, open reset form directly
  useEffect(() => {
    if (token) setShowResetPassword(true);
  }, [token]);

  // Navigate to signup page
  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  // ------------------- LOGIN -------------------
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await axios.post("http://localhost:5000/api/users/login", {
      emailOrPhone,
      password,
    });

    toast.success("✅ Login successful!");

    // Save token
    localStorage.setItem("token", res.data.token);

    // Save user details
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    navigate("/");
  } catch (err: any) {
    toast.error(err.response?.data?.error || "❌ Login failed");
  } finally {
    setLoading(false);
  }
};


  // ------------------- FORGOT PASSWORD -------------------
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        { email: emailOrPhone }
      );
      toast.success(res.data.message || "✅ Reset link sent to email!");
      setShowForgotPassword(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "❌ Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- RESET PASSWORD -------------------
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() !== confirmPassword.trim()) {
      toast.error("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/users/reset-password/${token}`,  
        { password , confirmPassword }
      );
      toast.success(res.data.message || "✅ Password reset successful!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "❌ Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a] px-4 text-white -mt-10">
      <div className="bg-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-2xl w-full max-w-md shadow-2xl border border-white/10 ">
        {/* ------------ LOGIN FORM ------------ */}
        {!showForgotPassword && !showResetPassword && (
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-[#adef0e]">
              Login
            </h2>

            <Input
              type="text"
              placeholder="Email or Phone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="bg-[#1e293b]/60 text-white border border-[#adef0e]"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#1e293b]/60 text-white border border-[#adef0e]"
              required
            />

            <Button
              type="submit"
              className="w-full border border-[#adef0e] text-[#adef0e] hover:bg-[#adef0e] hover:text-[#020617]"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="flex justify-between text-sm">
              <p
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-300 cursor-pointer hover:underline"
              >
                Forgot Password?
              </p>
              <p
                onClick={handleSignupRedirect}
                className="text-[#adef0e] cursor-pointer hover:underline"
              >
                Sign Up
              </p>
            </div>
          </form>
        )}

        {/* ------------ FORGOT PASSWORD FORM ------------ */}
        {showForgotPassword && !showResetPassword && (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-[#adef0e]">
              Forgot Password
            </h2>
            <Input
              type="email"
              placeholder="Enter your email"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="bg-[#1e293b]/60 text-white border border-[#adef0e]"
              required
            />
            <Button
              type="submit"
              className="w-full border border-[#adef0e] text-[#adef0e] hover:bg-[#adef0e] hover:text-[#020617]"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="flex justify-between text-sm">
              <p
                onClick={() => setShowForgotPassword(false)}
                className="text-blue-300 cursor-pointer hover:underline"
              >
                Back to Login
              </p>
              <p
                onClick={handleSignupRedirect}
                className="text-[#adef0e] cursor-pointer hover:underline"
              >
                Sign Up
              </p>
            </div>
          </form>
        )}

        {/* ------------ RESET PASSWORD FORM ------------ */}
        {showResetPassword && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-[#adef0e]">
              Reset Password
            </h2>
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#1e293b]/60 text-white border border-[#adef0e]"
              required
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#1e293b]/60 text-white border border-[#adef0e]"
              required
            />

            <Button
              type="submit"
              className="w-full border border-[#adef0e] text-[#adef0e] hover:bg-[#adef0e] hover:text-[#020617]"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
            
            <p className="text-sm text-center">
              <span
                onClick={() => navigate("/login")}
                className="text-blue-300 cursor-pointer hover:underline mr-4"
              >
                Back to Login
              </span>
              <span
                onClick={handleSignupRedirect}
                className="text-[#adef0e] cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}