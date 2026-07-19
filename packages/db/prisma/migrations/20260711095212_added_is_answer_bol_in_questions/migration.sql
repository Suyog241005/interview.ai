-- AlterTable
ALTER TABLE "CompanyQuestion" ADD COLUMN     "isAnswered" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PracticeQuestion" ADD COLUMN     "isAnswered" BOOLEAN NOT NULL DEFAULT false;
