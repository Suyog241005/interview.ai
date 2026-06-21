/*
  Warnings:

  - You are about to drop the column `type` on the `Interview` table. All the data in the column will be lost.
  - Added the required column `interviewMode` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InterviewMode" AS ENUM ('TECHNICAL', 'HR');

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "type",
ADD COLUMN     "interviewMode" "InterviewMode" NOT NULL;

-- DropEnum
DROP TYPE "InterviewType";
