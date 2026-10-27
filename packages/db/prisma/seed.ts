/**
 * Dummy data for local development and demos.
 *
 *   bun run db:seed          reset seed rows, then insert them again (idempotent)
 *   bun run db:seed --clear  only remove seed rows
 *
 * Every seed user signs in with email + password through Better Auth (SEED_PASSWORD below).
 * Only rows owned by the seed users are touched; other data is left alone. A fixed random seed
 * keeps names, scores and dates the same on every run.
 */
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { prisma } from "../index";
import type { Difficulty, InterviewStatus, JobStatus } from "../generated/prisma/enums";
import { CANDIDATE_NAMES, INVITEE_NAMES, TRACKS, type BankQuestion, type Track, type TrackKey } from "./seed-data";

export const SEED_PASSWORD = "Password123!";
const DAY = 24 * 60 * 60 * 1000;
const MIN = 60 * 1000;
const CANDIDATE_INVITE_TOKEN = "SEEDDEMOINVITE01"; // 16 chars, same shape as generateInviteCode(16)
const EXPIRED_INVITE_TOKEN = "SEEDEXPIREDINV01";
const RECRUITER_INVITE_TOKEN = "SEEDRECRUIT1"; // 12 chars, same shape as generateInviteCode()

// ---------------- deterministic randomness ----------------

let state = 20261027;
const rand = () => {
  // mulberry32
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));
const sample = <T>(arr: readonly T[], n: number) => [...arr].sort(() => rand() - 0.5).slice(0, n);
const clamp = (n: number) => Math.max(30, Math.min(98, Math.round(n)));
const ago = (days: number) => new Date(Date.now() - days * DAY);
let tokenCount = 0;
const token = () => `SEEDINV${String(++tokenCount).padStart(9, "0")}`; // 16 chars

// ---------------- people ----------------

const emailOf = (name: string) => `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`;

const CANDIDATES = CANDIDATE_NAMES.map((name, i) => ({
  name,
  email: i === 0 ? "candidate@example.com" : i === 1 ? "candidate2@example.com" : emailOf(name),
  skill: i === 0 ? 80 : int(52, 92),
  years: int(1, 8),
}));
const AARAV = 0;
const MEERA = 1;

type SeedCompany = {
  name: string;
  website: string;
  recruiters: { name: string; email: string; designation: string }[];
  recruiterInvites: { token: string; email: string; status: "PENDING" | "ACCEPTED"; expiresInDays: number }[];
  jobs: {
    title: string; track?: TrackKey; status: JobStatus; years: [number, number | undefined]; applicants: number;
    daysAgo: number; description: string; prompt?: string; forced?: number[]; exclude?: number[];
  }[];
};

const COMPANIES: SeedCompany[] = [
  {
    name: "Acme Labs",
    website: "https://acme.example.com",
    recruiters: [
      { name: "Priya Nair", email: "recruiter@example.com", designation: "Head of Talent" },
      { name: "Rohan Mehta", email: "recruiter2@example.com", designation: "Technical Recruiter" },
      { name: "Sneha Kapoor", email: "sneha.kapoor@example.com", designation: "Talent Partner, Engineering" },
      { name: "Vikram Joshi", email: "vikram.joshi@example.com", designation: "Engineering Manager" },
      { name: "Ayesha Khan", email: "ayesha.khan@example.com", designation: "Recruiting Coordinator" },
    ],
    recruiterInvites: [
      { token: RECRUITER_INVITE_TOKEN, email: "new.recruiter@example.com", status: "PENDING", expiresInDays: 7 },
      { token: "SEEDRECRUIT2", email: "hiring.lead@example.com", status: "PENDING", expiresInDays: 4 },
      { token: "SEEDRECRUIT3", email: "former.recruiter@example.com", status: "PENDING", expiresInDays: -3 },
      { token: "SEEDRECRUIT4", email: "ayesha.khan@example.com", status: "ACCEPTED", expiresInDays: 2 },
    ],
    jobs: [
      { title: "Senior Backend Engineer", track: "backend", status: "OPEN", years: [4, 8], applicants: 10, daysAgo: 40,
        forced: [AARAV], exclude: [MEERA],
        description: "Own our Node.js and PostgreSQL services end to end. You will design APIs, improve reliability, and mentor two engineers. Experience with queues, caching and observability is a plus.",
        prompt: "Focus on API design, databases and production ownership." },
      { title: "Frontend Engineer", track: "frontend", status: "OPEN", years: [2, 5], applicants: 9, daysAgo: 35, forced: [AARAV],
        description: "Build the recruiter and candidate web apps in React and Next.js. You will own our component library, accessibility and front-end performance." },
      { title: "Full Stack Engineer", track: "fullstack", status: "OPEN", years: [3, 6], applicants: 8, daysAgo: 26,
        description: "Ship features across our tRPC API and Next.js apps, from database schema to polished UI. Comfortable with TypeScript everywhere." },
      { title: "Data Analyst", track: "data", status: "OPEN", years: [1, 4], applicants: 6, daysAgo: 18,
        description: "Turn interview and hiring data into insight for customers. Strong SQL, a feel for experiments, and clear storytelling with charts." },
      { title: "DevOps Engineer", track: "devops", status: "PAUSED", years: [3, 7], applicants: 4, daysAgo: 30,
        description: "Run our CI/CD, cloud infrastructure and observability. Hiring is paused until next quarter's headcount is confirmed." },
      { title: "Associate Product Manager", track: "pm", status: "CLOSED", years: [0, 2], applicants: 7, daysAgo: 58,
        description: "Work with engineering and design on the candidate experience. This role has been filled; the pipeline is kept for reference." },
      { title: "Product Designer", track: "design", status: "DRAFT", years: [2, undefined], applicants: 0, daysAgo: 3,
        description: "Shape the candidate and recruiter experience across web apps. You will run research, prototype flows and work closely with engineering." },
      { title: "Engineering Manager", status: "DRAFT", years: [7, undefined], applicants: 0, daysAgo: 1,
        description: "Lead a team of six engineers across the platform. Interview setup is still being agreed with the hiring panel." },
    ],
  },
  {
    name: "Globex Systems",
    website: "https://globex.example.com",
    recruiters: [
      { name: "Neha Gupta", email: "recruiter3@example.com", designation: "Talent Acquisition Lead" },
      { name: "Karan Malhotra", email: "karan.malhotra@example.com", designation: "Technical Sourcer" },
    ],
    recruiterInvites: [{ token: "SEEDRECRUIT5", email: "talent@example.com", status: "PENDING", expiresInDays: 6 }],
    jobs: [
      { title: "React Native Engineer", track: "frontend", status: "OPEN", years: [2, 6], applicants: 5, daysAgo: 21,
        description: "Build our field-service mobile app in React Native and TypeScript, with offline support and smooth animations." },
      { title: "Data Engineer", track: "data", status: "OPEN", years: [3, 7], applicants: 4, daysAgo: 14,
        description: "Design batch and streaming pipelines that feed analytics for thousands of technicians." },
      { title: "Customer Success Manager", track: "pm", status: "DRAFT", years: [2, undefined], applicants: 0, daysAgo: 2,
        description: "Own onboarding and renewals for our enterprise accounts." },
    ],
  },
];

const ROLE: Record<TrackKey, string> = {
  frontend: "Frontend Engineer", backend: "Backend Engineer", fullstack: "Full Stack Engineer",
  data: "Data Analyst", devops: "DevOps Engineer", pm: "Product Manager", design: "Product Designer",
};

const SEED_EMAILS = [...CANDIDATES.map((c) => c.email), ...COMPANIES.flatMap((c) => c.recruiters.map((r) => r.email))];

// ---------------- generators ----------------

const timeLimit = (d: Difficulty) => (d === "EASY" ? 60 : d === "MEDIUM" ? 90 : 120);
const PENALTY: Record<Difficulty, number> = { EASY: -4, MEDIUM: 2, HARD: 7 };

const blank = ([questionText, difficulty, category]: BankQuestion, i: number) => ({
  questionText, difficulty, category, timeLimitSeconds: timeLimit(difficulty), displayOrder: i + 1,
});

/** A question answered by someone at `skill` level (0-100). */
function answered(q: BankQuestion, i: number, skill: number) {
  const [, difficulty, , answer, tip] = q;
  const base = skill - PENALTY[difficulty];
  const correctness = clamp(base + (rand() - 0.5) * 16);
  const communication = clamp(base + (rand() - 0.5) * 14);
  const confidence = clamp(base + (rand() - 0.5) * 18);
  const score = Math.round((correctness + communication + confidence) / 3);
  const opener = score >= 80 ? "Strong answer." : score >= 65 ? "Good answer with room to grow." : "Needs more depth and structure.";
  return {
    ...blank(q, i),
    // weaker candidates give only the first sentence of the model answer
    userAnswer: score >= 68 ? answer : answer.split(/(?<=\.)\s/)[0],
    isAnswered: true,
    questionScore: score, correctnessScore: correctness, communicationScore: communication, confidenceScore: confidence,
    durationSeconds: Math.round(timeLimit(difficulty) * (0.45 + rand() * 0.5)),
    aiFeedback: `${opener} ${tip}`,
  };
}

function report(track: Track, role: string, scores: number[], kind: "practice" | "company") {
  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const strong = overallScore >= 75;
  const strengths = sample(track.strengths, strong ? 3 : 2);
  const weaknesses = sample(track.weaknesses, strong ? 1 : 2);
  const level = overallScore >= 82 ? "A strong" : overallScore >= 70 ? "A solid" : "An early-stage";
  return {
    overallScore,
    strengths,
    weaknesses,
    summary: `${level} ${role.toLowerCase()} candidate. ${strengths[0]} stood out; the main gap is that ${weaknesses[0]!.charAt(0).toLowerCase()}${weaknesses[0]!.slice(1)}.`,
    recommendation:
      kind === "practice"
        ? `Next session, focus on: ${weaknesses.join("; ").toLowerCase()}.`
        : overallScore >= 80 ? "Advance to the onsite round."
        : overallScore >= 68 ? "Hold: compare with the other finalists before deciding."
        : "Do not advance at this stage.",
  };
}

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

  const clash = await prisma.company.findFirst({ where: { name: { in: COMPANIES.map((c) => c.name) } } });
  if (clash) throw new Error(`A non-seed company named "${clash.name}" already exists; not touching it.`);

  const hash = await hashPassword(SEED_PASSWORD);
  const counts = { practice: 0, interviews: 0, invitations: 0 };

  // ---- candidates + practice history ----
  const candidateIds = await Promise.all(
    CANDIDATES.map(async (c) => {
      const user = await createUser(c, hash);
      return (await prisma.candidate.create({ data: { userId: user.id, credits: int(40, 100) } })).id;
    }),
  );

  // Aarav: ten sessions over two months, improving steadily (nice for the history page). Others: 0-3 each.
  const AARAV_TRACKS: TrackKey[] = ["frontend", "fullstack", "frontend", "pm", "backend", "frontend", "fullstack", "data", "frontend", "fullstack"];
  const practice = CANDIDATES.flatMap((c, ci) =>
    ci === AARAV
      ? AARAV_TRACKS.map((track, i) => ({ ci, track, skill: 60 + i * 3, daysAgo: 62 - i * 6.5 }))
      : Array.from({ length: ci === MEERA ? 2 : int(0, 3) }, () => ({
          ci, track: sample(Object.keys(TRACKS) as TrackKey[], 1)[0]!, skill: c.skill + int(-6, 4), daysAgo: int(2, 50),
        })),
  );
  for (const p of practice) {
    const track = TRACKS[p.track];
    const qs = track.questions.map((q, i) => answered(q, i, p.skill));
    const completedAt = ago(p.daysAgo);
    await prisma.practiceInterview.create({
      data: {
        role: ROLE[p.track], interviewMode: track.mode, experienceYears: CANDIDATES[p.ci]!.years, status: "COMPLETED",
        startedAt: new Date(completedAt.getTime() - int(15, 30) * MIN), completedAt, createdAt: completedAt,
        candidateId: candidateIds[p.ci]!,
        questions: { create: qs },
        report: { create: report(track, ROLE[p.track], qs.map((q) => q.questionScore), "practice") },
      },
    });
    counts.practice++;
  }

  // ---- companies, recruiters, jobs, interviews, invitations ----
  for (const co of COMPANIES) {
    const [ownerUser, ...teamUsers] = await Promise.all(co.recruiters.map((r) => createUser(r, hash)));
    const company = await prisma.company.create({
      data: { name: co.name, website: co.website, ownerId: ownerUser!.id, credits: int(120, 400) },
    });
    const recruiterIds = await Promise.all(
      [ownerUser!, ...teamUsers].map(async (u, i) =>
        (await prisma.recruiter.create({ data: { userId: u.id, companyId: company.id, designation: co.recruiters[i]!.designation } })).id,
      ),
    );
    await prisma.recruiterInvitation.createMany({
      data: co.recruiterInvites.map((r) => ({
        token: r.token, email: r.email, status: r.status, companyId: company.id,
        expiresAt: new Date(Date.now() + r.expiresInDays * DAY), createdAt: ago(7 - r.expiresInDays),
      })),
    });

    for (const j of co.jobs) {
      const track: Track | undefined = j.track && TRACKS[j.track];
      const createdAt = ago(j.daysAgo);
      const job = await prisma.job.create({
        data: {
          title: j.title, description: j.description, status: j.status, createdAt,
          minExperienceYears: j.years[0], maxExperienceYears: j.years[1], companyId: company.id,
          ...(track && {
            interviewConfig: {
              create: {
                interviewMode: track.mode, questionCount: track.questions.length,
                durationMinutes: track.questions.length * 5, prompt: j.prompt,
              },
            },
          }),
          jobRecruiters: {
            create: [recruiterIds[0]!, ...sample(recruiterIds.slice(1), int(1, 2))].map((recruiterId) => ({ recruiterId })),
          },
        },
      });
      // Drafts have config but no interview yet, so the job page shows "Set up interview"
      if (!track || j.status === "DRAFT") continue;

      // Candidate-less interview = the job's reusable question template (see companyInterview.redeemInvitation)
      const template = await prisma.companyInterview.create({
        data: { jobId: job.id, createdAt, questions: { create: track.questions.map(blank) } },
      });

      const forced = j.forced ?? [];
      const excluded = j.exclude ?? [];
      const pool = CANDIDATES.map((_, i) => i).filter((i) => !forced.includes(i) && !excluded.includes(i));
      const applicants = [...forced, ...sample(pool, j.applicants - forced.length)];

      await Promise.all(
        applicants.map(async (ci) => {
          const c = CANDIDATES[ci]!;
          const roll = rand();
          const status: InterviewStatus =
            forced.includes(ci) || j.status === "CLOSED" || roll < 0.7 ? "COMPLETED" : roll < 0.88 ? "IN_PROGRESS" : "PENDING";
          const acceptedAt = new Date(createdAt.getTime() + rand() * (Date.now() - createdAt.getTime() - DAY));
          const startedAt = status === "PENDING" ? undefined : new Date(acceptedAt.getTime() + int(1, 30) * MIN);
          const answeredCount = status === "COMPLETED" ? track.questions.length : status === "IN_PROGRESS" ? int(1, track.questions.length - 1) : 0;
          const done = track.questions.slice(0, answeredCount).map((q, i) => answered(q, i, c.skill));
          const qs = [...done, ...track.questions.slice(answeredCount).map((q, i) => blank(q, answeredCount + i))];
          const interview = await prisma.companyInterview.create({
            data: {
              jobId: job.id, candidateId: candidateIds[ci]!, status, createdAt: acceptedAt, startedAt,
              completedAt: status === "COMPLETED" ? new Date(startedAt!.getTime() + int(18, 35) * MIN) : undefined,
              questions: { create: qs },
              ...(status === "COMPLETED" && {
                report: { create: report(track, j.title, done.map((q) => q.questionScore), "company") },
              }),
            },
          });
          await prisma.invitation.create({
            data: {
              token: token(), candidateEmail: c.email, candidateName: c.name, candidateId: candidateIds[ci]!,
              jobId: job.id, interviewId: interview.id, status: "ACCEPTED", acceptedAt,
              createdAt: new Date(acceptedAt.getTime() - int(1, 48) * 60 * MIN), expiresAt: new Date(acceptedAt.getTime() + 6 * DAY),
            },
          });
        }),
      );
      counts.interviews += applicants.length;

      // Invites sent to people who haven't signed up: pending, expired and declined
      const closed = j.status === "CLOSED";
      const outstanding = sample(INVITEE_NAMES, int(2, 4)).map((name, i) => {
        const sent = ago(i === 0 ? 9 : int(1, 6));
        return {
          token: token(), candidateEmail: emailOf(name), candidateName: name, jobId: job.id, interviewId: template.id,
          status: closed ? ("EXPIRED" as const) : i === 1 && rand() < 0.5 ? ("REJECTED" as const) : ("PENDING" as const),
          createdAt: sent, expiresAt: new Date(sent.getTime() + 7 * DAY),
        };
      });
      if (j.title === "Senior Backend Engineer") {
        outstanding.push(
          { token: CANDIDATE_INVITE_TOKEN, candidateEmail: CANDIDATES[MEERA]!.email, candidateName: CANDIDATES[MEERA]!.name,
            jobId: job.id, interviewId: template.id, status: "PENDING", createdAt: ago(1), expiresAt: new Date(Date.now() + 7 * DAY) },
          { token: EXPIRED_INVITE_TOKEN, candidateEmail: "expired.candidate@example.com", candidateName: "Kabir Singh",
            jobId: job.id, interviewId: template.id, status: "PENDING", createdAt: ago(8), expiresAt: ago(1) },
        );
      }
      await prisma.invitation.createMany({ data: outstanding });
      counts.invitations += applicants.length + outstanding.length;
    }
  }

  const candidateUrl = process.env.NEXT_PUBLIC_CANDIDATE_URL ?? "http://localhost:5173";
  const recruiterUrl = process.env.NEXT_PUBLIC_RECRUITER_URL ?? "http://localhost:5174";
  const recruiterCount = COMPANIES.reduce((n, c) => n + c.recruiters.length, 0);
  console.log(`
Seeded (replaced ${removed} previous seed users). Password for every account: ${SEED_PASSWORD}

  ${CANDIDATES.length} candidates, ${counts.practice} practice interviews
  ${COMPANIES.length} companies, ${recruiterCount} recruiters, ${COMPANIES.reduce((n, c) => n + c.jobs.length, 0)} jobs
  ${counts.interviews} company interviews, ${counts.invitations} candidate invitations

  Candidate   candidate@example.com     10 practice reports, interviews at Acme Labs
  Candidate   candidate2@example.com    pending invite: ${candidateUrl}/interview?token=${CANDIDATE_INVITE_TOKEN}
  Recruiter   recruiter@example.com     owner of Acme Labs
  Recruiter   recruiter2@example.com    teammate at Acme Labs
  Recruiter   recruiter3@example.com    owner of Globex Systems

  Pending recruiter invite for new.recruiter@example.com: ${recruiterUrl}/accept-invite?token=${RECRUITER_INVITE_TOKEN}
`);
}

seed()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
