import { Site } from '@prisma/client';
import type { JobPosting, SiteAdapter } from './types.js';
import { searchConfig } from '../config/search-config.js';

// 원티드 API 원본 응답 형태 (원티드 쪽이 붙인 필드명 그대로, 우리 표준 이름이 아님)
interface WantedJobsResponse {
  data: Array<{
    id: number;
    position: string; // 공고 제목 (원티드 API가 이렇게 부름 — "직무명"이라는 뜻으로 쓴 필드, 우리 쪽 title에 매핑됨)
    company: { name: string };
    due_time: string | null; // 마감일 (대부분 null — 원티드는 상시채용 위주)
    address?: { location: string; district: string }; // location: 시/도, district: 구/시
  }>;
}

const WANTED_JOBS_API = 'https://www.wanted.co.kr/api/v4/jobs';
const WANTED_JOB_DETAIL_URL = 'https://www.wanted.co.kr/wd';

function looksLikeNewGradHiring(title: string): boolean {
  return /공채/.test(title);
}

export const wantedAdapter: SiteAdapter = {
  site: Site.WANTED,

  async fetchJobs(): Promise<JobPosting[]> {
    const url = new URL(WANTED_JOBS_API);
    url.searchParams.set('country', 'kr');
    url.searchParams.set('job_sort', 'job.latest_order');
    url.searchParams.set('years', searchConfig.wanted.years);
    url.searchParams.set('locations', searchConfig.wanted.locations);
    url.searchParams.set('limit', '100');

    // GitHub Actions 러너의 클라우드 IP가 원티드 WAF에서 종종 403으로 차단됨(2026-07-16 확인,
    // 로컬 IP에서는 동일 요청이 200으로 정상 응답). User-Agent를 자체 식별용 문자열 대신 실제
    // 브라우저처럼 보이게 바꾸고 Referer/Accept 헤더를 추가해 봇 차단 룰을 우회 시도.
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        Referer: 'https://www.wanted.co.kr/wdlist',
      },
    });

    if (!res.ok) {
      throw new Error(`원티드 API 응답 오류: ${res.status}`);
    }

    const body = (await res.json()) as WantedJobsResponse;

    return body.data.map((job) => ({
      site: Site.WANTED,
      title: job.position,
      company: job.company.name,
      url: `${WANTED_JOB_DETAIL_URL}/${job.id}`,
      location: job.address ? `${job.address.location} ${job.address.district}` : null,
      isNewGradHiring: looksLikeNewGradHiring(job.position),
      postedAt: null,
      deadlineAt: job.due_time ? new Date(job.due_time) : null,
    }));
  },
};
