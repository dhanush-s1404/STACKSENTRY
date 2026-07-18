import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  ArrowRight,
  Users,
  Rocket,
  Award,
  Shield,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";

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

const teamMembers = [
  { name: "Arun Kumar", role: "CEO & Founder", dept: "Leadership" },
  { name: "Deepa R", role: "CTO", dept: "Technology" },
  { name: "Vikram Singh", role: "Head of HR", dept: "Human Resources" },
  { name: "Meera Joshi", role: "Lead Developer", dept: "Engineering" },
  { name: "Karthik Nair", role: "AI/ML Engineer", dept: "Data Science" },
  { name: "Priyanka Das", role: "UI/UX Designer", dept: "Design" },
];

const values = [
  { icon: Rocket, title: "Innovation", desc: "We push boundaries and embrace new ideas to deliver cutting-edge solutions." },
  { icon: Users, title: "Collaboration", desc: "We believe in the power of teamwork and open communication." },
  { icon: Award, title: "Excellence", desc: "We strive for the highest quality in everything we do." },
  { icon: Heart, title: "Integrity", desc: "We conduct business with honesty, transparency, and ethical standards." },
];

export default function About() {
  return (
    <main className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className="section-padding gradient-bg-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-primary-400 font-semibold text-sm uppercase tracking-wider">About Us</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-6">
              Building the Future of Technology
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              StackSentry Technologies is where innovation meets excellence. We are a team of
              passionate technologists dedicated to transforming businesses through technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <Section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp}>
              <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Our Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                <p>
                  Founded in Coimbatore, Tamil Nadu, StackSentry Technologies began with a simple yet
                  powerful vision: to make technology accessible and impactful for businesses of all sizes.
                </p>
                <p>
                  What started as a small team of passionate developers has grown into a full-service
                  technology company serving clients across industries. Our journey has been marked by
                  continuous learning, innovation, and an unwavering commitment to excellence.
                </p>
                <p>
                  Today, we are a team of 50+ professionals specializing in software development, AI solutions,
                  cloud integration, and more. We have successfully delivered 100+ projects and placed over
                  500 candidates in top companies worldwide.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-xl" />
                <div className="relative glass-card p-8 rounded-3xl space-y-6">
                  {[
                    { year: "2020", event: "Founded in Coimbatore" },
                    { year: "2021", event: "Expanded to 20+ team members" },
                    { year: "2022", event: "Launched AI solutions division" },
                    { year: "2023", event: "Crossed 100 projects milestone" },
                    { year: "2024", event: "Expanded globally with remote team" },
                    { year: "2025", event: "500+ candidates placed successfully" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-16 text-center">
                        <span className="text-sm font-bold text-primary-500">{item.year}</span>
                      </div>
                      <div className="w-3 h-3 rounded-full bg-primary-500 flex-shrink-0" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">{item.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Mission, Vision, Values */}
      <Section className="section-padding bg-slate-50 dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">What Drives Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Mission, Vision & Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div variants={fadeUp}>
              <Card glass className="h-full border-l-4 border-l-primary-500">
                <Target className="h-8 w-8 text-primary-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Our Mission</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  To empower organizations with innovative technology solutions that drive growth,
                  enhance efficiency, and create lasting value. We are committed to delivering excellence
                  through continuous learning and adaptation to evolving technology trends.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card glass className="h-full border-l-4 border-l-accent-500">
                <Eye className="h-8 w-8 text-accent-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Our Vision</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  To be a globally recognized technology partner known for delivering transformative solutions,
                  nurturing talent, and driving innovation that shapes the future of digital enterprise.
                </p>
              </Card>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card glass className="h-full text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
                    <v.icon className="h-7 w-7 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{v.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Team */}
      <Section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Our People</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-4">
              Meet the Team
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              The talented individuals behind StackSentry's success.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card glass className="text-center">
                  <Avatar name={member.name} size="xl" className="mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-primary-500 font-medium">{member.role}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{member.dept}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Join Us */}
      <Section className="section-padding gradient-bg-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp}>
            <Shield className="h-12 w-12 text-primary-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Team</h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              We're always looking for talented individuals who share our passion for technology and innovation.
            </p>
            <Link to="/careers">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="h-5 w-5" />}
                className="bg-white text-primary-600 hover:bg-slate-100"
              >
                View Open Positions
              </Button>
            </Link>
          </motion.div>
        </div>
      </Section>
    </main>
  );
}
