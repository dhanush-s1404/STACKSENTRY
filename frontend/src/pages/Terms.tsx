import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const sections = [
  { title: "Acceptance of Terms", content: "By accessing or using StackSentry Technologies' services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services." },
  { title: "Services", content: "StackSentry Technologies provides technology consulting, software development, and recruitment services. We reserve the right to modify or discontinue any service at any time." },
  { title: "User Accounts", content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate and complete information when creating an account." },
  { title: "Job Applications", content: "When you apply for a position through our platform, you authorize us to verify the information provided. Submitting false or misleading information may result in disqualification." },
  { title: "Intellectual Property", content: "All content, trademarks, and intellectual property on our platform are owned by StackSentry Technologies. You may not reproduce, distribute, or create derivative works without our written consent." },
  { title: "Limitation of Liability", content: "StackSentry Technologies shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services." },
  { title: "Termination", content: "We may suspend or terminate your access to our services at our discretion, with or without notice, for conduct that violates these terms." },
  { title: "Governing Law", content: "These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Coimbatore, Tamil Nadu." },
];

export default function Terms() {
  return (
    <main className="pt-20 lg:pt-24 section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
          </div>
          <p className="text-sm text-slate-500 mb-8">Last updated: January 2026</p>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Welcome to StackSentry Technologies. These Terms of Service govern your use of our website and services. Please read them carefully.
          </p>
          <div className="space-y-6">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{s.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
