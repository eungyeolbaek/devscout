import type { JobPosting, SiteAdapter } from '../adapters/types.js';
import { logCrawlFailure } from '../db/crawl-failure-repository.js';
import { notifyCrawlFailure } from '../notify/discord.js';

export async function runAdapter(adapter: SiteAdapter): Promise<JobPosting[]> {
  try {
    return await adapter.fetchJobs();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await logCrawlFailure(adapter.site, message);
    await notifyCrawlFailure(adapter.site, message);
    return [];
  }
}
