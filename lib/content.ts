export const SUBJECTS = ["Physics", "Chemistry", "Biology", "Math"] as const;
export const GRADES = [
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
] as const;
export const LEVELS = ["Intro", "Core", "Advanced"] as const;
export const CONTENT_TYPES = ["simulation", "game"] as const;

export type Subject = (typeof SUBJECTS)[number];
export type Grade = (typeof GRADES)[number];
export type Level = (typeof LEVELS)[number];
export type ContentType = (typeof CONTENT_TYPES)[number];

export const subjectOptions = ["All", ...SUBJECTS] as const;
export const levelOptions = ["All", ...LEVELS] as const;
export const gradeOptions = ["All", ...GRADES] as const;

export type PublicContent = {
  _id: string;
  _creationTime: number;
  slug: string;
  type: ContentType;
  title: string;
  subject: Subject;
  grade: string;
  chapter: string;
  level: Level;
  minutes: number;
  concepts: string[];
  svgCode: string;
  code: string;
  prompt?: string;
  published: boolean;
  featured: boolean;
  createdAt: number;
  updatedAt: number;
};

export type LeaderboardRow = {
  _id: string;
  contentId: string;
  userId: string;
  userName: string;
  score: number;
  createdAt: number;
};
