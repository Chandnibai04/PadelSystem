// src/App.tsx
import { Toaster } from "sonner";
import { Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { loadStripe } from "@stripe/stripe-js";


// Pages
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Courts from "./pages/Courts";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/profile";
import BookingForm from './pages/BookingForm';
import PaymentPage from './components/PaymentPage';
import ReceiptPage from './pages/Receipt';

AOS.init();

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        {/* Layout Route wraps common layout */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="courts" element={<Courts />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="profile" element={<Profile />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
        </Route>

        {/* Reset Password Route (outside Layout) */}
        <Route
          path="api/users/reset-password/:token"
          element={< Login/>}
        />
      </Routes>
    </>
  );
}

export default App;
