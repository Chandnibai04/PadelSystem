import * as React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Users,
  Clock,
  ShieldCheck,
  LayoutGrid,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#0F172A] text-[#E2E8F0] pt-34 pb-20 -mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* HERO SECTION */}
        <section className="text-center mb-16 text-[#adef0e]">
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-20"
        data-aos="zoom-in">
            We’re Building the Future of Padel in karachi
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-3xl mx-auto">
            PadelBooking is an all-in-one platform for padel players, venues, and communities.
            From professional court installation to player-centric digital services, we make padel accessible, enjoyable, and scalable.
          </p>
        </section>

        {/* CORE VALUES */}
        <section className="grid md:grid-cols-3 gap-8 mb-20 text-center">
          <div className="p-6 bg-[#1E293B] rounded-lg shadow-lg">
            <ShieldCheck className="w-10 h-10 mx-auto text-[#adef0e]" />
            <h3 className="text-xl font-semibold my-4">Trust & Quality</h3>
            <p className="text-sm text-[#94A3B8]">
              From court surfaces to support services, we prioritize quality, safety, and fairness in all we offer.
            </p>
          </div>
          <div className="p-6 bg-[#1E293B] rounded-lg shadow-lg">
            <Users className="w-10 h-10 mx-auto text-[#adef0e]" />
            <h3 className="text-xl font-semibold my-4">Community First</h3>
            <p className="text-sm text-[#94A3B8]">
              We build strong local communities by enabling clubs, players, coaches, and fans to connect meaningfully.
            </p>
          </div>
          <div className="p-6 bg-[#1E293B] rounded-lg shadow-lg">
            <LayoutGrid className="w-10 h-10 mx-auto text-[#adef0e]" />
            <h3 className="text-xl font-semibold my-4">Multi-Platform Access</h3>
            <p className="text-sm text-[#94A3B8]">
              Book courts, access coaching, join leagues, and more—all through one seamless platform, anytime.
            </p>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white  mb-10 text-center">
            What Our Community Says
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {["Amazing experience!", "Great platform!", "Highly recommended!"].map((msg, idx) => (
              <div key={idx} className="bg-[#1E293B] p-6 rounded-lg">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FFD700] fill-current" />
                  ))}
                </div>
                <p className="italic mb-2 text-[#E2E8F0]">"{msg}"</p>
                <p className="text-sm text-[#94A3B8]">- Verified User</p>
              </div>
            ))}
          </div>
        </section>

        {/* STATISTICS */}
        <section className="mb-20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-[#adef0e] mb-2">75+</h3>
              <p className="text-sm text-[#94A3B8] uppercase">Courts Activated</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-[#adef0e] mb-2">15K+</h3>
              <p className="text-sm text-[#94A3B8] uppercase">Players Engaged</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-[#adef0e] mb-2">8+</h3>
              <p className="text-sm text-[#94A3B8] uppercase">Cities Covered</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-[#adef0e] mb-2">100%</h3>
              <p className="text-sm text-[#94A3B8] uppercase">Passion for Padel</p>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="border-t border-[#1E293B] pt-12">
          <h2 className="text-3xl font-bold text-white  mb-6 text-center">Let’s Connect</h2>
          <p className="text-[#94A3B8] mb-8 text-center max-w-xl mx-auto">
            Interested in collaborating with us, installing a court, or starting your padel journey? We’d love to hear from you.
          </p>
          <div className="grid md:grid-cols-2 gap-12 text-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#adef0e]" />
                <span>Karachi, Pakistan</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#adef0e]" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#adef0e]" />
                <span>support@padelbooking.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#adef0e]" />
                <span>Support Hours: 9:00 AM – 9:00 PM (Mon–Sat)</span>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg h-64 w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7238.950792916485!2d67.06411528598669!3d24.881760844667962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33ec1ef53e5c7%3A0x14849036f9416ef6!2sBahadurabad%20Gulshan-e-Iqbal%2C%20Karachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1751982972771!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PadelBooking Location"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
