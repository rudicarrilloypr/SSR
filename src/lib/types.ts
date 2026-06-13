export type UserRole = "registered" | "subscriber" | "admin";
export type PublicationStatus = "draft" | "published";
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";
export type DownloadContentType =
  | "sample"
  | "sample_pack"
  | "instrumental";

export interface SubscriptionPlan {
  id: string;
  name: "Initiate" | "Inner Circle" | "Archivist";
  slug: "initiate" | "inner-circle" | "archivist";
  description: string;
  priceMonthly: number;
  monthlySampleLimit: number | null;
  monthlyInstrumentalLimit: number | null;
  includesCourses: boolean;
  isActive: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  subscription?: UserSubscription;
  plan?: SubscriptionPlan;
}

export interface SamplePack {
  id: string;
  title: string;
  slug: string;
  description: string;
  genre: string;
  bpm: number | null;
  musicalKey: string | null;
  packType: string;
  tags: string[];
  coverUrl?: string;
  previewUrl?: string;
  filePath: string;
  status: PublicationStatus;
  sampleCount: number;
}

export interface Sample {
  id: string;
  samplePackId?: string;
  title: string;
  slug: string;
  genre: string;
  bpm: number | null;
  musicalKey: string | null;
  sampleType: string;
  tags: string[];
  durationSeconds: number;
  previewUrl?: string;
  filePath: string;
  status: PublicationStatus;
}

export interface Instrumental {
  id: string;
  title: string;
  slug: string;
  description: string;
  genre: string;
  bpm: number;
  musicalKey: string;
  mood: string;
  tags: string[];
  previewUrl?: string;
  filePath: string;
  license: string;
  price: number | null;
  status: PublicationStatus;
}

export interface CourseLesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  position: number;
  durationSeconds: number;
  videoUrl?: string;
  isPreview: boolean;
  status: PublicationStatus;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  position: number;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructor: string;
  coverUrl?: string;
  status: PublicationStatus;
  modules: CourseModule[];
}

export interface DownloadRecord {
  id: string;
  userId: string;
  contentType: DownloadContentType;
  contentId: string;
  title: string;
  createdAt: string;
}

export interface DownloadQuota {
  sampleLimit: number | null;
  instrumentalLimit: number | null;
  samplesUsed: number;
  instrumentalsUsed: number;
  samplesRemaining: number | null;
  instrumentalsRemaining: number | null;
}
