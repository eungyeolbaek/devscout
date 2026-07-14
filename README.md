# 🔍 DevScout

원티드·점핏 등 채용 사이트에서 신입 백엔드/Node.js 공고를 자동으로 크롤링해서 Discord로 알려주는 개인용 봇입니다.

매일 여러 채용 사이트를 직접 돌아다니며 확인하는 시간을 없애는 게 목적이며, GitHub Actions로 하루 3번(KST 00:10 / 09:00 / 18:00) 자동 실행됩니다. 🤖⏰

## ⚙️ 동작 방식

```
🌐 사이트 어댑터 (원티드/점핏 API 직접 호출)
  → 🔎 키워드 필터링 (백엔드/서버/Node.js 등)
  → 🔁 중복 체크 (이미 저장된 공고는 스킵)
  → 💾 신규 공고만 DB 저장 → 📣 Discord 알림
  → ⚠️ (실패 시) CrawlFailure 기록 + Discord 알림
```

사이트별 크롤러는 `site-adapter` 패턴으로 분리되어 있어 새 사이트를 추가하기 쉽습니다. 원티드/점핏은 각 사이트의 (비공식) JSON API를 직접 호출하며, API가 없는 사이트는 Playwright로 대응할 수 있습니다.

## 🧱 스택

- 🟢 Node.js, TypeScript, pnpm
- 🐘 Prisma + PostgreSQL
- 💬 Discord Webhook
- ⏱️ GitHub Actions (스케줄 실행)

## 🚀 로컬 실행

```bash
pnpm install

# 로컬 Postgres 실행 (5433 포트)
docker compose up -d

cp .env.example .env
# .env에 DATABASE_URL, DISCORD_WEBHOOK_URL 채우기

pnpm prisma migrate dev
pnpm crawl
```

## 📜 주요 스크립트

| 명령어 | 설명 |
|---|---|
| `pnpm crawl` | 🏃 전체 파이프라인 실행 (크롤링 → 필터 → 저장 → 알림) |
| `pnpm prisma:studio` | 🗂️ DB 내용을 웹 UI로 확인 |
| `pnpm typecheck` | ✅ TypeScript 타입 체크 |
| `pnpm lint` / `pnpm format` | 🧹 ESLint / Prettier |

## 📚 문서

- [`docs/기획.md`](docs/기획.md): 설계 결정 기록 (스키마, 아키텍처, 사이트별 API 조사 결과 등)
