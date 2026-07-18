import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Shield,
  Heart,
  Send,
} from "lucide-react";
import { useState } from "react";
import { showToast } from "@/components/ui/Toast";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const services = [
  "Software Development",
  "Web Development",
  "AI Solutions",
  "Cloud Integration",
  "API Development",
  "Technical Support",
];

const socials = [
  { icon: Github, label: "GitHub" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Twitter, label: "Twitter" },
  { icon: Instagram, label: "Instagram" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitting(true);
      setTimeout(() => {
        showToast.success("Thanks for subscribing!");
        setEmail("");
        setIsSubmitting(false);
      }, 800);
    }
  };

  return (
    <footer className="relative bg-secondary-900 text-white overflow-hidden">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="space-y-5 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 flex items-center justify-center shadow-md shadow-primary-500/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold">
                <span className="text-white">Stack</span>
                <span className="text-primary-400">Sentry</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering businesses with cutting-edge technology solutions. We
              build, learn, innovate, and grow together.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-primary-300 font-semibold text-sm italic">
                Build. Learn. Innovate. Grow.
              </span>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              {socials.map(({ icon: Icon, label }, i) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-white flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-primary-500 to-transparent" />
              Quick Links
            </h3>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-primary-400 text-sm transition-colors duration-200 py-2 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-white flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-primary-500 to-transparent" />
              Services
            </h3>
            <ul className="space-y-1">
              {services.map((name) => (
                <li key={name}>
                  <Link
                    to="/services"
                    className="text-slate-400 hover:text-primary-400 text-sm transition-colors duration-200 py-2 block"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-white flex items-center gap-2">
                <span className="w-8 h-px bg-gradient-to-r from-primary-500 to-transparent" />
                Contact Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-primary-400" />
                  </div>
                  <span className="pt-1">Coimbatore, Tamil Nadu, India</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-primary-400" />
                  </div>
                  <span>contact@stacksentry.com</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-primary-400" />
                  </div>
                  <span>+91 98765 43210</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-white flex items-center gap-2">
                <span className="w-8 h-px bg-gradient-to-r from-primary-500 to-transparent" />
                Newsletter
              </h3>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all duration-200"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                  className="px-4 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            &copy; 2026 StackSentry Technologies. Made with{" "}
            <Heart className="h-3.5 w-3.5 text-danger-400 fill-danger-400" />{" "}
            in Coimbatore
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link
              to="/privacy"
              className="hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-primary-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
