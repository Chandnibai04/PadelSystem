import { Link } from "react-router-dom";

const Footer = () => {
  return (
<footer className="bg-[#0F172A] text-[#94A3B8] text-sm -mt-[30px] border-t border-[#334155]">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: Our Services */}
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Our Services</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-[#adef0e]">Premium Court Solutions</Link></li>
            <li><Link to="#" className="hover:text-[#adef0e]">Centre Franchise</Link></li>
            <li><Link to="#" className="hover:text-[#adef0e]">Padel Academy</Link></li>
            <li><Link to="#" className="hover:text-[#adef0e]">Padel Tour</Link></li>
          </ul>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-[#adef0e]">Our Story</Link></li>
            <li><Link to="#" className="hover:text-[#adef0e]">About Padel</Link></li>
            <li><Link to="#" className="hover:text-[#adef0e]">Careers</Link></li>
            <li><Link to="#" className="hover:text-[#adef0e]">Contact</Link></li>
          </ul>
        </div>

        {/* Column 3: Padel Centers */}
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Padel Centers</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-[#adef0e]">DHA Phase 6</Link></li>
            <li><Link to="#" className="hover:text-[#adef0e]">F-11 Islamabad</Link></li>
            <li><Link to="#" className="hover:text-[#adef0e]">Clifton</Link></li>
            <li><Link to="#" className="hover:text-[#adef0e]">Gulberg Lahore</Link></li>
          </ul>
        </div>

        {/* Column 4: Social */}
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Connect with Us</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-[#adef0e]">Instagram</Link></li>
            <li><Link to="#" className="hover:text-[#adef0e]">Facebook</Link></li>
            <li><Link to="#" className="hover:text-[#adef0e]">LinkedIn</Link></li>
            <li><Link to="#" className="hover:text-[#adef0e]">YouTube</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#334155] text-center py-4 text-xs px-6 flex flex-col sm:flex-row justify-between items-center">
        <span className="text-[#64748B]">© 2025 PadelBooking. All rights reserved.</span>
        <span className="text-[#64748B]">
          Email:{" "}
          <a href="mailto:info@padelbooking.pk" className="text-[#adef0e] hover:underline">
            info@padelbooking.pk
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
