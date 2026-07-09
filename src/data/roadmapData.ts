export interface RoadmapItem {
  id: string;
  text: string;
  isDsaLinked?: boolean;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  subtitle: string;
  items: RoadmapItem[];
}

export const roadmapData: RoadmapPhase[] = [
  {
    id: "phase-1",
    title: "Phase 1 — Foundation Repair",
    subtitle: "Consolidate core computer science foundations and problem solving basics.",
    items: [
      { id: "p1-dsa", text: "DSA foundations: linked to DSA Tracker", isDsaLinked: true },
      { id: "p1-os", text: "OS: processes, threads, memory management, and deadlock" },
      { id: "p1-net", text: "Networking: TCP/IP, HTTP/HTTPS, and DNS internals" },
      { id: "p1-db", text: "DBMS: indexing structure, normalization forms, and ACID transactions" },
      { id: "p1-explain", text: "Can explain any topic above with zero notes in under 2 minutes" }
    ]
  },
  {
    id: "phase-2",
    title: "Phase 2 — Systems Thinking",
    subtitle: "Transition from coding syntax to architecture and system constraints.",
    items: [
      { id: "p2-schema", text: "Design a complex backend database schema from scratch, justifying all constraints" },
      { id: "p2-arch", text: "Map out the system architecture of PingME or TuitionDesk, listing alternative setups considered" },
      { id: "p2-scale", text: "Analyze load balancing strategies, caching layers, and horizontal vs vertical scaling trade-offs" },
      { id: "p2-dist", text: "Distributed systems core: CAP theorem, partition tolerance, and eventual consistency models" },
      { id: "p2-source1", text: "Read through React internals or Express internals source code directories" },
      { id: "p2-source2", text: "Examine a second production-grade open source repository to understand structural layout" }
    ]
  },
  {
    id: "phase-3",
    title: "Phase 3 — Applied Depth",
    subtitle: "Pick a technical lane and build proof-of-concept integrations.",
    items: [
      { id: "p3-lane", text: "Choose a specialization: Machine Learning or Full-Stack Web Systems" },
      { id: "p3-ml", text: "ML: study linear algebra & probability, then implement one core algorithm entirely from scratch" },
      { id: "p3-fs", text: "Full-Stack: add a cache layer, unit tests, and automated CI/CD pipelines to a live product" },
      { id: "p3-improve", text: "Ship one measurable performance improvement or feature to PingME, TuitionDesk, or CalcSaathi" },
      { id: "p3-writeup", text: "Write a comprehensive deep-dive document describing what you built, how, and why (not just what)" }
    ]
  },
  {
    id: "phase-4",
    title: "Phase 4 — Proof of Work",
    subtitle: "Demonstrate capabilities to external platforms and industry benchmarks.",
    items: [
      { id: "p4-contests", text: "Codeforces or CodeChef: participate in regular scheduled contests" },
      { id: "p4-rating", text: "Reach your targeted competitive programming rating milestone and log details" },
      { id: "p4-resume", text: "Refine resume and GitHub profiles to reflect your strongest 3-4 engineering projects" },
      { id: "p4-mock", text: "Complete a mock interview combining DSA, system design, and computer science theory" }
    ]
  }
];
