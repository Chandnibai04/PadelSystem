import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogInIcon, MenuIcon, XIcon, Globe, User, ChevronDown, ChevronUp, LogOut } from "lucide-react";

export function NavigationMenu() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [languageOpen, setLanguageOpen] = React.useState(false);
  const [language, setLanguage] = React.useState("English");
  const [isScrolled, setIsScrolled] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Home", to: "/" },
    { label: "Courts", to: "/courts" },
    { label: "Booking", to: "/booking" },
    { label: "About", to: "/about" },
  ];

  // Scroll effect
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguageMenu = () => setLanguageOpen(!languageOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    localStorage.removeItem("currentUser");


    navigate("/");
  };

  // 🔹 Always check localStorage for token dynamically
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0F172A]/95 backdrop-blur-md shadow-lg" : "bg-[#0F172A]"
      } border-b border-[#1E293B]`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-bold text-[#adef0e] tracking-tight hover:scale-105 transition-transform duration-200 flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-[#adef0e] rounded-full flex items-center justify-center text-[#0F172A] font-extrabold">
            PB
          </div>
          <span>PadelBooking</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-4 py-2 rounded-md transition-all duration-200 relative group ${
                location.pathname === item.to
                  ? "text-[#adef0e] font-semibold"
                  : "text-[#E2E8F0] hover:text-[#adef0e] hover:bg-[#1E293B]"
              }`}
            >
              {item.label}
              <span
                className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#adef0e] transition-all duration-300 ${
                  location.pathname === item.to ? "w-4/5" : "w-0 group-hover:w-4/5"
                }`}
              ></span>
            </Link>
          ))}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={toggleLanguageMenu}
              className="flex items-center gap-1 text-sm px-3 py-2 rounded-md text-[#E2E8F0] hover:bg-[#1E293B] transition-all"
            >
              <Globe className="h-4 w-4" />
              {language}
              {languageOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {/* Auth Section */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#1E293B] transition-colors"
              >
                <User className="h-5 w-5 text-[#adef0e]" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md font-semibold transition"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-[#adef0e] hover:bg-[#9cdd0d] text-[#020617] px-5 py-2 rounded-full font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              <LogInIcon className="w-4 h-4" /> Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#E2E8F0] focus:outline-none p-2 rounded-md hover:bg-[#1E293B] transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0F172A]/95 backdrop-blur-md px-4 pt-2 pb-6 border-t border-[#1E293B] animate-slideDown">
          <nav className="flex flex-col gap-1 text-[#E2E8F0]">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-md transition ${
                  location.pathname === item.to
                    ? "bg-[#1E293B] text-[#adef0e] font-medium"
                    : "hover:bg-[#1E293B] hover:text-[#adef0e]"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 pt-3 border-t border-[#1E293B]">
              {isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-md hover:bg-[#1E293B]"
                  >
                    <User className="w-5 h-5 text-[#adef0e]" /> My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 bg-[#adef0e] hover:bg-[#9cdd0d] text-[#020617] px-5 py-3 rounded-full font-semibold shadow transition hover:shadow-md"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogInIcon className="w-4 h-4" /> Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default NavigationMenu;
