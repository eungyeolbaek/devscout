import { Site } from "@prisma/client";
import type { JobPosting, SiteAdapter } from "./types.js";

// 점핏 API 원본 응답 형태 (점핏 쪽이 붙인 필드명 그대로, 우리 표준 이름이 아님)
interface JumpitPositionsResponse {
  result: {
    positions: Array<{
      id: number;
      title: string; // 공고 제목
      companyName: string;
      closedAt: string | null; // 마감일
    }>;
  };
}

const JUMPIT_POSITIONS_API = "https://jumpit-api.saramin.co.kr/api/positions";
const JUMPIT_POSITION_DETAIL_URL = "https://jumpit.saramin.co.kr/position";

const SEARCH_PARAMS = {
  jobCategory: "1", // 서버/백엔드 개발자
  career: "0", // 신입
  locationTag: "101000", // 서울 전체
  sort: "reg_dt",
} as const;

function looksLikeNewGradHiring(title: string): boolean {
  return /공채/.test(title);
}

export const jumpitAdapter: SiteAdapter = {
  site: Site.JUMPIT,

  async fetchJobs(): Promise<JobPosting[]> {
    const url = new URL(JUMPIT_POSITIONS_API);
    url.searchParams.set("jobCategory", SEARCH_PARAMS.jobCategory);
    url.searchParams.set("career", SEARCH_PARAMS.career);
    url.searchParams.set("locationTag", SEARCH_PARAMS.locationTag);
    url.searchParams.set("sort", SEARCH_PARAMS.sort);
    url.searchParams.set("page", "1");

    const res = await fetch(url, {
      headers: { "User-Agent": "DevScout/0.1 (personal job alert bot)" },
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
      isNewGradHiring: looksLikeNewGradHiring(position.title),
      postedAt: null,
      deadlineAt: position.closedAt ? new Date(position.closedAt) : null,
    }));
  },
};
