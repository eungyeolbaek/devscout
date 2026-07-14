import type { Site } from "@prisma/client";

export interface JobPosting {
  site: Site;
  title: string;
  company: string;
  url: string;
  isNewGradHiring: boolean;
  postedAt: Date | null;
}

export interface SiteAdapter {
  site: Site;
  fetchJobs(): Promise<JobPosting[]>;
}
