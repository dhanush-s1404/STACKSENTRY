import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  ArrowRight,
  Search,
  Building2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getJobs } from "@/lib/services/jobsService";
import type { Job } from "@/types";

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
    <motion.section ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={stagger} className={className}>
      {children}
    </motion.section>
  );
}

const departments = ["All", "Engineering", "Data Science", "Operations", "Support"];
const jobTypes = [
  { value: "All", label: "All Types" },
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return "Competitive";
  if (min && max) return `₹${(min / 100000).toFixed(1)}L – ₹${(max / 100000).toFixed(1)}L`;
  if (min) return `From ₹${(min / 100000).toFixed(1)}L`;
  return `Up to ₹${(max! / 100000).toFixed(1)}L`;
};

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>
          <div className="h-4 w-72 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="flex gap-3">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
        <div className="h-9 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    </div>
  );
}

export default function Careers() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [jobType, setJobType] = useState("All");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["jobs", { search, department, type: jobType }],
    queryFn: () =>
      getJobs({
        search: search || undefined,
        department: department === "All" ? undefined : department,
        type: jobType === "All" ? undefined : jobType,
        per_page: 50,
      }),
  });

  const jobs = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <main className="pt-20 lg:pt-24">
      <section className="section-padding gradient-bg-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary-400 font-semibold text-sm uppercase tracking-wider">Careers</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-6">
              Build Your Future With Us
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Join a team of innovators, creators, and problem solvers. We're building
              the next generation of technology solutions.
            </p>
          </motion.div>
        </div>
      </section>

      <Section className="section-padding">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="glass-card p-4 rounded-2xl mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-white/5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                />
              </div>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-white/5 text-sm focus:border-primary-500 focus:outline-none"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>
                ))}
              </select>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-white/5 text-sm focus:border-primary-500 focus:outline-none"
              >
                {jobTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </motion.div>

          <motion.p variants={fadeUp} className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {!isLoading && `${total} position${total !== 1 ? "s" : ""} available`}
          </motion.p>

          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-16">
              <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">Failed to load jobs. Please try again later.</p>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="space-y-4">
              {jobs.map((job: Job) => (
                <motion.div key={job.id} variants={fadeUp}>
                  <Card glass className="group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
                            {job.title}
                          </h3>
                          <Badge status={job.jobType} />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                          {job.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                          {job.department && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" /> {job.department}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {job.jobType.replace(/_/g, " ")}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5" /> {formatSalary(job.salaryMin, job.salaryMax)}
                          </span>
                        </div>
                      </div>
                      <Link to={`/careers/${job.id}`} className="flex-shrink-0">
                        <Button variant="outline" size="sm" icon={<ArrowRight className="h-4 w-4" />}>
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && !isError && jobs.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No jobs match your filters. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}
