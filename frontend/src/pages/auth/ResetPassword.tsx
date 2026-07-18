import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Shield, ArrowRight, Check } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import api from "@/lib/api";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { showToast.error("Passwords don't match"); return; }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, new_password: password });
      setDone(true);
      showToast.success("Password reset successful");
    } catch (err: any) {
      showToast.error(err.message || "Reset failed");
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
          {done ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className="w-16 h-16 rounded-full bg-success-500 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Password Reset!</h2>
              <p className="text-sm text-slate-500 mb-6">Your password has been successfully reset.</p>
              <Link to="/auth/login"><Button variant="primary" className="w-full">Sign In</Button></Link>
            </motion.div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Reset Password</h2>
              <p className="text-sm text-slate-500 mb-6">Enter your new password below</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="New Password" type="password" icon={<Lock className="h-4 w-4" />} placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Input label="Confirm Password" type="password" icon={<Lock className="h-4 w-4" />} placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                <Button type="submit" className="w-full" loading={loading} icon={<ArrowRight className="h-4 w-4" />}>
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}
