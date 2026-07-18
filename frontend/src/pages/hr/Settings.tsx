import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Mail, Bell, Lock, Save, Shield } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import * as profileService from "@/lib/services/profileService";

export default function HRSettings() {
  const {
    data: profile,
    isLoading,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: profileService.getProfile,
  });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (profile && !initialized) {
    setFullName(profile.fullName || "");
    setPhone(profile.phone || "");
    setInitialized(true);
  }

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    applicationAlerts: true,
    interviewReminders: true,
    weeklyDigest: false,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateMutation = useMutation({
    mutationFn: (data: { full_name?: string; phone?: string }) =>
      profileService.updateProfile(data),
    onSuccess: () => {
      showToast.success("Settings saved!");
    },
    onError: () => {
      showToast.error("Failed to save settings. Please try again.");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (data: { current_password: string; new_password: string }) =>
      profileService.changePassword(data),
    onSuccess: () => {
      showToast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: () => {
      showToast.error("Failed to update password. Please check your current password.");
    },
  });

  const handleSaveProfile = () => {
    updateMutation.mutate({
      full_name: fullName,
      phone: phone || undefined,
    });
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      showToast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      showToast.error("New password must be at least 6 characters.");
      return;
    }
    passwordMutation.mutate({
      current_password: currentPassword,
      new_password: newPassword,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mt-2" />
          </div>
        </motion.div>
        <Card glass hover={false}>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account settings</p>
        </div>
        <Button onClick={handleSaveProfile} loading={updateMutation.isPending} icon={<Save className="h-4 w-4" />}>Save Changes</Button>
      </motion.div>

      <Card glass hover={false}>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><User className="h-4 w-4 text-primary-500" /> Profile Settings</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Email" type="email" value={profile?.email || ""} disabled />
          </div>
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </Card>

      <Card glass hover={false}>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-primary-500" /> Notification Preferences</h3>
        <div className="space-y-3">
          {Object.entries({
            emailNotifications: "Email Notifications",
            applicationAlerts: "New Application Alerts",
            interviewReminders: "Interview Reminders",
            weeklyDigest: "Weekly Digest",
          }).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
              <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={(notifications as any)[key]}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-primary-500 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          ))}
        </div>
      </Card>

      <Card glass hover={false}>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Lock className="h-4 w-4 text-primary-500" /> Change Password</h3>
        <div className="space-y-4">
          <Input label="Current Password" type="password" placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="New Password" type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Input label="Confirm Password" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <Button variant="outline" size="sm" icon={<Shield className="h-4 w-4" />} loading={passwordMutation.isPending} onClick={handleChangePassword}>Update Password</Button>
        </div>
      </Card>
    </div>
  );
}
