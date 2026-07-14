import type { Site } from '@prisma/client';
import type { JobPosting } from '../adapters/types.js';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DEADLINE_WARNING_DAYS = 14;

async function sendDiscordMessage(content: string): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('DISCORD_WEBHOOK_URL이 설정되지 않았습니다.');
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    throw new Error(`Discord 알림 전송 실패: ${res.status}`);
  }
}

function formatDeadline(deadlineAt: Date | null): string | null {
  if (!deadlineAt) return null;

  const daysLeft = Math.ceil((deadlineAt.getTime() - Date.now()) / MS_PER_DAY);
  if (daysLeft < 0 || daysLeft > DEADLINE_WARNING_DAYS) return null;
  return `마감 D-${daysLeft}`;
}

function formatJobMessage(job: JobPosting): string {
  const tag = job.isNewGradHiring ? '[신입공채] ' : '';
  const deadline = formatDeadline(job.deadlineAt);
  const deadlineSuffix = deadline ? ` (${deadline})` : '';
  const companyLine = job.location ? `${job.company}, ${job.location}` : job.company;

  return `## ${tag}${job.title}${deadlineSuffix}\n### ${companyLine}\n${job.url}`;
}

export async function notifyNewJobs(jobs: JobPosting[]): Promise<void> {
  for (const job of jobs) {
    await sendDiscordMessage(formatJobMessage(job));
  }
}

export async function notifyCrawlFailure(site: Site, message: string): Promise<void> {
  await sendDiscordMessage(`⚠️ ${site} 사이트 파싱 실패\n${message}`);
}
