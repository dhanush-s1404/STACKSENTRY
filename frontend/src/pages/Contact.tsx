import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin, Phone, Send, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { showToast } from "@/components/ui/Toast";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return <motion.section ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={stagger} className={className}>{children}</motion.section>;
}

const faqs = [
  { q: "How long does it take to get a response?", a: "We typically respond within 3-5 business days after receiving your inquiry." },
  { q: "Do you offer remote work?", a: "Yes, many of our positions offer remote or hybrid work options." },
  { q: "What industries do you serve?", a: "We serve various industries including healthcare, finance, e-commerce, education, and more." },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast.success("Message sent! We'll get back to you soon.");
    setName(""); setEmail(""); setSubject(""); setMessage("");
  };

  return (
    <main className="pt-20 lg:pt-24">
      <section className="section-padding gradient-bg-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary-400 font-semibold text-sm uppercase tracking-wider">Contact Us</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">Get in Touch</h1>
            <p className="text-white/70 text-lg">Have a question or want to work together? We'd love to hear from you.</p>
          </motion.div>
        </div>
      </section>

      <Section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div variants={fadeUp} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Information</h2>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "contact@stacksentry.com" },
                  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                  { icon: MapPin, label: "Address", value: "Coimbatore, Tamil Nadu, India" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full h-48 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <p className="text-sm text-slate-500">Map Placeholder</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-2">
              <Card glass hover={false} className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                    <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
                  </div>
                  <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="How can we help?" required />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      required
                      placeholder="Tell us about your project or question..."
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    />
                  </div>
                  <Button type="submit" icon={<Send className="h-4 w-4" />}>Send Message</Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </Section>

      <Section className="section-padding bg-slate-50 dark:bg-secondary-900">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <HelpCircle className="h-8 w-8 text-primary-500 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </motion.div>
          <motion.div variants={fadeUp} className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex items-center justify-between w-full px-6 py-4 text-left">
                  <span className="font-medium text-slate-900 dark:text-white text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-slate-600 dark:text-slate-400">{faq.a}</div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </Section>
    </main>
  );
}
