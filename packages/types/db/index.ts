import type {
  User,
  Candidate,
  Company,
  Recruiter,
  Job,
  JobRecruiter,
  CompanyInterview,
  CompanyInterviewReport,
  InterviewConfig,
  CompanyQuestion,
  Invitation,
  PracticeInterview,
  Resume,
  PracticeQuestion,
  PracticeInterviewReport,
} from "@interview.ai/db/browser";

import {
  Difficulty,
  InterviewMode,
  InterviewStatus,
  JobStatus,
  InvitationStatus,
} from "@interview.ai/db/browser";

type PracticeInterviewWithQuestion = PracticeInterview & {
  questions: PracticeQuestion[];
};

type CompanyInterviewWithQuestion = CompanyInterview & {
  questions: CompanyQuestion[];
};

type UserWithCandidate = User & {
  candidate: Candidate;
};

export type {
  User,
  Candidate,
  Company,
  Recruiter,
  Job,
  JobRecruiter,
  CompanyInterview,
  CompanyInterviewReport,
  InterviewConfig,
  CompanyQuestion,
  Invitation,
  PracticeInterview,
  Resume,
  PracticeQuestion,
  PracticeInterviewReport,
  PracticeInterviewWithQuestion,
  CompanyInterviewWithQuestion,
  UserWithCandidate
};

export {
  Difficulty,
  InterviewMode,
  InterviewStatus,
  JobStatus,
  InvitationStatus,
};
