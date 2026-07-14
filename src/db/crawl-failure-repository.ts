import type { Site } from '@prisma/client';
import { prisma } from './client.js';

export async function logCrawlFailure(site: Site, message: string): Promise<void> {
  await prisma.crawlFailure.create({ data: { site, message } });
}
