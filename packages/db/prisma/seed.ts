/**
 * Dummy data for local development and demos.
 *
 *   bun run db:seed          reset seed rows, then insert them again (idempotent)
 *   bun run db:seed --clear  only remove seed rows
 *
 * Every seed user signs in with email + password through Better Auth (SEED_PASSWORD below).
 * Only rows owned by the SEED_EMAILS users are touched; other data is left alone.
 */
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { prisma } from "../index";
import { Difficulty } from "../generated/prisma/enums";

export const SEED_PASSWORD = "Password123!";
const DAY = 24 * 60 * 60 * 1000;
const COMPANY_NAME = "Acme Labs";
const CANDIDATE_INVITE_TOKEN = "SEEDDEMOINVITE01"; // 16 chars, same shape as generateInviteCode(16)
const EXPIRED_INVITE_TOKEN = "SEEDEXPIREDINV01";
const RECRUITER_INVITE_TOKEN = "SEEDRECRUIT1"; // 12 chars, same shape as generateInviteCode()

const USERS = {
  candidate: { name: "Aarav Sharma", email: "candidate@example.com" },
  candidate2: { name: "Meera Iyer", email: "candidate2@example.com" },
  owner: { name: "Priya Nair", email: "recruiter@example.com" },
  recruiter: { name: "Rohan Mehta", email: "recruiter2@example.com" },
} as const;
const SEED_EMAILS = Object.values(USERS).map((u) => u.email);

const timeLimit = (d: Difficulty) => (d === "EASY" ? 60 : d === "MEDIUM" ? 90 : 120);

type Q = {
  questionText: string;
  difficulty: Difficulty;
  category: string;
  answer?: string;
  scores?: [question: number, correctness: number, communication: number, confidence: number];
  feedback?: string;
};

const question = (q: Q, i: number) => ({
  questionText: q.questionText,
  difficulty: q.difficulty,
  category: q.category,
  timeLimitSeconds: timeLimit(q.difficulty),
  displayOrder: i + 1,
  ...(q.answer && {
    userAnswer: q.answer,
    isAnswered: true,
    questionScore: q.scores![0],
    correctnessScore: q.scores![1],
    communicationScore: q.scores![2],
    confidenceScore: q.scores![3],
    aiFeedback: q.feedback,
  }),
});

// ---------------- content ----------------

const FRONTEND_PRACTICE: Q[] = [
  { questionText: "Tell me about yourself and the kind of frontend work you enjoy most.", difficulty: "EASY", category: "Introduction",
    answer: "I'm a frontend engineer with three years of experience, mostly React and TypeScript. I enjoy building design systems and making complex forms feel simple.",
    scores: [78, 75, 82, 80], feedback: "Clear and concise. Add one concrete project to anchor your experience." },
  { questionText: "How does React decide when to re-render a component, and how would you prevent unnecessary renders?", difficulty: "MEDIUM", category: "React",
    answer: "A component re-renders when its state or props change or its parent re-renders. I use memo for expensive children, stable callbacks with useCallback, and keep state close to where it's used.",
    scores: [84, 86, 80, 82], feedback: "Accurate. Mention measuring with the React Profiler before optimising." },
  { questionText: "Explain the difference between server components and client components in Next.js.", difficulty: "MEDIUM", category: "Next.js",
    answer: "Server components render on the server and send no JavaScript; client components hydrate in the browser and can use state and effects. I default to server components and add use client only for interactivity.",
    scores: [80, 82, 78, 79], feedback: "Good default rule. Explain how data passes from server to client components." },
  { questionText: "Design a search-as-you-type input for a large product catalog. What would you consider?", difficulty: "HARD", category: "System design",
    answer: "Debounce the input, cancel stale requests, cache recent queries, and paginate results. I'd show a loading state and keep keyboard navigation accessible.",
    scores: [70, 68, 74, 70], feedback: "Solid basics. Discuss backend indexing and how you'd measure latency." },
  { questionText: "Describe a time you disagreed with a designer. How did you resolve it?", difficulty: "EASY", category: "Behavioral",
    answer: "We disagreed on a modal flow. I built a quick prototype of both options, we tested with two users, and went with the one that was faster to complete.",
    scores: [82, 78, 85, 83], feedback: "Strong use of evidence. Close with what you learned." },
];

const PM_PRACTICE: Q[] = [
  { questionText: "Why do you want to move into product management?", difficulty: "EASY", category: "Motivation",
    answer: "I like talking to users and deciding what to build. As an engineer I kept asking why we built features, so product feels like the natural next step.",
    scores: [72, 70, 76, 70], feedback: "Honest. Back it up with a product decision you influenced." },
  { questionText: "How would you prioritise three urgent requests from sales, support and engineering?", difficulty: "MEDIUM", category: "Prioritisation",
    answer: "I'd estimate impact and effort for each, check them against this quarter's goals, and share the reasoning openly so each team knows where they stand.",
    scores: [68, 66, 72, 67], feedback: "Name a framework such as RICE and say who makes the final call." },
  { questionText: "Tell me about a project that failed. What would you do differently?", difficulty: "MEDIUM", category: "Behavioral",
    answer: "A feature launched without analytics, so we couldn't tell if it worked. Next time I'd define success metrics before building.",
    scores: [74, 72, 75, 73], feedback: "Good reflection. Quantify the impact of the failure." },
];

const BACKEND_TEMPLATE: Q[] = [
  { questionText: "Walk me through how you would design a rate limiter for a public API.", difficulty: "HARD", category: "System design" },
  { questionText: "How do you prevent N+1 queries in an ORM like Prisma?", difficulty: "MEDIUM", category: "Databases" },
  { questionText: "Explain idempotency and how you would make a payment endpoint idempotent.", difficulty: "HARD", category: "API design" },
  { questionText: "What signals would you look at first when an API's p95 latency doubles?", difficulty: "MEDIUM", category: "Observability" },
  { questionText: "Tell me about a production incident you owned. What changed afterwards?", difficulty: "EASY", category: "Behavioral" },
];

const BACKEND_ANSWERS: Pick<Q, "answer" | "scores" | "feedback">[] = [
  { answer: "I'd use a token bucket per API key in Redis, with atomic increments and a TTL. Return 429 with a Retry-After header, and allow a small burst.",
    scores: [86, 88, 82, 85], feedback: "Strong choice of algorithm. Mention distributed consistency across regions." },
  { answer: "Use include or select to fetch relations in one query, batch lookups with findMany and an in filter, and watch the query log in development.",
    scores: [82, 84, 80, 80], feedback: "Correct. Mention dataloader-style batching for GraphQL resolvers." },
  { answer: "An idempotent request has the same effect if sent twice. The client sends an idempotency key; the server stores the result keyed by it and returns the stored result on retry.",
    scores: [88, 90, 85, 86], feedback: "Excellent. Add how long keys are kept and how races are handled." },
  { answer: "Check recent deploys, database query times and connection pool saturation, then traces for the slowest endpoints.",
    scores: [76, 78, 74, 75], feedback: "Good order. Mention comparing against error rate and traffic." },
  { answer: "A migration locked a large table during peak hours. I rolled it back, then we added a rule that big migrations run online and off-peak.",
    scores: [80, 76, 84, 82], feedback: "Clear ownership. Describe how you communicated during the incident." },
];

// ---------------- reset ----------------

async function clearSeed() {
  const users = await prisma.user.findMany({
    where: { email: { in: SEED_EMAILS } },
    select: { id: true, candidate: { select: { id: true } } },
  });
  const candidateIds = users.flatMap((u) => (u.candidate ? [u.candidate.id] : []));
  // PracticeInterview -> Candidate has no cascade, so remove those first
  await prisma.practiceInterview.deleteMany({ where: { candidateId: { in: candidateIds } } });
  // Cascades: user -> candidate/recruiter/owned company -> jobs -> interviews, questions, invitations, reports
  await prisma.user.deleteMany({ where: { id: { in: users.map((u) => u.id) } } });
  return users.length;
}

// ---------------- create ----------------

async function createUser(u: { name: string; email: string }, passwordHash: string) {
  const user = await prisma.user.create({ data: { name: u.name, email: u.email, emailVerified: true } });
  // Same shape Better Auth writes on email sign-up
  await prisma.account.create({
    data: { id: randomUUID(), userId: user.id, accountId: user.id, providerId: "credential", password: passwordHash },
  });
  return user;
}

async function seed() {
  if (process.env.NODE_ENV === "production" && !process.argv.includes("--force")) {
    throw new Error("Refusing to seed with NODE_ENV=production. Pass --force if you really mean it.");
  }

  const removed = await clearSeed();
  if (process.argv.includes("--clear")) {
    console.log(`Removed ${removed} seed users and their data.`);
    return;
  }

  const clash = await prisma.company.findUnique({ where: { name: COMPANY_NAME } });
  if (clash) throw new Error(`A non-seed company named "${COMPANY_NAME}" already exists; not touching it.`);

  const hash = await hashPassword(SEED_PASSWORD);
  const [candidateUser, candidate2User, ownerUser, recruiterUser] = await Promise.all([
    createUser(USERS.candidate, hash),
    createUser(USERS.candidate2, hash),
    createUser(USERS.owner, hash),
    createUser(USERS.recruiter, hash),
  ]);

  // ---- candidates ----
  const candidate = await prisma.candidate.create({ data: { userId: candidateUser.id } });
  await prisma.candidate.create({ data: { userId: candidate2User.id } });

  for (const [role, mode, years, qs, report, daysAgo] of [
    ["Frontend Engineer", "TECHNICAL", 3, FRONTEND_PRACTICE, {
      overallScore: 79,
      strengths: ["Accurate React fundamentals", "Structured, concise answers", "Uses evidence in behavioral answers"],
      weaknesses: ["System design answers stay surface-level", "Rarely mentions measuring performance"],
      summary: "A solid mid-level frontend candidate with clear communication and good React knowledge. Depth on system design is the main gap.",
      recommendation: "Practise one end-to-end system design question per week and bring metrics into answers.",
    }, 6],
    ["Product Manager", "HR", 3, PM_PRACTICE, {
      overallScore: 71,
      strengths: ["Honest self-reflection", "Clear motivation for the role"],
      weaknesses: ["No prioritisation framework named", "Impact is not quantified"],
      summary: "Thoughtful answers with genuine motivation, but they need more structure and numbers to be convincing for a PM role.",
      recommendation: "Learn RICE or a similar framework and prepare two stories with measurable outcomes.",
    }, 2],
  ] as const) {
    const completedAt = new Date(Date.now() - daysAgo * DAY);
    await prisma.practiceInterview.create({
      data: {
        role, interviewMode: mode, experienceYears: years, status: "COMPLETED",
        startedAt: new Date(completedAt.getTime() - 20 * 60 * 1000), completedAt, createdAt: completedAt,
        candidateId: candidate.id,
        questions: { create: qs.map(question) },
        report: { create: { ...report, strengths: [...report.strengths], weaknesses: [...report.weaknesses] } },
      },
    });
  }

  // ---- company + recruiters ----
  const company = await prisma.company.create({
    data: { name: COMPANY_NAME, website: "https://example.com", ownerId: ownerUser.id },
  });
  const ownerRecruiter = await prisma.recruiter.create({
    data: { userId: ownerUser.id, companyId: company.id, designation: "Head of Talent" },
  });
  const teamRecruiter = await prisma.recruiter.create({
    data: { userId: recruiterUser.id, companyId: company.id, designation: "Technical Recruiter" },
  });
  await prisma.recruiterInvitation.create({
    data: { token: RECRUITER_INVITE_TOKEN, email: "new.recruiter@example.com", companyId: company.id, expiresAt: new Date(Date.now() + 7 * DAY) },
  });

  // ---- job 1: open, with a question template, one completed and two pending invites ----
  const backend = await prisma.job.create({
    data: {
      title: "Senior Backend Engineer",
      description: "Own our Node.js and PostgreSQL services end to end. You will design APIs, improve reliability, and mentor two engineers. Experience with queues, caching and observability is a plus.",
      status: "OPEN", minExperienceYears: 4, maxExperienceYears: 8, companyId: company.id,
      interviewConfig: { create: { interviewMode: "TECHNICAL", questionCount: 5, durationMinutes: 30, prompt: "Focus on API design, databases and production ownership." } },
      jobRecruiters: { create: [{ recruiterId: ownerRecruiter.id }, { recruiterId: teamRecruiter.id }] },
    },
  });
  // Candidate-less interview = the job's reusable question template (see companyInterview.redeemInvitation)
  const template = await prisma.companyInterview.create({
    data: { jobId: backend.id, questions: { create: BACKEND_TEMPLATE.map(question) } },
  });

  const completedAt = new Date(Date.now() - 1 * DAY);
  const done = await prisma.companyInterview.create({
    data: {
      jobId: backend.id, candidateId: candidate.id, status: "COMPLETED",
      startedAt: new Date(completedAt.getTime() - 25 * 60 * 1000), completedAt,
      questions: { create: BACKEND_TEMPLATE.map((q, i) => question({ ...q, ...BACKEND_ANSWERS[i] }, i)) },
      report: {
        create: {
          overallScore: 83,
          strengths: ["Sound distributed-systems instincts", "Precise on idempotency and rate limiting", "Owns incidents and follow-ups"],
          weaknesses: ["Observability answer lacked a clear triage order", "Little on cross-region consistency"],
          summary: "Strong backend fundamentals with clear, confident delivery. Ready for a senior role with some coaching on observability.",
          recommendation: "Advance to the onsite system design round.",
        },
      },
    },
  });
  await prisma.invitation.createMany({
    data: [
      { token: "SEEDACCEPTEDINV1", candidateEmail: USERS.candidate.email, candidateName: USERS.candidate.name, candidateId: candidate.id,
        jobId: backend.id, interviewId: done.id, status: "ACCEPTED", acceptedAt: new Date(completedAt.getTime() - 26 * 60 * 1000),
        expiresAt: new Date(Date.now() + 5 * DAY), createdAt: new Date(Date.now() - 2 * DAY) },
      { token: CANDIDATE_INVITE_TOKEN, candidateEmail: USERS.candidate2.email, candidateName: USERS.candidate2.name,
        jobId: backend.id, interviewId: template.id, expiresAt: new Date(Date.now() + 7 * DAY) },
      { token: EXPIRED_INVITE_TOKEN, candidateEmail: "expired.candidate@example.com", candidateName: "Kabir Singh",
        jobId: backend.id, interviewId: template.id, expiresAt: new Date(Date.now() - 1 * DAY), createdAt: new Date(Date.now() - 8 * DAY) },
    ],
  });

  // ---- job 2: draft with config but no interview set up yet ----
  await prisma.job.create({
    data: {
      title: "Product Designer",
      description: "Shape the candidate and recruiter experience across web apps. You will run research, prototype flows and work closely with engineering.",
      status: "DRAFT", minExperienceYears: 2, companyId: company.id,
      interviewConfig: { create: { interviewMode: "HR", questionCount: 4, durationMinutes: 20 } },
      jobRecruiters: { create: [{ recruiterId: ownerRecruiter.id }] },
    },
  });

  const candidateUrl = process.env.NEXT_PUBLIC_CANDIDATE_URL ?? "http://localhost:5173";
  const recruiterUrl = process.env.NEXT_PUBLIC_RECRUITER_URL ?? "http://localhost:5174";
  console.log(`
Seeded (replaced ${removed} previous seed users). Password for every account: ${SEED_PASSWORD}

  Candidate   ${USERS.candidate.email.padEnd(24)} 2 practice reports, 1 completed company interview
  Candidate   ${USERS.candidate2.email.padEnd(24)} pending invite: ${candidateUrl}/interview?token=${CANDIDATE_INVITE_TOKEN}
  Recruiter   ${USERS.owner.email.padEnd(24)} owner of ${COMPANY_NAME}
  Recruiter   ${USERS.recruiter.email.padEnd(24)} teammate at ${COMPANY_NAME}

  Pending recruiter invite for new.recruiter@example.com: ${recruiterUrl}/accept-invite?token=${RECRUITER_INVITE_TOKEN}
`);
}

seed()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
