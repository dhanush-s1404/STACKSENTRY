import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Globe,
  Brain,
  Zap,
  Database,
  Cloud,
  Headphones,
  Terminal,
  Bot,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  FolderCheck,
  ThumbsUp,
  ArrowUpRight,
  Mail,
  Send,
  Shield,
  Rocket,
  Sparkles,
  Heart,
  Trophy,
  Target,
  Lightbulb,
  Clock,
  DollarSign,
  Quote,
  Cpu,
  Layers,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-extrabold text-white">
      {count}<span className="text-2xl md:text-3xl">{suffix}</span>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const services = [
  { icon: Code2, title: "Software Development", desc: "Custom software solutions tailored to your business needs" },
  { icon: Globe, title: "Web Development", desc: "Modern, responsive web applications" },
  { icon: Terminal, title: "Python Development", desc: "Data-driven Python applications and scripts" },
  { icon: Brain, title: "AI Solutions", desc: "Intelligent AI/ML powered business solutions" },
  { icon: Zap, title: "Automation", desc: "Workflow automation and process optimization" },
  { icon: Bot, title: "API Development", desc: "Robust RESTful and GraphQL APIs" },
  { icon: Cloud, title: "Cloud Integration", desc: "Scalable cloud infrastructure and deployment" },
  { icon: Database, title: "Database Solutions", desc: "Database design, optimization, and management" },
  { icon: Headphones, title: "Technical Support", desc: "24/7 technical support and maintenance" },
];

const stats = [
  { icon: FolderCheck, value: 100, suffix: "+", label: "Projects Completed" },
  { icon: Users, value: 50, suffix: "+", label: "Team Members" },
  { icon: Users, value: 500, suffix: "+", label: "Candidates Placed" },
  { icon: ThumbsUp, value: 98, suffix: "%", label: "Client Satisfaction" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "CTO, TechVista Solutions",
    text: "StackSentry transformed our entire tech infrastructure. Their team delivered exceptional results on time and within budget.",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Founder, DataFlow Analytics",
    text: "The AI solutions provided by StackSentry have revolutionized our data processing. We've seen a 300% improvement in efficiency.",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    role: "VP Engineering, CloudNine",
    text: "Working with StackSentry was a game-changer. Their cloud integration expertise helped us scale seamlessly.",
    rating: 5,
  },
];

const faqs = [
  { q: "What services does StackSentry Technologies offer?", a: "We offer software development, web development, Python development, AI solutions, automation, API development, cloud integration, database solutions, and technical support services." },
  { q: "How can I apply for a job at StackSentry?", a: "Visit our Careers page, browse open positions, and click 'Apply Now' on any role that interests you. Fill out the multi-step application form with your details, education, experience, and resume." },
  { q: "Does StackSentry offer internship programs?", a: "Yes! We offer internship programs for students and fresh graduates who are eager to learn and grow in technology." },
  { q: "What is the hiring process?", a: "Our process includes application review, shortlisting, technical assessment, interview(s), and offer. You can track your application status in real-time through your dashboard." },
  { q: "Where is StackSentry Technologies located?", a: "We are headquartered in Coimbatore, Tamil Nadu, India, with team members working remotely across the globe." },
];

const techStack = [
  { name: "React" },
  { name: "TypeScript" },
  { name: "Python" },
  { name: "Node.js" },
  { name: "AWS" },
  { name: "Docker" },
  { name: "Kubernetes" },
  { name: "PostgreSQL" },
  { name: "MongoDB" },
  { name: "Redis" },
  { name: "GraphQL" },
  { name: "Next.js" },
  { name: "Django" },
  { name: "FastAPI" },
  { name: "Tailwind CSS" },
  { name: "Figma" },
];

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
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

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "rounded-2xl overflow-hidden transition-all duration-300",
        open
          ? "bg-white dark:bg-secondary-800 shadow-xl shadow-primary-500/5 border border-primary-200 dark:border-primary-800/50"
          : "bg-white dark:bg-secondary-800/50 border border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700"
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full px-6 py-5 text-left group"
      >
        <span className="flex-1 font-semibold text-slate-900 dark:text-white text-sm md:text-base">{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-primary-500" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-12">
          {a}
        </p>
      </motion.div>
    </motion.div>
  );
}

function FloatingOrb({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={cn("absolute rounded-full blur-3xl", className)}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-primary-900 to-secondary-900">
          {/* Animated Floating Orbs */}
          <FloatingOrb className="w-[500px] h-[500px] bg-primary-500/20 top-[-10%] left-[-5%]" delay={0} />
          <FloatingOrb className="w-[400px] h-[400px] bg-accent-400/15 bottom-[-5%] right-[-5%]" delay={2} />
          <FloatingOrb className="w-[300px] h-[300px] bg-primary-400/10 top-[40%] right-[20%]" delay={4} />
          <FloatingOrb className="w-[250px] h-[250px] bg-accent-300/10 top-[20%] left-[60%]" delay={1} />

          {/* Dot Grid Pattern */}
          <div className="absolute inset-0 dot-grid opacity-40" />

          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-secondary-900/80" />
        </div>

        <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm mb-8 hover:bg-white/15 transition-colors cursor-default"
          >
            <Shield className="h-4 w-4 text-primary-400" />
            Welcome to StackSentry Technologies
            <Sparkles className="h-3 w-3 text-warning-400 animate-pulse" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight"
          >
            Build. Learn.
            <br />
            <span className="font-extrabold">
              Innovate. Grow.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Empowering businesses with cutting-edge technology solutions. From software development
            to AI innovation, we deliver excellence that drives real results.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/careers">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity animate-glow-pulse" />
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Rocket className="h-5 w-5" />}
                  className="relative bg-gradient-to-r from-primary-500 to-accent-500 text-white border-0 hover:from-primary-400 hover:to-accent-400 shadow-2xl shadow-primary-500/30"
                >
                  Explore Careers
                </Button>
              </motion.div>
            </Link>
            <Link to="/services">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Our Services
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Floating Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-center gap-6 mt-12 text-white/40 text-xs"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Enterprise Security
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              Global Team
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5" />
              100% Commitment
            </span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="h-5 w-5 text-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* Company Overview */}
      <Section className="section-padding bg-slate-50 dark:bg-secondary-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-primary-500 font-semibold text-sm uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-3 mb-4">
              Pioneering Technology Excellence
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              StackSentry Technologies is a leading technology company dedicated to building innovative solutions
              that drive business growth and digital transformation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Innovation First", desc: "We leverage cutting-edge technologies to solve complex business challenges and create impactful solutions.", icon: Brain, color: "from-primary-500 to-blue-600" },
              { title: "Client Focused", desc: "Your success is our mission. We work closely with clients to deliver tailored solutions that exceed expectations.", icon: ThumbsUp, color: "from-accent-500 to-primary-500" },
              { title: "Expert Team", desc: "Our team of skilled professionals brings years of experience across multiple technology domains.", icon: Users, color: "from-primary-600 to-accent-500" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <Card glass className="h-full overflow-hidden relative group">
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500", item.color)} />
                    <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg", item.color)}>
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 text-primary-500 font-semibold text-sm uppercase tracking-wider">
                <Target className="h-4 w-4" />
                Our Purpose
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-3 mb-6">
                Mission & Vision
              </h2>
              <div className="space-y-4">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="p-6 rounded-2xl bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/20 border border-primary-100 dark:border-primary-900/30 transition-shadow hover:shadow-lg hover:shadow-primary-500/5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-bold text-primary-600 dark:text-primary-400">Our Mission</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    To empower organizations with innovative technology solutions that drive growth,
                    enhance efficiency, and create lasting value in an ever-evolving digital landscape.
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="p-6 rounded-2xl bg-gradient-to-r from-accent-50 to-transparent dark:from-accent-900/20 border border-accent-100 dark:border-accent-900/30 transition-shadow hover:shadow-lg hover:shadow-accent-500/5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-bold text-accent-600 dark:text-accent-400">Our Vision</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    To be a globally recognized technology partner known for delivering transformative solutions,
                    nurturing talent, and driving innovation that shapes the future.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-2xl animate-glow-pulse" />
              <div className="relative glass-card p-8 rounded-3xl">
                <div className="grid grid-cols-2 gap-4">
                  {services.slice(0, 4).map((s, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className="p-5 rounded-2xl bg-white/60 dark:bg-white/5 text-center cursor-default group transition-all"
                    >
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{s.title}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-500">And many more capabilities...</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section className="section-padding bg-slate-50 dark:bg-secondary-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-primary-500 font-semibold text-sm uppercase tracking-wider">
              <Layers className="h-4 w-4" />
              What We Do
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-3 mb-4">
              Our Services
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Comprehensive technology solutions to help your business thrive in the digital age.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div key={i} variants={fadeUp}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <Card glass className="h-full overflow-hidden relative group border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 group-hover:scale-110 transition-all">
                          <service.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {service.desc}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-primary-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn more <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="text-center mt-12">
            <Link to="/services">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
                  View All Services
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-primary-500 font-semibold text-sm uppercase tracking-wider">
              <Trophy className="h-4 w-4" />
              Why Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-3 mb-4">
              Why Choose StackSentry?
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Expert Team", desc: "Skilled professionals with deep domain expertise", icon: Users, color: "primary" },
              { num: "02", title: "Agile Process", desc: "Fast, iterative development with continuous delivery", icon: Zap, color: "accent" },
              { num: "03", title: "24/7 Support", desc: "Round-the-clock technical support and maintenance", icon: Clock, color: "primary" },
              { num: "04", title: "Cost Effective", desc: "Premium quality solutions at competitive pricing", icon: DollarSign, color: "accent" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-300 group bg-white dark:bg-secondary-800/50 hover:shadow-xl hover:shadow-primary-500/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-4xl font-extrabold text-primary-500/10 group-hover:text-primary-500/30 transition-colors block mb-1">
                      {item.num}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section className="relative section-padding overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600" />
        <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
        <div className="absolute inset-0 dot-grid opacity-10" />

        {/* Floating decorative elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 right-10 w-48 h-48 border border-white/5 rounded-full"
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Our Impact in Numbers
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors"
                >
                  <stat.icon className="h-7 w-7 text-white/50 mx-auto mb-3" />
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  <p className="text-white/70 mt-2 text-sm font-medium">{stat.label}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="section-padding bg-slate-50 dark:bg-secondary-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-primary-500 font-semibold text-sm uppercase tracking-wider">
              <Quote className="h-4 w-4" />
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-3 mb-4">
              What Our Clients Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <Card glass className="h-full relative overflow-hidden group">
                    {/* Quote mark decoration */}
                    <div className="absolute top-4 right-4 text-6xl font-serif text-primary-500/10 leading-none select-none group-hover:text-primary-500/20 transition-colors">"</div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * j + 0.5 }}
                        >
                          <Star className="h-4 w-4 fill-warning-400 text-warning-400 drop-shadow-sm" />
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 italic leading-relaxed relative z-10">
                      "{t.text}"
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">{t.role}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Tech Stack - Marquee */}
      <Section className="section-padding overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-primary-500 font-semibold text-sm uppercase tracking-wider">
              <Cpu className="h-4 w-4" />
              Tech Stack
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-3 mb-4">
              Technologies We Use
            </h2>
          </motion.div>
        </div>

        {/* Marquee Row 1 */}
        <motion.div variants={fadeUp} className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-secondary-900 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-secondary-900 to-transparent z-10" />

          <div className="flex animate-marquee">
            {[...techStack, ...techStack].map((tech, i) => (
              <div
                key={i}
                className="flex-shrink-0 mx-2"
              >
                <motion.div
                  whileHover={{ scale: 1.1, y: -4 }}
                  className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-primary-400 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-lg hover:shadow-primary-500/10 transition-all cursor-default bg-white dark:bg-secondary-800 flex items-center gap-2 whitespace-nowrap"
                >
                  {tech.name}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Marquee Row 2 (reverse) */}
        <motion.div variants={fadeUp} className="relative mt-4">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-secondary-900 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-secondary-900 to-transparent z-10" />

          <div className="flex animate-marquee-slow" style={{ animationDirection: "reverse" }}>
            {[...techStack.slice().reverse(), ...techStack.slice().reverse()].map((tech, i) => (
              <div
                key={i}
                className="flex-shrink-0 mx-2"
              >
                <motion.div
                  whileHover={{ scale: 1.1, y: -4 }}
                  className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-primary-400 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-lg hover:shadow-primary-500/10 transition-all cursor-default bg-white dark:bg-secondary-800 flex items-center gap-2 whitespace-nowrap"
                >
                  {tech.name}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Hiring CTA */}
      <Section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-primary-900 to-secondary-900" />
        <div className="absolute inset-0 dot-grid opacity-20" />
        <FloatingOrb className="w-[400px] h-[400px] bg-primary-500/15 top-[-20%] right-[-10%]" delay={0} />
        <FloatingOrb className="w-[300px] h-[300px] bg-accent-400/10 bottom-[-20%] left-[-10%]" delay={3} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              We're Hiring!
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
              Join our growing team of talented professionals. We're looking for passionate
              individuals who want to make a difference.
            </p>
            <Link to="/careers">
              <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="h-5 w-5" />}
                  className="bg-white text-primary-600 hover:bg-slate-100 shadow-2xl shadow-black/20 font-bold"
                >
                  View Open Positions
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="section-padding bg-slate-50 dark:bg-secondary-900/50">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-primary-500 font-semibold text-sm uppercase tracking-wider">
              <Lightbulb className="h-4 w-4" />
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-3 mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Contact */}
      <Section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 text-primary-500 font-semibold text-sm uppercase tracking-wider">
                <Mail className="h-4 w-4" />
                Get in Touch
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-3 mb-4">
                Let's Build Something Great
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Have a question or want to work together? We'd love to hear from you. Drop us a message
                and we'll get back to you within 24 hours.
              </p>
              <div className="space-y-4">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Email</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">contact@stacksentry.com</p>
                  </div>
                </motion.div>
              </div>
              <Link to="/contact" className="mt-8 inline-block">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="primary" icon={<ArrowRight className="h-4 w-4" />}>
                    Contact Us
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card glass className="p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="absolute inset-0 dot-grid opacity-30" />
                  <div className="relative text-center p-6">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <MapPinIcon className="h-12 w-12 text-primary-500 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Coimbatore, Tamil Nadu</p>
                    <p className="text-xs text-slate-500 mt-1">India</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Newsletter */}
      <Section className="section-padding bg-slate-50 dark:bg-secondary-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div variants={fadeUp}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Send className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Stay Updated
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Subscribe to our newsletter for the latest updates and opportunities. No spam, we promise!
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-white/5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button type="submit" className="px-6 bg-gradient-to-r from-primary-500 to-accent-500 border-0 hover:from-primary-400 hover:to-accent-400 shadow-lg shadow-primary-500/20">
                  Subscribe
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </Section>
    </main>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
