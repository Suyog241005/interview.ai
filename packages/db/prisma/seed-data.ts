/**
 * Content banks for prisma/seed.ts. Plain data only: questions with a model answer and a coaching tip,
 * plus strengths/weaknesses that the seed mixes into reports.
 */
import type { Difficulty, InterviewMode } from "../generated/prisma/enums";

/** [question, difficulty, category, model answer, coaching tip] */
export type BankQuestion = [string, Difficulty, string, string, string];

export type Track = {
  mode: InterviewMode;
  questions: BankQuestion[];
  strengths: string[];
  weaknesses: string[];
};

export const TRACKS = {
  frontend: {
    mode: "TECHNICAL",
    questions: [
      ["Tell me about yourself and the kind of frontend work you enjoy most.", "EASY", "Introduction",
        "I'm a frontend engineer focused on React and TypeScript. I enjoy building design systems and making complex forms feel simple. Most recently I rebuilt our checkout flow and cut drop-off by 12%.",
        "Anchor your intro with one concrete project and its result."],
      ["How does React decide when to re-render a component, and how would you prevent unnecessary renders?", "MEDIUM", "React",
        "A component re-renders when its state or props change or its parent re-renders. I memoise expensive children, keep callbacks stable, and keep state close to where it's used. I measure with the React Profiler before optimising.",
        "Mention measuring with the React Profiler before optimising."],
      ["Explain the difference between server components and client components in Next.js.", "MEDIUM", "Next.js",
        "Server components render on the server and ship no JavaScript; client components hydrate in the browser and can use state and effects. I default to server components and add use client only at interactive leaves.",
        "Explain how data passes from server to client components."],
      ["Design a search-as-you-type input for a large product catalog. What would you consider?", "HARD", "System design",
        "Debounce input, cancel stale requests, cache recent queries and paginate results. Keep keyboard navigation accessible, show loading and empty states, and back it with a search index rather than SQL LIKE.",
        "Discuss backend indexing and how you would measure latency."],
      ["How do you make a custom dropdown accessible?", "MEDIUM", "Accessibility",
        "Prefer a native select. If it must be custom, follow the listbox pattern: a button with aria-expanded, arrow-key navigation, Escape to close, focus returned to the trigger, and a visible focus ring.",
        "Name how you would test it with a screen reader."],
      ["Describe a time you disagreed with a designer. How did you resolve it?", "EASY", "Behavioral",
        "We disagreed on a modal flow. I built quick prototypes of both options, we tested with two users, and went with the one that was faster to complete. We now prototype contested flows by default.",
        "Close with what you learned."],
    ],
    strengths: ["Accurate React fundamentals", "Structured, concise answers", "Strong accessibility awareness", "Uses evidence in behavioral answers", "Good instinct for performance"],
    weaknesses: ["System design answers stay surface-level", "Rarely mentions measuring performance", "Testing strategy is vague", "Limited depth on rendering trade-offs"],
  },
  backend: {
    mode: "TECHNICAL",
    questions: [
      ["Walk me through how you would design a rate limiter for a public API.", "HARD", "System design",
        "A token bucket per API key in Redis with atomic increments and a TTL. Return 429 with a Retry-After header and allow a small burst. For multiple regions, accept slight over-admission or use a central store.",
        "Mention distributed consistency across regions."],
      ["How do you prevent N+1 queries in an ORM like Prisma?", "MEDIUM", "Databases",
        "Fetch relations with include or select in one query, batch lookups with findMany and an in filter, and watch the query log in development. For GraphQL I'd add dataloader-style batching.",
        "Mention dataloader-style batching for resolvers."],
      ["Explain idempotency and how you would make a payment endpoint idempotent.", "HARD", "API design",
        "An idempotent request has the same effect when repeated. The client sends an idempotency key; the server stores the result under it and replays it on retry, with a unique constraint to handle races.",
        "Say how long keys are kept and how races are handled."],
      ["What signals would you look at first when an API's p95 latency doubles?", "MEDIUM", "Observability",
        "Recent deploys, then database query times and connection pool saturation, then traces for the slowest endpoints, compared against error rate and traffic.",
        "Compare latency against error rate and traffic."],
      ["When would you choose a message queue over a direct HTTP call between services?", "MEDIUM", "Architecture",
        "When the caller doesn't need the result immediately, when the consumer is slow or flaky, or when traffic is bursty. A queue gives retries and back-pressure at the cost of eventual consistency.",
        "Cover dead-letter queues and poison messages."],
      ["Tell me about a production incident you owned. What changed afterwards?", "EASY", "Behavioral",
        "A migration locked a large table during peak hours. I rolled it back, posted updates every 15 minutes, and we added a rule that large migrations run online and off-peak.",
        "Describe how you communicated during the incident."],
    ],
    strengths: ["Sound distributed-systems instincts", "Precise on idempotency and rate limiting", "Owns incidents and follow-ups", "Clear database reasoning", "Thinks about failure modes early"],
    weaknesses: ["Observability answer lacked a clear triage order", "Little on cross-region consistency", "Skips capacity estimates", "Testing approach not discussed"],
  },
  fullstack: {
    mode: "TECHNICAL",
    questions: [
      ["Walk me through what happens when a user submits a form in your stack, from click to database.", "MEDIUM", "Fundamentals",
        "The browser validates and sends a POST, the API validates again with a shared schema, checks the session, writes in a transaction, and returns the new row so the client can update its cache.",
        "Mention validating on both the client and the server."],
      ["How would you add authentication to an existing app?", "MEDIUM", "Security",
        "Use a proven library rather than rolling my own, store sessions in httpOnly cookies, hash passwords with a slow algorithm, and protect routes with middleware on the server, not only in the UI.",
        "Cover CSRF and session expiry."],
      ["How do you decide what goes in the client cache versus the server?", "HARD", "Architecture",
        "The server is the source of truth. The client caches reads with a library like TanStack Query, invalidates on mutation, and only keeps purely visual state locally.",
        "Discuss optimistic updates and rollback."],
      ["Design a simple notifications feature for a web app.", "HARD", "System design",
        "A notifications table keyed by user with a read flag, written by the services that trigger events. The client polls or uses server-sent events, and a badge shows the unread count.",
        "Talk about fan-out for large audiences."],
      ["How do you keep a monorepo healthy as it grows?", "MEDIUM", "Tooling",
        "Shared packages with clear boundaries, one lint and type-check config, CI that runs only affected workspaces, and ownership files so changes reach the right reviewers.",
        "Mention build caching."],
      ["Tell me about a feature you shipped end to end.", "EASY", "Behavioral",
        "I built CSV export for reports: a background job writes the file to storage and the user gets a link by email. Support tickets about exporting dropped to zero.",
        "Quantify the impact."],
    ],
    strengths: ["Comfortable across the whole stack", "Pragmatic architecture choices", "Security-aware by default", "Explains trade-offs clearly"],
    weaknesses: ["Depth on scaling is limited", "Caching strategy stays generic", "Few metrics in examples"],
  },
  data: {
    mode: "TECHNICAL",
    questions: [
      ["How would you find the top three products by revenue in each region using SQL?", "MEDIUM", "SQL",
        "Aggregate revenue per product and region, then use ROW_NUMBER() over a partition by region ordered by revenue descending, and keep rows where the rank is at most three.",
        "Explain how ties should be handled."],
      ["A dashboard shows signups dropped 30% overnight. How do you investigate?", "MEDIUM", "Analysis",
        "First check whether tracking broke: recent releases, event volume and pipeline delays. Then segment by platform, country and channel to find where the drop is concentrated.",
        "Start by ruling out data-quality issues."],
      ["Explain the difference between correlation and causation with an example.", "EASY", "Statistics",
        "Ice cream sales and drownings rise together because both increase in summer. To show causation you need an experiment or a method that controls for confounders.",
        "Mention A/B tests as the standard remedy."],
      ["How would you design an A/B test for a new checkout button?", "HARD", "Experimentation",
        "Pick one primary metric such as conversion, estimate the sample size from the minimum effect we care about, randomise by user, run full weeks, and avoid peeking before the planned end.",
        "Explain how you would choose the sample size."],
      ["How do you explain a technical finding to a non-technical stakeholder?", "EASY", "Communication",
        "Lead with the decision it affects, show one clear chart, give the number in plain words, and keep the method in an appendix for anyone who asks.",
        "Lead with the decision, not the method."],
    ],
    strengths: ["Strong SQL fluency", "Methodical investigation", "Explains numbers in plain language", "Good experimental design"],
    weaknesses: ["Statistics answers lack rigour", "Little on data quality checks", "Visualisation choices not justified"],
  },
  devops: {
    mode: "TECHNICAL",
    questions: [
      ["How would you set up CI/CD for a new service?", "MEDIUM", "CI/CD",
        "Every push runs lint, type-check and tests; main builds an image once and promotes the same artifact through staging to production, with automatic rollback on failed health checks.",
        "Mention promoting the same artifact through environments."],
      ["What is the difference between a liveness and a readiness probe?", "EASY", "Kubernetes",
        "Liveness restarts a stuck container; readiness removes a pod from the load balancer until it can serve. A slow dependency should fail readiness, not liveness.",
        "Give an example of misconfigured probes causing an outage."],
      ["How do you manage secrets across environments?", "MEDIUM", "Security",
        "A secrets manager rather than files in the repo, short-lived credentials where possible, access scoped per service, and rotation that doesn't need a redeploy.",
        "Cover rotation without downtime."],
      ["Design zero-downtime deploys for a stateful API with database migrations.", "HARD", "Deployments",
        "Expand and contract: add columns in a backwards-compatible migration, deploy code that writes both, backfill, switch reads, then drop the old column in a later release.",
        "Name the expand-and-contract pattern explicitly."],
      ["Tell me about an outage you helped resolve.", "EASY", "Behavioral",
        "A certificate expired on a Friday night. I renewed it, then we added expiry alerts 30 days out and automated renewal so it couldn't recur.",
        "Describe the follow-up that prevents recurrence."],
    ],
    strengths: ["Reliable deployment practices", "Security-minded with secrets", "Calm, structured incident handling", "Strong automation mindset"],
    weaknesses: ["Cost awareness not discussed", "Monitoring answers stay generic", "Limited Kubernetes depth"],
  },
  pm: {
    mode: "HR",
    questions: [
      ["Why do you want to work in product management?", "EASY", "Motivation",
        "I like talking to users and deciding what to build. As an engineer I kept asking why we built features, and leading our onboarding redesign showed me that's the work I enjoy most.",
        "Back it up with a product decision you influenced."],
      ["How would you prioritise three urgent requests from sales, support and engineering?", "MEDIUM", "Prioritisation",
        "Estimate reach, impact, confidence and effort for each, check them against this quarter's goals, and share the reasoning openly so every team knows where they stand and why.",
        "Name a framework such as RICE and say who makes the final call."],
      ["Tell me about a project that failed. What would you do differently?", "MEDIUM", "Behavioral",
        "A feature launched without analytics, so we couldn't tell if it worked. Next time I'd define success metrics and instrument them before building.",
        "Quantify the impact of the failure."],
      ["How would you measure the success of a new onboarding flow?", "MEDIUM", "Metrics",
        "Activation rate within the first week as the primary metric, time to first key action as a secondary one, and support tickets as a guardrail.",
        "Include a guardrail metric."],
      ["A key stakeholder disagrees with your roadmap. What do you do?", "HARD", "Stakeholders",
        "Meet one to one to understand their goals, show the data behind the plan, and look for a change that serves both. If we still disagree, agree who decides and commit.",
        "Show how you would disagree and commit."],
    ],
    strengths: ["Clear motivation for the role", "Customer-centred thinking", "Honest self-reflection", "Good stakeholder empathy"],
    weaknesses: ["No prioritisation framework named", "Impact is not quantified", "Metrics lack guardrails"],
  },
  design: {
    mode: "HR",
    questions: [
      ["Walk me through a design project you're proud of.", "EASY", "Portfolio",
        "I redesigned a scheduling flow from seven steps to three. Research showed users abandoned at the time-zone step, so we inferred it automatically. Completion rose by a fifth.",
        "Lead with the problem and finish with the result."],
      ["How do you handle feedback you disagree with?", "MEDIUM", "Collaboration",
        "I ask what problem the feedback is solving, then test both options if it matters. If it's taste, I defer to the owner and move on.",
        "Separate taste from evidence."],
      ["How do you decide between two competing design directions?", "MEDIUM", "Process",
        "Tie them back to the goal, prototype the riskiest parts of each, and test with five users. The data usually makes the choice obvious.",
        "Mention testing with real users."],
      ["How do you work with engineers during implementation?", "EASY", "Collaboration",
        "I share designs early, annotate states and edge cases, and pair on the trickiest interactions. I review builds in staging rather than waiting for a final handoff.",
        "Cover empty, error and loading states."],
    ],
    strengths: ["Strong research grounding", "Collaborative with engineering", "Clear storytelling"],
    weaknesses: ["Accessibility rarely mentioned", "Few measurable outcomes", "Design system thinking is thin"],
  },
} satisfies Record<string, Track>;

export type TrackKey = keyof typeof TRACKS;

/** Candidate user names; the first two keep the original seed emails. */
export const CANDIDATE_NAMES = [
  "Aarav Sharma", "Meera Iyer", "Ishaan Verma", "Ananya Rao", "Kabir Malhotra", "Diya Menon",
  "Arjun Reddy", "Saanvi Kulkarni", "Vihaan Chopra", "Kavya Pillai", "Reyansh Bhatt", "Tara Desai",
  "Advait Joshi", "Nisha Banerjee", "Rahul Ghosh", "Zara Siddiqui", "Om Prakash", "Leela Fernandes",
];

/** People invited by email who never signed up. */
export const INVITEE_NAMES = [
  "Kabir Singh", "Pooja Hegde", "Siddharth Jain", "Riya Kapoor", "Aditya Nair", "Fatima Shaikh",
  "Manav Gupta", "Sana Mirza", "Dev Patel", "Isha Agarwal", "Yash Thakur", "Priyanka Das",
];
