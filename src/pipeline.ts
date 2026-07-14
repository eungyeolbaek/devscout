import { wantedAdapter } from './adapters/wanted.adapter.js';
import { jumpitAdapter } from './adapters/jumpit.adapter.js';
import type { SiteAdapter } from './adapters/types.js';
import { filterByKeyword } from './filter/keyword-filter.js';
import { saveNewJobs } from './db/job-repository.js';
import { runAdapter } from './crawler/run-adapter.js';
import { notifyNewJobs } from './notify/discord.js';

const adapters: SiteAdapter[] = [wantedAdapter, jumpitAdapter];

export async function runPipeline(): Promise<void> {
  for (const adapter of adapters) {
    const raw = await runAdapter(adapter);
    const filtered = filterByKeyword(raw);
    const saved = await saveNewJobs(filtered);

    console.log(`[${adapter.site}] 원본 ${raw.length}건 → 필터 후 ${filtered.length}건 → 신규 저장 ${saved.length}건`);

    await notifyNewJobs(saved);
  }
}
