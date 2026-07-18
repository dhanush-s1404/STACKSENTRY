import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Link2,
  Save,
  ExternalLink,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import ProgressBar from "@/components/ui/ProgressBar";
import { showToast } from "@/components/ui/Toast";
import * as profileService from "@/lib/services/profileService";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  institution: z.string().optional().or(z.literal("")),
  degree: z.string().optional().or(z.literal("")),
  cgpa: z.string().optional().or(z.literal("")),
  graduationYear: z.string().optional().or(z.literal("")),
  skills: z.string().optional().or(z.literal("")),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  portfolio: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function computeProgress(data: ProfileFormData): number {
  const required = [data.fullName, data.email, data.phone];
  const optional = [
    data.address,
    data.city,
    data.state,
    data.institution,
    data.degree,
    data.skills,
  ];
  const requiredScore = required.filter(Boolean).length / required.length;
  const optionalScore = optional.filter(Boolean).length / optional.length;
  return Math.round(60 * requiredScore + 40 * optionalScore);
}

export default function CandidateProfile() {
  const queryClient = useQueryClient();
  const [resume, setResume] = useState<File | null>(null);
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState<string | null>(null);

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: profileService.getProfile,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? {
          fullName: profile.fullName ?? "",
          email: profile.email ?? "",
          phone: profile.phone ?? "",
          address: "",
          city: "",
          state: "",
          institution: "",
          degree: "",
          cgpa: "",
          graduationYear: "",
          skills: "",
          github: "",
          linkedin: "",
          portfolio: "",
        }
      : undefined,
  });

  const watchedValues = watch();
  const progressValue = computeProgress(watchedValues);

  const updateMutation = useMutation({
    mutationFn: (data: { full_name?: string; phone?: string }) =>
      profileService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["profile"], updatedUser);
      showToast.success("Profile updated successfully!");
    },
    onError: () => {
      showToast.error("Failed to update profile. Please try again.");
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => profileService.uploadResume(file),
    onSuccess: (result) => {
      setUploadedResumeUrl(result.url);
      showToast.success(`Resume "${result.filename}" uploaded successfully!`);
    },
    onError: () => {
      showToast.error("Failed to upload resume. Please try again.");
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(
      {
        full_name: data.fullName,
        phone: data.phone || undefined,
      },
      {
        onSuccess: () => {
          reset(data);
        },
      }
    );
  };

  const handleResumeUpload = () => {
    if (!resume) return;
    uploadMutation.mutate(resume);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mt-2" />
          </div>
        </motion.div>
        <ProgressBar value={0} showLabel />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card glass hover={false}>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                ))}
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card glass hover={false}>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Card glass hover={false}>
          <div className="text-center py-12">
            <p className="text-danger-500 dark:text-danger-400 font-medium">
              Failed to load profile. Please try refreshing the page.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information</p>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          loading={updateMutation.isPending}
          icon={<Save className="h-4 w-4" />}
          disabled={!isDirty}
        >
          Save Changes
        </Button>
      </motion.div>

      <ProgressBar value={progressValue} showLabel />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card glass hover={false}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-primary-500" /> Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                error={errors.fullName?.message}
                icon={<User className="h-4 w-4" />}
                {...register("fullName")}
              />
              <Input
                label="Email"
                error={errors.email?.message}
                icon={<Mail className="h-4 w-4" />}
                type="email"
                {...register("email")}
              />
              <Input
                label="Phone"
                error={errors.phone?.message}
                icon={<Phone className="h-4 w-4" />}
                {...register("phone")}
              />
              <Input
                label="Address"
                error={errors.address?.message}
                icon={<MapPin className="h-4 w-4" />}
                {...register("address")}
              />
              <Input label="City" error={errors.city?.message} {...register("city")} />
              <Input label="State" error={errors.state?.message} {...register("state")} />
            </div>
          </Card>

          <Card glass hover={false}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary-500" /> Education
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Institution" error={errors.institution?.message} {...register("institution")} />
              <Input label="Degree" error={errors.degree?.message} {...register("degree")} />
              <Input label="CGPA" error={errors.cgpa?.message} {...register("cgpa")} />
              <Input
                label="Graduation Year"
                error={errors.graduationYear?.message}
                {...register("graduationYear")}
              />
            </div>
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 italic">
              Education fields require a dedicated applicant profile endpoint. Currently not persisted to the backend.
            </p>
          </Card>

          <Card glass hover={false}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary-500" /> Skills
            </h3>
            <Input
              label="Skills (comma separated)"
              error={errors.skills?.message}
              {...register("skills")}
            />
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 italic">
              Skills require a dedicated applicant profile endpoint. Currently not persisted to the backend.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card glass hover={false}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary-500" /> Links
            </h3>
            <div className="space-y-4">
              <Input
                label="GitHub"
                error={errors.github?.message}
                placeholder="https://github.com/..."
                {...register("github")}
              />
              <Input
                label="LinkedIn"
                error={errors.linkedin?.message}
                placeholder="https://linkedin.com/..."
                {...register("linkedin")}
              />
              <Input
                label="Portfolio"
                error={errors.portfolio?.message}
                placeholder="https://..."
                {...register("portfolio")}
              />
            </div>
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 italic">
              Link fields require a dedicated applicant profile endpoint. Currently not persisted to the backend.
            </p>
          </Card>

          <Card glass hover={false}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Resume</h3>
            {uploadedResumeUrl && (
              <a
                href={uploadedResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600 mb-3 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View current resume
              </a>
            )}
            <FileUpload
              label="Upload Resume"
              currentFile={resume}
              onFileSelect={setResume}
              onClear={() => setResume(null)}
            />
            {resume && (
              <Button
                onClick={handleResumeUpload}
                loading={uploadMutation.isPending}
                variant="secondary"
                size="sm"
                className="mt-3 w-full"
              >
                Upload Resume
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
