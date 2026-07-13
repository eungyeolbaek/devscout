-- CreateEnum
CREATE TYPE "Site" AS ENUM ('WANTED', 'JUMPIT', 'SARAMIN', 'JOBKOREA', 'RALLIT', 'ROCKETPUNCH', 'CATCH', 'JASOSEOL');

-- CreateTable
CREATE TABLE "JobPosting" (
    "id" TEXT NOT NULL,
    "site" "Site" NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isNewGradHiring" BOOLEAN NOT NULL DEFAULT false,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlFailure" (
    "id" TEXT NOT NULL,
    "site" "Site" NOT NULL,
    "message" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrawlFailure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobPosting_url_key" ON "JobPosting"("url");

-- CreateIndex
CREATE INDEX "JobPosting_site_idx" ON "JobPosting"("site");
