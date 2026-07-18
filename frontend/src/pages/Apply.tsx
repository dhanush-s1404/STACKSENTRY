import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Link2,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  Copy,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FileUpload from "@/components/ui/FileUpload";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import { getJob } from "@/lib/services/jobsService";
import { createApplication, uploadApplicationResume } from "@/lib/services/applicationsService";

const personalSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
});

const addressSchema = z.object({
  address: z.string().min(5, "Address is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
});

const experienceSchema = z.object({
  skills: z.string().min(1, "At least one skill is required"),
  yearsOfExperience: z.string().optional(),
  achievements: z.string().optional(),
  internships: z.string().optional(),
});

const linksSchema = z.object({
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  expectedSalary: z.string().optional(),
  preferredWorkMode: z.string().optional(),
});

const coverLetterSchema = z.object({
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
});

type PersonalData = z.infer<typeof personalSchema>;
type AddressData = z.infer<typeof addressSchema>;
type ExperienceData = z.infer<typeof experienceSchema>;
type LinksData = z.infer<typeof linksSchema>;
type CoverLetterData = z.infer<typeof coverLetterSchema>;

const steps = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "Address", icon: MapPin },
  { id: 3, label: "Education", icon: GraduationCap },
  { id: 4, label: "Experience", icon: Briefcase },
  { id: 5, label: "Cover Letter", icon: FileCheck },
  { id: 6, label: "Resume & Submit", icon: Link2 },
];

export default function Apply() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [resume, setResume] = useState<File | null>(null);
  const [declaration, setDeclaration] = useState(false);

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId!),
    enabled: !!jobId,
  });

  const [educations, setEducations] = useState([
    { institution: "", degree: "", cgpa: "", graduationYear: "" },
  ]);

  const personalForm = useForm<PersonalData>({
    resolver: zodResolver(personalSchema),
    defaultValues: { fullName: "", email: "", phone: "" },
  });
  const addressForm = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { address: "", state: "", country: "India" },
  });
  const experienceForm = useForm<ExperienceData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { skills: "" },
  });
  const linksForm = useForm<LinksData>({
    resolver: zodResolver(linksSchema),
    defaultValues: { preferredWorkMode: "hybrid" },
  });
  const coverLetterForm = useForm<CoverLetterData>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: { coverLetter: "" },
  });

  const submitMutation = useMutation({
    mutationFn: async (payload: {
      job_id: string;
      cover_letter?: string;
      expected_salary?: string;
      preferred_work_mode?: string;
      resume?: File;
    }) => {
      if (payload.resume) {
        await uploadApplicationResume(payload.resume);
      }
      const { resume, ...applicationData } = payload;
      return createApplication(applicationData);
    },
    onSuccess: (data) => {
      showToast.success("Application submitted successfully!");
      setTrackingNumber(data.trackingNumber || "SS-" + Date.now().toString(36).toUpperCase());
      setSubmitted(true);
    },
    onError: () => {
      showToast.error("Failed to submit application. Please try again.");
    },
  });

  const [trackingNumber, setTrackingNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNext = async () => {
    let valid = false;
    switch (currentStep) {
      case 1: valid = await personalForm.trigger(); break;
      case 2: valid = await addressForm.trigger(); break;
      case 3: valid = true; break;
      case 4: valid = await experienceForm.trigger(); break;
      case 5: valid = await coverLetterForm.trigger(); break;
      case 6: valid = true; break;
    }
    if (valid && currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const handleSubmit = () => {
    if (!resume) {
      showToast.error("Please upload your resume");
      return;
    }
    if (!declaration) {
      showToast.error("Please accept the declaration");
      return;
    }

    const l = linksForm.getValues();
    const cl = coverLetterForm.getValues();

    submitMutation.mutate({
      job_id: jobId!,
      cover_letter: cl.coverLetter,
      expected_salary: l.expectedSalary || undefined,
      preferred_work_mode: l.preferredWorkMode || undefined,
      resume,
    });
  };

  if (submitted) {
    return (
      <main className="pt-20 lg:pt-24 section-padding">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <div className="w-20 h-20 rounded-full bg-success-500 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-white" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Application Submitted!</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Thank you for applying{job ? ` for ${job.title}` : ""}. We will review your application and get back to you soon.
            </p>
            <div className="glass-card p-4 rounded-xl mb-6">
              <p className="text-sm text-slate-500 mb-1">Your Tracking Number</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-bold text-primary-500">{trackingNumber}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(trackingNumber);
                    showToast.success("Copied!");
                  }}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded"
                >
                  <Copy className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>
            <Button onClick={() => navigate("/candidate/applications")} variant="primary">
              Track Application
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  if (jobLoading) {
    return (
      <main className="pt-20 lg:pt-24 section-padding">
        <div className="max-w-3xl mx-auto text-center py-16">
          <Loader2 className="h-8 w-8 text-primary-500 animate-spin mx-auto" />
          <p className="text-slate-500 mt-4">Loading job details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 lg:pt-24 section-padding">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center">
            Job Application
          </h1>
          {job && (
            <p className="text-primary-500 font-medium text-center mb-2">
              Applying for: {job.title}
            </p>
          )}
          <p className="text-slate-500 text-center mb-8">Complete all steps to submit your application</p>

          <ProgressBar value={currentStep} max={6} showLabel className="mb-8" />

          <div className="flex justify-between mb-8 overflow-x-auto pb-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "flex flex-col items-center gap-1 min-w-[60px]",
                  currentStep >= step.id ? "text-primary-500" : "text-slate-400"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    currentStep >= step.id
                      ? "bg-primary-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.label}</span>
              </div>
            ))}
          </div>

          <Card glass hover={false} className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {currentStep === 1 && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                      Personal Information
                    </h2>
                    <Input
                      label="Full Name *"
                      {...personalForm.register("fullName")}
                      error={personalForm.formState.errors.fullName?.message}
                      placeholder="Enter your full name"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Email *"
                        type="email"
                        {...personalForm.register("email")}
                        error={personalForm.formState.errors.email?.message}
                        placeholder="your@email.com"
                      />
                      <Input
                        label="Phone *"
                        {...personalForm.register("phone")}
                        error={personalForm.formState.errors.phone?.message}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Date of Birth"
                        type="date"
                        {...personalForm.register("dateOfBirth")}
                      />
                      <Select
                        label="Gender"
                        {...personalForm.register("gender")}
                        options={[
                          { value: "", label: "Select" },
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                          { value: "other", label: "Other" },
                          { value: "prefer_not_to_say", label: "Prefer not to say" },
                        ]}
                      />
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                      Address Details
                    </h2>
                    <Input
                      label="Address *"
                      {...addressForm.register("address")}
                      error={addressForm.formState.errors.address?.message}
                      placeholder="Street address"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="State *"
                        {...addressForm.register("state")}
                        error={addressForm.formState.errors.state?.message}
                        placeholder="Tamil Nadu"
                      />
                      <Input
                        label="Country *"
                        {...addressForm.register("country")}
                        error={addressForm.formState.errors.country?.message}
                        placeholder="India"
                      />
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                      Education
                    </h2>
                    {educations.map((edu, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 mb-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Education #{idx + 1}
                          </span>
                          {educations.length > 1 && (
                            <button
                              onClick={() => setEducations(educations.filter((_, i) => i !== idx))}
                              className="text-danger-500 hover:text-danger-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <Input
                          label="Institution *"
                          value={edu.institution}
                          onChange={(e) => {
                            const n = [...educations];
                            n[idx].institution = e.target.value;
                            setEducations(n);
                          }}
                          placeholder="College / University name"
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            label="Degree *"
                            value={edu.degree}
                            onChange={(e) => {
                              const n = [...educations];
                              n[idx].degree = e.target.value;
                              setEducations(n);
                            }}
                            placeholder="B.Tech, BCA, etc."
                          />
                          <Input
                            label="CGPA / Percentage"
                            value={edu.cgpa}
                            onChange={(e) => {
                              const n = [...educations];
                              n[idx].cgpa = e.target.value;
                              setEducations(n);
                            }}
                            placeholder="8.5 or 85%"
                          />
                        </div>
                        <Input
                          label="Graduation Year *"
                          value={edu.graduationYear}
                          onChange={(e) => {
                            const n = [...educations];
                            n[idx].graduationYear = e.target.value;
                            setEducations(n);
                          }}
                          placeholder="2024"
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Plus className="h-4 w-4" />}
                      onClick={() =>
                        setEducations([
                          ...educations,
                          { institution: "", degree: "", cgpa: "", graduationYear: "" },
                        ])
                      }
                    >
                      Add Education
                    </Button>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                      Experience & Skills
                    </h2>
                    <Input
                      label="Skills * (comma separated)"
                      {...experienceForm.register("skills")}
                      error={experienceForm.formState.errors.skills?.message}
                      placeholder="React, Python, Node.js, SQL"
                    />
                    <Input
                      label="Years of Experience"
                      {...experienceForm.register("yearsOfExperience")}
                      placeholder="2"
                      type="number"
                    />
                    <Input
                      label="Achievements"
                      {...experienceForm.register("achievements")}
                      placeholder="Awards, certifications, hackathons..."
                    />
                    <Input
                      label="Internships"
                      {...experienceForm.register("internships")}
                      placeholder="Previous internship details"
                    />
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                      Cover Letter
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Tell us why you're a great fit for this role{job ? ` at ${job.title}` : ""}.
                    </p>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Cover Letter *
                      </label>
                      <textarea
                        {...coverLetterForm.register("coverLetter")}
                        rows={8}
                        className={cn(
                          "w-full rounded-xl border bg-white dark:bg-white/5 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors",
                          coverLetterForm.formState.errors.coverLetter
                            ? "border-danger-400"
                            : "border-slate-300 dark:border-slate-700"
                        )}
                        placeholder="Write a compelling cover letter explaining your interest, relevant experience, and what you bring to the team..."
                      />
                      {coverLetterForm.formState.errors.coverLetter && (
                        <p className="mt-1.5 text-xs text-danger-500">
                          {coverLetterForm.formState.errors.coverLetter.message}
                        </p>
                      )}
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                        Links & Preferences
                      </h3>
                      <p className="text-xs text-slate-400 mb-3">
                        Optional — add your professional profiles
                      </p>
                      <div className="space-y-3">
                        <Input
                          label="GitHub URL"
                          {...linksForm.register("githubUrl")}
                          error={linksForm.formState.errors.githubUrl?.message}
                          placeholder="https://github.com/username"
                        />
                        <Input
                          label="LinkedIn URL"
                          {...linksForm.register("linkedinUrl")}
                          error={linksForm.formState.errors.linkedinUrl?.message}
                          placeholder="https://linkedin.com/in/username"
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            label="Expected Salary (₹/year)"
                            {...linksForm.register("expectedSalary")}
                            placeholder="500000"
                            type="number"
                          />
                          <Select
                            label="Preferred Work Mode"
                            {...linksForm.register("preferredWorkMode")}
                            options={[
                              { value: "remote", label: "Remote" },
                              { value: "onsite", label: "On-site" },
                              { value: "hybrid", label: "Hybrid" },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 6 && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                      Resume & Declaration
                    </h2>
                    <FileUpload
                      label="Upload Resume *"
                      currentFile={resume}
                      onFileSelect={setResume}
                      onClear={() => setResume(null)}
                      error={!resume ? "" : undefined}
                    />

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 mt-4">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        Declaration
                      </h3>
                      <p className="text-xs text-slate-500 mb-3">
                        I hereby declare that all the information provided above is true and correct to
                        the best of my knowledge. I understand that providing false information may
                        result in disqualification.
                      </p>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={declaration}
                          onChange={(e) => setDeclaration(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          I agree to the declaration
                        </span>
                      </label>
                    </div>

                    {job && (
                      <div className="p-4 rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10 mt-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                          Application Summary
                        </h3>
                        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          <p><span className="font-medium">Position:</span> {job.title}</p>
                          <p><span className="font-medium">Department:</span> {job.department || "N/A"}</p>
                          <p><span className="font-medium">Name:</span> {personalForm.watch("fullName") || "—"}</p>
                          <p><span className="font-medium">Email:</span> {personalForm.watch("email") || "—"}</p>
                          {resume && <p><span className="font-medium">Resume:</span> {resume.name}</p>}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
                icon={<ArrowLeft className="h-4 w-4" />}
              >
                Previous
              </Button>
              {currentStep < 6 ? (
                <Button onClick={handleNext} icon={<ArrowRight className="h-4 w-4" />}>
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  icon={submitMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
