/*
  Warnings:

  - You are about to alter the column `score` on the `Interview` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `questionScore` on the `Question` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `experience` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Made the column `score` on table `Interview` required. This step will fail if there are existing NULL values in that column.
  - Made the column `questionScore` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "experience" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ALTER COLUMN "score" SET NOT NULL,
ALTER COLUMN "score" SET DEFAULT 0,
ALTER COLUMN "score" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "communicationScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "confidenceScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "correctnessScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "timeLimitSeconds" INTEGER NOT NULL DEFAULT 60,
ALTER COLUMN "questionScore" SET NOT NULL,
ALTER COLUMN "questionScore" SET DEFAULT 0,
ALTER COLUMN "questionScore" SET DATA TYPE INTEGER;
