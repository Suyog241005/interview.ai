/*
  Warnings:

  - You are about to drop the `Interview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InterviewReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "InterviewReport" DROP CONSTRAINT "InterviewReport_interviewId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_interviewId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_interviewId_fkey";

-- DropTable
DROP TABLE "Interview";

-- DropTable
DROP TABLE "InterviewReport";

-- DropTable
DROP TABLE "Question";

-- DropEnum
DROP TYPE "InterviewType";

-- CreateTable
CREATE TABLE "CompanyInterview" (
    "id" TEXT NOT NULL,
    "status" "InterviewStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "candidateId" TEXT NOT NULL,
    "jobId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyInterview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyInterviewReport" (
    "id" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "summary" TEXT NOT NULL,
    "recommendation" TEXT,
    "interviewId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyInterviewReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyQuestion" (
    "id" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "timeLimitSeconds" INTEGER NOT NULL DEFAULT 60,
    "userAnswer" TEXT,
    "aiFeedback" TEXT,
    "questionScore" INTEGER NOT NULL DEFAULT 0,
    "confidenceScore" INTEGER NOT NULL DEFAULT 0,
    "communicationScore" INTEGER NOT NULL DEFAULT 0,
    "correctnessScore" INTEGER NOT NULL DEFAULT 0,
    "durationSeconds" INTEGER,
    "category" TEXT,
    "displayOrder" INTEGER NOT NULL,
    "interviewId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeInterview" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "interviewMode" "InterviewMode" NOT NULL,
    "experienceYears" INTEGER NOT NULL,
    "status" "InterviewStatus" NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "candidateId" TEXT NOT NULL,
    "resumeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeInterview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeQuestion" (
    "id" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "timeLimitSeconds" INTEGER NOT NULL DEFAULT 60,
    "userAnswer" TEXT,
    "aiFeedback" TEXT,
    "questionScore" INTEGER NOT NULL DEFAULT 0,
    "confidenceScore" INTEGER NOT NULL DEFAULT 0,
    "communicationScore" INTEGER NOT NULL DEFAULT 0,
    "correctnessScore" INTEGER NOT NULL DEFAULT 0,
    "durationSeconds" INTEGER,
    "category" TEXT,
    "displayOrder" INTEGER NOT NULL,
    "interviewId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeInterviewReport" (
    "id" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "summary" TEXT NOT NULL,
    "recommendation" TEXT,
    "interviewId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeInterviewReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompanyInterview_candidateId_idx" ON "CompanyInterview"("candidateId");

-- CreateIndex
CREATE INDEX "CompanyInterview_jobId_idx" ON "CompanyInterview"("jobId");

-- CreateIndex
CREATE INDEX "CompanyInterview_status_idx" ON "CompanyInterview"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyInterviewReport_interviewId_key" ON "CompanyInterviewReport"("interviewId");

-- CreateIndex
CREATE INDEX "CompanyQuestion_interviewId_idx" ON "CompanyQuestion"("interviewId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyQuestion_interviewId_displayOrder_key" ON "CompanyQuestion"("interviewId", "displayOrder");

-- CreateIndex
CREATE INDEX "PracticeInterview_candidateId_idx" ON "PracticeInterview"("candidateId");

-- CreateIndex
CREATE INDEX "PracticeInterview_status_idx" ON "PracticeInterview"("status");

-- CreateIndex
CREATE INDEX "PracticeQuestion_interviewId_idx" ON "PracticeQuestion"("interviewId");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeQuestion_interviewId_displayOrder_key" ON "PracticeQuestion"("interviewId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeInterviewReport_interviewId_key" ON "PracticeInterviewReport"("interviewId");

-- AddForeignKey
ALTER TABLE "CompanyInterview" ADD CONSTRAINT "CompanyInterview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyInterview" ADD CONSTRAINT "CompanyInterview_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyInterviewReport" ADD CONSTRAINT "CompanyInterviewReport_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "CompanyInterview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyQuestion" ADD CONSTRAINT "CompanyQuestion_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "CompanyInterview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "CompanyInterview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeInterview" ADD CONSTRAINT "PracticeInterview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeInterview" ADD CONSTRAINT "PracticeInterview_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeQuestion" ADD CONSTRAINT "PracticeQuestion_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "PracticeInterview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeInterviewReport" ADD CONSTRAINT "PracticeInterviewReport_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "PracticeInterview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
