import { existsSync } from 'node:fs';
import { runPipeline } from './pipeline.js';

// 로컬 개발 환경(.env 파일)에서만 로드. GitHub Actions는 Secrets를 통해
// 환경변수를 이미 주입해주므로 .env 파일이 없고, 로드할 필요도 없음.
if (existsSync('.env')) {
  process.loadEnvFile();
}
runPipeline();
