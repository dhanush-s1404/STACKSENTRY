import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const sections = [
  { title: "Information We Collect", content: "We collect information you provide directly, such as when you create an account, apply for a job, or contact us. This includes your name, email, phone number, resume, education, work experience, and other application details." },
  { title: "How We Use Your Information", content: "We use your information to process job applications, communicate with you about opportunities, improve our services, and comply with legal obligations. We may also use aggregated data for analytics and service improvement." },
  { title: "Information Sharing", content: "We do not sell your personal information. We may share your data with authorized team members for recruitment purposes, with service providers who assist our operations, or as required by law." },
  { title: "Data Security", content: "We implement industry-standard security measures to protect your personal information, including encryption, access controls, and regular security audits." },
  { title: "Data Retention", content: "We retain your information for as long as necessary to fulfill the purposes described in this policy, or as required by law. Application data is typically retained for up to 2 years." },
  { title: "Your Rights", content: "You have the right to access, correct, or delete your personal information. You can also request a copy of your data or withdraw consent at any time by contacting us." },
  { title: "Cookies", content: "Our website uses cookies to improve your experience, analyze usage, and assist in marketing. You can control cookie preferences through your browser settings." },
  { title: "Changes to This Policy", content: "We may update this policy from time to time. We will notify you of significant changes by posting the updated policy on our website." },
];

export default function PrivacyPolicy() {
  return (
    <main className="pt-20 lg:pt-24 section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
          </div>
          <p className="text-sm text-slate-500 mb-8">Last updated: January 2026</p>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            At StackSentry Technologies, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
          </p>
          <div className="space-y-6">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{s.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500">
              For questions about this policy, contact us at <span className="text-primary-500">privacy@stacksentry.com</span>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
