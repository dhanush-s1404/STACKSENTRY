import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  User,
  Bell,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useThemeStore } from "@/store/themeStore";
import Avatar from "@/components/ui/Avatar";

const candidateLinks = [
  { label: "Dashboard", href: "/candidate", icon: LayoutDashboard },
  { label: "My Applications", href: "/candidate/applications", icon: FileText },
  { label: "Profile", href: "/candidate/profile", icon: User },
  { label: "Notifications", href: "/candidate/notifications", icon: Bell },
];

const hrLinks = [
  { label: "Dashboard", href: "/hr", icon: LayoutDashboard },
  { label: "Applicants", href: "/hr/applicants", icon: Users },
  { label: "Interviews", href: "/hr/interviews", icon: Calendar },
  { label: "Analytics", href: "/hr/analytics", icon: BarChart3 },
  { label: "Settings", href: "/hr/settings", icon: Settings },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  const links =
    user?.role === "hr" || user?.role === "admin" ? hrLinks : candidateLinks;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-slate-200 dark:border-slate-700/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
          <Shield className="h-4 w-4 text-white" />
        </div>
        {sidebarOpen && (
          <span className="text-base font-bold whitespace-nowrap">
            <span className="text-slate-900 dark:text-white">Stack</span>
            <span className="text-primary-500">Sentry</span>
          </span>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const isActive =
            link.href === "/candidate" || link.href === "/hr"
              ? location.pathname === link.href
              : location.pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60"
              )}
            >
              <link.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 dark:border-slate-700/50">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-danger-50 hover:text-danger-600 dark:text-slate-400 dark:hover:bg-danger-900/20 dark:hover:text-danger-400 transition-all"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-secondary-900 flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-white dark:bg-secondary-800 border-r border-slate-200 dark:border-slate-700/50 transition-all duration-300 flex-shrink-0 shadow-sidebar",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-secondary-800 z-50 lg:hidden shadow-elevated"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <ChevronLeft
                  className={cn(
                    "h-5 w-5 transition-transform",
                    !sidebarOpen && "rotate-180"
                  )}
                />
              </button>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                {links.find(
                  (l) =>
                    l.href === location.pathname ||
                    location.pathname.startsWith(l.href) ||
                    (l.href === "/candidate" && location.pathname === "/candidate") ||
                    (l.href === "/hr" && location.pathname === "/hr")
                )?.label || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-slate-400" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-500" />
                )}
              </button>

              <Link
                to="/candidate/notifications"
                className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
              </Link>

              <div className="flex items-center gap-2 pl-2 ml-2 border-l border-slate-200 dark:border-slate-700">
                <Avatar name={user?.fullName || "User"} size="sm" />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
