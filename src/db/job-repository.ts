import type { JobPosting } from '../adapters/types.js';
import { prisma } from './client.js';

export async function saveNewJobs(jobs: JobPosting[]): Promise<JobPosting[]> {
  if (jobs.length === 0) return [];

  const existing = await prisma.jobPosting.findMany({
    where: { url: { in: jobs.map((job) => job.url) } },
    select: { url: true },
  });
  const existingUrls = new Set(existing.map((row) => row.url));

  const newJobs = jobs.filter((job) => !existingUrls.has(job.url));
  if (newJobs.length === 0) return [];

  await prisma.jobPosting.createMany({ data: newJobs, skipDuplicates: true });

  return newJobs;
}
