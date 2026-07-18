export type UserRole = "candidate" | "hr" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "shortlisted"
  | "interview_scheduled"
  | "interview_completed"
  | "offer_sent"
  | "hired"
  | "rejected"
  | "withdrawn";

export type JobType = "full_time" | "part_time" | "contract" | "internship";

export type ExperienceLevel = "entry" | "mid" | "senior" | "lead";

export type WorkMode = "remote" | "hybrid" | "onsite";

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  cgpa?: number;
  graduationYear?: number;
  description?: string;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  isCurrent: boolean;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface Skill {
  id?: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface ApplicantProfile {
  id: string;
  userId: string;
  user?: User;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  state?: string;
  country?: string;
  college?: string;
  degree?: string;
  cgpa?: number;
  graduationYear?: number;
  experienceYears?: number;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeFileId?: string;
  resumeUrl?: string;
  bio?: string;
  expectedSalary?: string;
  preferredWorkMode?: WorkMode;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  department?: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  location: string;
  isRemote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  applicationDeadline?: string;
  positionsAvailable: number;
  positionsFilled: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  trackingNumber: string;
  applicantId: string;
  jobId: string;
  status: ApplicationStatus;
  coverLetter?: string;
  expectedSalary?: string;
  preferredWorkMode?: string;
  resumeScore?: number;
  hrNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  statusUpdatedAt: string;
  jobTitle?: string;
  applicantName?: string;
  job?: Job;
  user?: User;
}

export interface FileItem {
  id: string;
  filename: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  uploadType: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  interviewerId: string;
  interviewType: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  meetingLink?: string;
  location?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  applicantName?: string;
  jobTitle?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface DashboardStats {
  total_applications: number;
  status_counts: Record<string, number>;
  active_jobs: number;
  recent_applications: number;
  users?: {
    total: number;
    candidates: number;
    hr: number;
    admins: number;
    active: number;
  };
  jobs?: {
    total_jobs: number;
    active_jobs: number;
    inactive_jobs: number;
    job_type_counts: Record<string, number>;
  };
  interviews?: {
    total: number;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
