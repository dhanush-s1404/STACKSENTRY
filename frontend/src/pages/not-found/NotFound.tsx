import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-secondary-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <AlertTriangle className="h-20 w-20 text-primary-500 mx-auto mb-6" />
        </motion.div>
        <h1 className="text-8xl font-bold text-slate-200 dark:text-white/10 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Page Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" icon={<Shield className="h-4 w-4" />}>
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </main>
  );
}
