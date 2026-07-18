import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MailCheck, Shield, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";

export default function VerifyEmail() {
  const [resent, setResent] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-secondary-900 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold"><span className="text-slate-900 dark:text-white">Stack</span><span className="text-primary-500">Sentry</span></span>
        </Link>

        <div className="glass-card p-8 rounded-2xl">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <MailCheck className="h-16 w-16 text-primary-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Verify Your Email</h2>
          <p className="text-sm text-slate-500 mb-6">
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </p>

          <Button
            variant="outline"
            className="w-full mb-4"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={() => {
              setResent(true);
              showToast.success("Verification email resent!");
            }}
          >
            {resent ? "Email Resent!" : "Resend Verification Email"}
          </Button>

          <Link to="/auth/login" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
