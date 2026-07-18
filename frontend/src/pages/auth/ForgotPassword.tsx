import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Shield, ArrowRight, Check } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import api from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      showToast.success("Reset link sent to your email");
    } catch (err: any) {
      showToast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-secondary-900 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold"><span className="text-slate-900 dark:text-white">Stack</span><span className="text-primary-500">Sentry</span></span>
          </Link>
        </div>

        <div className="glass-card p-8 rounded-2xl">
          {sent ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className="w-16 h-16 rounded-full bg-success-500 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Check Your Email</h2>
              <p className="text-sm text-slate-500 mb-6">
                We've sent a password reset link to <span className="font-medium">{email}</span>
              </p>
              <Link to="/auth/login">
                <Button variant="primary" className="w-full">Back to Login</Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Forgot Password?</h2>
              <p className="text-sm text-slate-500 mb-6">Enter your email and we'll send you a reset link</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email" type="email" icon={<Mail className="h-4 w-4" />} placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Button type="submit" className="w-full" loading={loading} icon={<ArrowRight className="h-4 w-4" />}>
                  Send Reset Link
                </Button>
              </form>
              <p className="text-center text-sm text-slate-500 mt-6">
                <Link to="/auth/login" className="text-primary-500 hover:text-primary-600 font-medium">Back to Login</Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}
