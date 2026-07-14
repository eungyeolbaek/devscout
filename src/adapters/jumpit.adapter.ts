import { Site } from '@prisma/client';
import type { JobPosting, SiteAdapter } from './types.js';
import { searchConfig } from '../config/search-config.js';

// 점핏 API 원본 응답 형태 (점핏 쪽이 붙인 필드명 그대로, 우리 표준 이름이 아님)
interface JumpitPositionsResponse {
  result: {
    positions: Array<{
      id: number;
      title: string;
      companyName: string;
      closedAt: string | null; // 마감일
      locations: string[]; // 이미 조합된 문자열, 예: ["서울 마포구"] (원티드처럼 location/district로 나뉘어 오지 않음)
    }>;
  };
}

const JUMPIT_POSITIONS_API = 'https://jumpit-api.saramin.co.kr/api/positions';
const JUMPIT_POSITION_DETAIL_URL = 'https://jumpit.saramin.co.kr/position';

function looksLikeNewGradHiring(title: string): boolean {
  return /공채/.test(title);
}

// 점핏 API는 jobCategory를 한 번에 여러 개 못 받아서(뒤 값이 무시됨), 카테고리별로 각각 호출한다.
async function fetchByCategory(jobCategory: string): Promise<JobPosting[]> {
  const url = new URL(JUMPIT_POSITIONS_API);
  url.searchParams.set('jobCategory', jobCategory);
  url.searchParams.set('career', searchConfig.jumpit.career);
  url.searchParams.set('locationTag', searchConfig.jumpit.locationTag);
  url.searchParams.set('sort', 'reg_dt');
  url.searchParams.set('page', '1');

  const res = await fetch(url, {
    headers: { 'User-Agent': 'DevScout/0.1 (personal job alert bot)' },
  });

  if (!res.ok) {
    throw new Error(`점핏 API 응답 오류: ${res.status}`);
  }

  const body = (await res.json()) as JumpitPositionsResponse;

  return body.result.positions.map((position) => ({
    site: Site.JUMPIT,
    title: position.title,
    company: position.companyName,
    url: `${JUMPIT_POSITION_DETAIL_URL}/${position.id}`,
    location: position.locations[0] ?? null,
    isNewGradHiring: looksLikeNewGradHiring(position.title),
    postedAt: null,
    deadlineAt: position.closedAt ? new Date(position.closedAt) : null,
  }));
}

export const jumpitAdapter: SiteAdapter = {
  site: Site.JUMPIT,

  async fetchJobs(): Promise<JobPosting[]> {
    const results = await Promise.all(searchConfig.jumpit.jobCategories.map(fetchByCategory));
    const merged = results.flat();

    // 한 공고가 여러 카테고리에 동시에 속할 수 있어(예: "서버/백엔드" + "빅데이터") 두 호출 결과에 중복으로 나올 수 있다.
    const uniqueByUrl = new Map(merged.map((job) => [job.url, job]));
    return [...uniqueByUrl.values()];
  },
};
