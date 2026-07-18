import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  LogIn,
  UserPlus,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useThemeStore } from "@/store/themeStore";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(height > 0 ? (latest / height) * 100 : 0);
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const dashboardPath =
    user?.role === "hr" || user?.role === "admin" ? "/hr" : "/candidate";

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-400 via-primary-500 to-accent-500"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-white/70 dark:bg-secondary-900/70 backdrop-blur-2xl shadow-card border-b border-slate-200/60 dark:border-slate-700/30"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:shadow-primary-500/30 group-hover:scale-105 transition-all duration-300">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Stack
                </span>
                <span className="text-xl font-extrabold text-primary-500">
                  Sentry
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "text-primary-500"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200/50 dark:border-primary-500/20"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <div
                      className={cn(
                        "absolute inset-0 rounded-xl transition-all duration-200",
                        !isActive &&
                          "bg-slate-100 dark:bg-white/5 opacity-0 group-hover:opacity-100"
                      )}
                    />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-5 w-5 text-slate-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-5 w-5 text-slate-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200"
                  >
                    <Avatar name={user?.fullName || "U"} size="sm" />
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-slate-500 hidden sm:block transition-transform duration-200",
                        showUserMenu && "rotate-180"
                      )}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 shadow-elevated border border-slate-200 dark:border-slate-700/50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-700/20">
                          <div className="flex items-center gap-3">
                            <Avatar name={user?.fullName || "U"} size="md" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {user?.fullName}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {user?.email}
                              </p>
                              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                                <Shield className="h-2.5 w-2.5" />
                                {user?.role}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <Link
                            to={dashboardPath}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-slate-700 dark:text-slate-300"
                          >
                            <LayoutDashboard className="h-4 w-4 text-primary-500" />
                            Dashboard
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-xl hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors text-danger-600 dark:text-danger-400"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/auth/login">
                    <Button variant="ghost" size="sm" icon={<LogIn className="h-4 w-4" />}>
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button variant="primary" size="sm" icon={<UserPlus className="h-4 w-4" />}>
                      Register
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-secondary-900 z-50 shadow-elevated lg:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-extrabold">
                    <span className="text-slate-900 dark:text-white">Stack</span>
                    <span className="text-primary-500">Sentry</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5 space-y-1">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200",
                          isActive
                            ? "text-primary-500 bg-primary-50 dark:bg-primary-900/20"
                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="h-px bg-slate-200 dark:bg-slate-700/50 my-4" />
                {!isAuthenticated ? (
                  <motion.div
                    className="space-y-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Link to="/auth/login" className="block">
                      <Button variant="outline" className="w-full" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link to="/auth/register" className="block">
                      <Button variant="primary" className="w-full" size="sm">
                        Register
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    className="space-y-1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Link
                      to={dashboardPath}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                    >
                      <LayoutDashboard className="h-4 w-4 text-primary-500" />
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
