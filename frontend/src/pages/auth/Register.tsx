import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, Shield, ArrowRight } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "@/components/ui/Toast";

const schema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!accepted) { showToast.error("Please accept the terms"); return; }
    setLoading(true);
    try {
      await registerUser({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      showToast.success("Account created! Please sign in.");
      navigate("/auth/login");
    } catch (err: any) {
      showToast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500 via-secondary-900 to-primary-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative z-10 text-center text-white max-w-md">
          <Shield className="h-16 w-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Join StackSentry</h2>
          <p className="text-white/60 text-lg">Start your journey with us and explore exciting career opportunities.</p>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold"><span className="text-slate-900 dark:text-white">Stack</span><span className="text-primary-500">Sentry</span></span>
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Fill in the details to get started</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" icon={<User className="h-4 w-4" />} placeholder="John Doe" error={errors.full_name?.message} {...register("full_name")} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Email" type="email" icon={<Mail className="h-4 w-4" />} placeholder="you@email.com" error={errors.email?.message} {...register("email")} />
              <Input label="Phone" icon={<Phone className="h-4 w-4" />} placeholder="+91 XXXXX XXXXX" error={errors.phone?.message} {...register("phone")} />
            </div>
            <div className="relative">
              <Input label="Password" type={showPassword ? "text" : "password"} icon={<Lock className="h-4 w-4" />} placeholder="Min 8 characters" error={errors.password?.message} {...register("password")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Input label="Confirm Password" type="password" icon={<Lock className="h-4 w-4" />} placeholder="Re-enter password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                I agree to the <Link to="/terms" className="text-primary-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary-500 hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <Button type="submit" className="w-full" loading={loading} icon={<ArrowRight className="h-4 w-4" />}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account? <Link to="/auth/login" className="text-primary-500 hover:text-primary-600 font-medium">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
