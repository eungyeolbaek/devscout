// 나중에 주변 사람에게 넘길 때는 이 파일 값만 바꾸면 됨 (어댑터 코드는 건드리지 않음)
// 사이트마다 API 파라미터 포맷이 달라서 공통 키로 억지로 묶지 않고, 사이트별로 각자 원본 값을 그대로 관리한다.

export const searchConfig = {
  wanted: {
    years: "0", // 신입
    locations: "seoul.all", // 서울 전체
  },
  jumpit: {
    jobCategory: "1", // 서버/백엔드 개발자
    career: "0", // 신입
    locationTag: "101000", // 서울 전체
  },
  // 카테고리 파라미터가 없는 사이트(원티드 등)에서 제목 텍스트로 걸러낼 때 사용 (filter/keyword-filter.ts에서 참조 예정)
  keywords: {
    include: ["백엔드", "서버", "Node.js", "NestJS"],
    exclude: [] as string[],
  },
} as const;
