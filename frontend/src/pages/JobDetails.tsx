import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  CheckCircle,
  Share2,
  Calendar,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { getJob } from "@/lib/services/jobsService";

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return "Competitive";
  if (min && max) return `₹${(min / 100000).toFixed(1)}L – ₹${(max / 100000).toFixed(1)}L per annum`;
  if (min) return `From ₹${(min / 100000).toFixed(1)}L per annum`;
  return `Up to ₹${(max! / 100000).toFixed(1)}L per annum`;
};

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="flex gap-4">
        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobDetails() {
  const { id } = useParams();

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJob(id!),
    enabled: !!id,
  });

  return (
    <main className="pt-20 lg:pt-24 section-padding">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/careers"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-500 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Careers
        </Link>

        {isLoading && <DetailSkeleton />}

        {isError && (
          <div className="text-center py-16">
            <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 mb-4">Failed to load job details.</p>
            <Link to="/careers">
              <Button variant="outline" size="sm">Browse All Jobs</Button>
            </Link>
          </div>
        )}

        {job && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {job.title}
                  </h1>
                  <Badge status={job.jobType} size="md" />
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                  {job.department && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" /> {job.department}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {job.location}
                    {job.isRemote && <Badge status="remote" size="sm" />}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" /> {formatSalary(job.salaryMin, job.salaryMax)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {job.experienceLevel.replace(/_/g, " ")}
                  </span>
                  {job.applicationDeadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Share2 className="h-4 w-4" />}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  Share
                </Button>
                <Link to={`/apply/${id}`}>
                  <Button variant="primary" icon={<ArrowRight className="h-4 w-4" />}>
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card glass hover={false}>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Description</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </Card>

                {job.responsibilities.length > 0 && (
                  <Card glass hover={false}>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      Responsibilities
                    </h2>
                    <ul className="space-y-2">
                      {job.responsibilities.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {job.requirements.length > 0 && (
                  <Card glass hover={false}>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      Requirements
                    </h2>
                    <ul className="space-y-2">
                      {job.requirements.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                {job.benefits.length > 0 && (
                  <Card glass hover={false}>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Benefits</h3>
                    <ul className="space-y-2">
                      {job.benefits.map((b: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle className="h-3.5 w-3.5 text-primary-500 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                <Card glass hover={false}>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Job Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Type</span>
                      <span className="font-medium text-slate-900 dark:text-white capitalize">
                        {job.jobType.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Experience</span>
                      <span className="font-medium text-slate-900 dark:text-white capitalize">
                        {job.experienceLevel.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Salary</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location</span>
                      <span className="font-medium text-slate-900 dark:text-white">{job.location}</span>
                    </div>
                    {job.positionsAvailable > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Positions</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {job.positionsAvailable - job.positionsFilled} open
                        </span>
                      </div>
                    )}
                    {job.applicationDeadline && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Deadline</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {new Date(job.applicationDeadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>

                <Link to={`/apply/${id}`} className="block">
                  <Button variant="primary" className="w-full" icon={<ArrowRight className="h-4 w-4" />}>
                    Apply for this Position
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
