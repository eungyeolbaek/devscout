import type { JobPosting } from '../adapters/types.js';
import { searchConfig } from '../config/search-config.js';

export function filterByKeyword(jobs: JobPosting[]): JobPosting[] {
  const { include, exclude } = searchConfig.keywords;

  return jobs.filter((job) => {
    const matchesInclude = include.some((keyword) => job.title.includes(keyword));
    const matchesExclude = exclude.some((keyword) => job.title.includes(keyword));
    return matchesInclude && !matchesExclude;
  });
}
