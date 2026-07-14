import type { Site } from '@prisma/client';

export interface JobPosting {
  site: Site;
  title: string;
  company: string;
  url: string;
  location: string | null;
  isNewGradHiring: boolean;
  postedAt: Date | null;
  deadlineAt: Date | null;
}

export interface SiteAdapter {
  site: Site;
  fetchJobs(): Promise<JobPosting[]>;
}
