# DevScout 진행 상황

## 현재 단계
설계 논의 단계. **아직 코드/프로젝트 파일은 하나도 생성하지 않음** — git 저장소도 아직 초기화 안 됨.

## 완료된 것
- 기획서(`채용공고_알림봇_기획.md`) 검토
- 프로젝트 구조안 제안 (site-adapter 패턴 기반)
- Prisma 스키마 설계 확정 (`JobPosting`, `CrawlFailure` — 상세는 기획서 7.3 참고)
- 스택 확정: pnpm, PostgreSQL(Docker Compose), 프론트 없음, CLI 진입점 구조
- GitHub Actions cron 스케줄 확정 (KST 00:10/09:00/18:00)
- 다중 사용자 확장 로드맵 논의 (아주 나중 과제로 보류, 기획서 8장)
- 작업 규칙 문서화: `CLAUDE.md`(작업 규칙), `PROGRESS.md`(이 파일) 생성

## 다음 할 일
1. GitHub에 `devscout` 레포 생성 → 로컬 폴더를 연결 (git init 또는 clone, remote 설정)
2. 프로젝트 스캐폴딩: `package.json`(pnpm), `tsconfig.json`, `docker-compose.yml`(Postgres), Prisma 스키마 파일, 폴더 구조 생성
3. 원티드 site-adapter 구현 (Playwright)
4. 점핏 site-adapter 구현
5. 필터링(`filter/keyword-filter.ts`) + 중복 체크(`db/job-repository.ts`) 구현
6. Discord Webhook 알림 연동 (신규 공고 알림 + 파싱 실패 알림)
7. CLI 진입점(`pnpm crawl`) + pipeline 오케스트레이션 완성, 로컬 end-to-end 테스트
8. GitHub Actions workflow 작성, 스케줄 등록

## 결정된 것 중 재확인 불필요 (다시 묻지 말 것)
- SQLite 아니고 PostgreSQL + Docker
- pnpm 사용
- location/careerLevel은 DB 컬럼 아님, 필터링 로직에서만 사용
- `isNewGradHiring` 필드명 확정
- `postedAt`은 non-null
