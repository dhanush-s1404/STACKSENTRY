import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Code2,
  Globe,
  Terminal,
  Brain,
  Zap,
  Bot,
  Cloud,
  Database,
  Headphones,
  Check,
  ArrowRight,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const services = [
  {
    icon: Code2,
    title: "Software Development",
    desc: "End-to-end custom software solutions designed to meet your unique business requirements.",
    features: ["Custom Applications", "Enterprise Software", "SaaS Platforms", "Legacy Modernization", "Microservices Architecture"],
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Globe,
    title: "Web Development",
    desc: "Modern, responsive, and performant web applications that engage users and drive results.",
    features: ["Single Page Applications", "Progressive Web Apps", "E-commerce Platforms", "CMS Solutions", "Real-time Applications"],
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Terminal,
    title: "Python Development",
    desc: "Data-driven Python applications, scripts, and automation solutions for modern businesses.",
    features: ["Data Processing Pipelines", "Scientific Computing", "Web Scraping", "CLI Tools", "Data Analysis"],
    gradient: "from-warning-500 to-orange-600",
  },
  {
    icon: Brain,
    title: "AI Solutions",
    desc: "Intelligent AI/ML powered solutions that transform how your business operates.",
    features: ["Machine Learning Models", "Natural Language Processing", "Computer Vision", "Predictive Analytics", "Chatbots & Virtual Assistants"],
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: Zap,
    title: "Automation",
    desc: "Streamline workflows and optimize processes with intelligent automation.",
    features: ["RPA Solutions", "CI/CD Pipelines", "Test Automation", "Business Process Automation", "Data Migration"],
    gradient: "from-danger-500 to-rose-600",
  },
  {
    icon: Bot,
    title: "API Development",
    desc: "Robust, secure, and scalable APIs that power your digital ecosystem.",
    features: ["RESTful APIs", "GraphQL APIs", "API Gateway Setup", "Third-party Integrations", "API Documentation"],
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: Cloud,
    title: "Cloud Integration",
    desc: "Scalable cloud infrastructure designed for performance, reliability, and cost efficiency.",
    features: ["AWS/Azure/GCP Setup", "Cloud Migration", "Serverless Architecture", "DevOps & Infrastructure", "Cost Optimization"],
    gradient: "from-sky-500 to-indigo-600",
  },
  {
    icon: Database,
    title: "Database Solutions",
    desc: "Expert database design, optimization, and management for peak performance.",
    features: ["Database Design", "Performance Tuning", "Data Modeling", "Backup & Recovery", "Multi-DB Management"],
    gradient: "from-rose-500 to-danger-600",
  },
  {
    icon: Headphones,
    title: "Technical Support",
    desc: "Reliable 24/7 technical support and maintenance to keep your systems running smoothly.",
    features: ["24/7 Monitoring", "Incident Response", "Performance Monitoring", "Security Audits", "System Updates"],
    gradient: "from-violet-500 to-purple-600",
  },
];

export default function Services() {
  return (
    <main className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className="section-padding gradient-bg-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary-400 font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-6">
              Technology Solutions for Every Need
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              From concept to deployment, we provide comprehensive technology services
              that help businesses thrive in the digital age.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <Section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8">
            {services.map((service, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card glass={false} hover={false} className="!p-0 overflow-hidden">
                  <div className="grid md:grid-cols-5 gap-0">
                    <div className={`md:col-span-2 bg-gradient-to-br ${service.gradient} p-8 flex flex-col justify-center`}>
                      <service.icon className="h-12 w-12 text-white mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                      <p className="text-white/80 text-sm">{service.desc}</p>
                    </div>
                    <div className="md:col-span-3 p-8">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Key Features</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {service.features.map((f, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                              <Check className="h-3 w-3 text-primary-500" />
                            </div>
                            <span className="text-sm text-slate-700 dark:text-slate-300">{f}</span>
                          </div>
                        ))}
                      </div>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
                      >
                        Get Started <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="section-padding gradient-bg-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              Let's discuss how our services can help transform your business.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-600 font-semibold hover:bg-slate-100 transition-colors"
            >
              Contact Us <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </Section>
    </main>
  );
}
