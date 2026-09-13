import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  // Validation
  const validate = () => {
    const newErrors = { name: "", email: "", phone: "", password: "", confirm: "" };
    let valid = true;

    // Name
    if (!form.name.trim()) { newErrors.name = "Full name is required"; valid = false; }
    else if (form.name.length < 3) { newErrors.name = "Name must be at least 3 characters"; valid = false; }

    // Email
    if (!form.email.trim()) { newErrors.email = "Email is required"; valid = false; }
    else if (!form.email.includes("@")) { newErrors.email = "Enter a valid email"; valid = false; }

    // Phone
    if (!form.phone.trim()) { newErrors.phone = "Phone number is required"; valid = false; }
    else if (!/^\d{10,11}$/.test(form.phone)) { newErrors.phone = "Enter a valid 10-11 digit phone number"; valid = false; }

    // Password
    if (form.password.length < 6) { newErrors.password = "Minimum 6 characters required"; valid = false; }
    else if (!/[A-Z]/.test(form.password)) { newErrors.password = "Must contain at least one uppercase letter"; valid = false; }
    else if (!/[0-9]/.test(form.password)) { newErrors.password = "Must contain at least one number"; valid = false; }

    // Confirm password
    if (form.password !== form.confirm) { newErrors.confirm = "Passwords do not match"; valid = false; }

    setErrors(newErrors);
    return valid;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          confirmPassword: form.confirm,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("🎉 Signup successful! Logging you in...");
        if (data.token) localStorage.setItem("token", data.token);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data.error || "Signup failed ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a] px-4 overflow-hidden relative text-white -mt-10">
      {/* Background */}
      <div className="absolute w-[600px] h-[600px] bg-blue-700/20 blur-3xl rounded-full -top-48 -left-48 animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 blur-2xl rounded-full -bottom-32 -right-32 animate-ping"></div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-2xl w-full max-w-md shadow-2xl space-y-6 border border-white/10 relative z-10"
      >
        <h2 className="text-3xl font-bold text-center text-[#adef0e]">Create an Account</h2>

        <div className="space-y-4">
          {/* Name */}
          <Input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
            className="bg-[#1e293b]/60 text-white border border-[#adef0e]"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}

          {/* Email */}
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
            className="bg-[#1e293b]/60 text-white border border-[#adef0e]"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}

          {/* Phone */}
          <Input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: "" }); }}
            className="bg-[#1e293b]/60 text-white border border-[#adef0e]"
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}

          {/* Password */}
          <div className="relative">
            <Input
              placeholder="Password"
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); }}
              className="bg-[#1e293b]/60 text-white border border-[#adef0e]"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white">
              {showPass ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}

          {/* Confirm Password */}
          <div className="relative">
            <Input
              placeholder="Confirm Password"
              type={showConfirm ? "text" : "password"}
              value={form.confirm}
              onChange={(e) => { setForm({ ...form, confirm: e.target.value }); setErrors({ ...errors, confirm: "" }); }}
              className="bg-[#1e293b]/60 text-white border border-[#adef0e]"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white">
              {showConfirm ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
          {errors.confirm && <p className="text-red-400 text-sm mt-1">{errors.confirm}</p>}

          <Button type="submit" className="w-full border border-[#adef0e] text-[#adef0e] hover:bg-[#adef0e] hover:text-[#020617] font-medium transition-colors" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </div>

        <div className="text-center text-sm text-blue-200">
          Already have an account?{" "}
          <a href="/login" className="underline hover:text-[#adef0e]" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
            Login
          </a>
        </div>
      </motion.form>
    </div>
  );
}
