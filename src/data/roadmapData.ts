export interface RoadmapSubItem {
  id: string;
  text: string;
}

export interface RoadmapItem {
  id: string;
  text: string;
  isDsaLinked?: boolean;
  subitems?: RoadmapSubItem[];
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
      {
        id: "p1-dsa",
        text: "DSA foundations: linked to DSA Tracker",
        isDsaLinked: true,
        subitems: [
          { id: "p1-dsa-1", text: "Master asymptotic analysis: calculate time/space complexities of nested loops, recursive trees, and memoized pathways." },
          { id: "p1-dsa-2", text: "Study dynamic array doubling mechanisms: analyze amortized push operations and memory relocation limits." },
          { id: "p1-dsa-3", text: "Understand data structures memory footprint: compare contiguous allocation (arrays) vs pointer chaining (linked lists, trees)." }
        ]
      },
      {
        id: "p1-os",
        text: "OS: processes, threads, memory management, and deadlock",
        subitems: [
          { id: "p1-os-1", text: "Process Lifecycle & Context Switching: study Process Control Blocks (PCBs), process scheduling states, and state transition overheads." },
          { id: "p1-os-2", text: "CPU Scheduling Algorithms: understand Round Robin, Shortest Remaining Time First (SRTF), Priority scheduling, and multi-level feedback queues." },
          { id: "p1-os-3", text: "Virtual Memory & Paging: master Page Tables, translation buffers (TLB), page faults, thrashing, and page eviction rules (LRU, Clock, Optimal)." },
          { id: "p1-os-4", text: "Deadlocks: analyze Coffman conditions, Banker's algorithm for avoidance, detection techniques, and prevention protocols." }
        ]
      },
      {
        id: "p1-net",
        text: "Networking: TCP/IP, HTTP/HTTPS, and DNS internals",
        subitems: [
          { id: "p1-net-1", text: "TCP/IP Suite: deep dive into 3-way handshake, 4-way connection closure, sliding window mechanics, flow control vs congestion control." },
          { id: "p1-net-2", text: "HTTP Protocols: compare HTTP/1.1 (Keep-Alive, head-of-line blocking), HTTP/2 (binary framing, multiplexing), and HTTP/3 (QUIC, UDP congestion control)." },
          { id: "p1-net-3", text: "DNS Resolution: trace iterative vs recursive query paths, caching scopes, DNS record types (A, AAAA, CNAME, MX, TXT), and root server lookup steps." }
        ]
      },
      {
        id: "p1-db",
        text: "DBMS: indexing structure, normalization forms, and ACID transactions",
        subitems: [
          { id: "p1-db-1", text: "Indexing Internals: analyze why B+ Trees are optimized for disk systems and range scans compared to binary search trees or Hash tables." },
          { id: "p1-db-2", text: "Normalization Theory: study Normal Forms (1NF, 2NF, 3NF, BCNF), dependency preservation, and when denormalization is preferred for read speeds." },
          { id: "p1-db-3", text: "ACID & Concurrency: master ACID transactions implementation, Isolation levels (dirty read, non-repeatable read, phantom read), lock types (shared, exclusive, 2PL, MVCC)." }
        ]
      },
      {
        id: "p1-explain",
        text: "Can explain any topic above with zero notes in under 2 minutes",
        subitems: [
          { id: "p1-ex-1", text: "Perform Feynman Technique drills: describe a complex CS theory concept to a non-technical peer using simplified analogies." },
          { id: "p1-ex-2", text: "Practice whiteboarding system pathways: draw a network request flow (DNS to HTML render) or a page fault workflow without slides." }
        ]
      }
    ]
  },
  {
    id: "phase-2",
    title: "Phase 2 — Systems Thinking",
    subtitle: "Transition from coding syntax to architecture and system constraints.",
    items: [
      {
        id: "p2-schema",
        text: "Design a complex backend database schema from scratch, justifying all constraints",
        subitems: [
          { id: "p2-sch-1", text: "Design a relational schema for a collaborative system, establishing foreign keys, check constraints, indices, and audit logging tables." },
          { id: "p2-sch-2", text: "Determine partition strategies: evaluate horizontal partitioning (sharding) vs vertical partitioning on high-throughput columns." }
        ]
      },
      {
        id: "p2-arch",
        text: "Map out the system architecture of PingME or TuitionDesk, listing alternative setups considered",
        subitems: [
          { id: "p2-arc-1", text: "Real-time communication design: map WebSocket connections, long polling fallback routes, and message broadcasting components." },
          { id: "p2-arc-2", text: "Message broker integration: design message queues (RabbitMQ, Kafka) or lightweight Pub/Sub channels to decouple services." }
        ]
      },
      {
        id: "p2-scale",
        text: "Analyze load balancing strategies, caching layers, and horizontal vs vertical scaling trade-offs",
        subitems: [
          { id: "p2-sc-1", text: "Caching Strategies: study Cache-Aside, Write-Through, Write-Behind pathways, and select appropriate eviction policies (LRU, LFU)." },
          { id: "p2-sc-2", text: "Load Balancing: examine Layer 4 (TCP-level) vs Layer 7 (HTTP-application level) routers, and select load balancing algorithms (least-connections, round-robin, IP hash)." }
        ]
      },
      {
        id: "p2-dist",
        text: "Distributed systems core: CAP theorem, partition tolerance, and eventual consistency models",
        subitems: [
          { id: "p2-dst-1", text: "CAP Theorem vs PACELC Theorem: analyze trade-offs during network partitions and standard latency/consistency choices." },
          { id: "p2-dst-2", text: "Distributed Consensus: study Leader election algorithms, Raft consensus stages, log replication, and Gossip protocols." }
        ]
      },
      {
        id: "p2-source1",
        text: "Read through React internals or Express internals source code directories",
        subitems: [
          { id: "p2-src1-1", text: "Express Internals: read the router directory to understand middleware stacking, path parsing, and the callback loop execution." },
          { id: "p2-src1-2", text: "React Internals: read the Fiber architecture documentation to understand reconciliation, scheduling priorities, and virtual DOM diffing logic." }
        ]
      },
      {
        id: "p2-source2",
        text: "Examine a second production-grade open source repository to understand structural layout",
        subitems: [
          { id: "p2-src2-1", text: "Audit file layout systems: check modular layouts, layer decoupling, interface files structure, and continuous integration workflow definitions." }
        ]
      }
    ]
  },
  {
    id: "phase-3",
    title: "Phase 3 — Applied Depth",
    subtitle: "Pick a technical lane and build proof-of-concept integrations.",
    items: [
      {
        id: "p3-lane",
        text: "Choose a specialization: Machine Learning or Full-Stack Web Systems",
        subitems: [
          { id: "p3-ln-1", text: "ML Pathway: acquire linear algebra foundations (matrices, eigendecomposition, SVD) and multivariate calculus (partial derivatives, gradients)." },
          { id: "p3-ln-2", text: "Full-Stack Pathway: study system boundaries design, clean architecture rules, test-driven development (TDD), and continuous integration pipelines." }
        ]
      },
      {
        id: "p3-ml",
        text: "ML: study linear algebra & probability, then implement one core algorithm entirely from scratch",
        subitems: [
          { id: "p3-m-1", text: "Code mathematical algorithms: build Linear/Logistic Regression, K-Means Clustering, or a basic Neural Network forward/backward pass using raw matrix math (no high-level libraries)." }
        ]
      },
      {
        id: "p3-fs",
        text: "Full-Stack: add a cache layer, unit tests, and automated CI/CD pipelines to a live product",
        subitems: [
          { id: "p3-f-1", text: "Deploy Redis cache servers for expensive query routes, measure response speed improvements, and handle cache invalidation on write events." },
          { id: "p3-f-2", text: "Configure test suites: write unit tests using frameworks (Jest, Mocha) and integration tests (Cypress, Playwright) validating core routes." }
        ]
      },
      {
        id: "p3-improve",
        text: "Ship one measurable performance improvement or feature to PingME, TuitionDesk, or CalcSaathi",
        subitems: [
          { id: "p3-imp-1", text: "Configure automatic testing workflows: set up GitHub Actions pipelines to lint, typecheck, compile, and run test suites on push triggers." },
          { id: "p3-imp-2", text: "Execute query optimizations: analyze DB query times, create database indexes, write clean SQL joins, and configure database connection pooling." }
        ]
      },
      {
        id: "p3-writeup",
        text: "Write a comprehensive deep-dive document describing what you built, how, and why (not just what)",
        subitems: [
          { id: "p3-wr-1", text: "Document technical details: write Architectural Decision Records (ADRs) explaining system trade-offs, scaling limits, data flow diagrams, and baseline metrics." }
        ]
      }
    ]
  },
  {
    id: "phase-4",
    title: "Phase 4 — Proof of Work",
    subtitle: "Demonstrate capabilities to external platforms and industry benchmarks.",
    items: [
      {
        id: "p4-contests",
        text: "Codeforces or CodeChef: participate in regular scheduled contests",
        subitems: [
          { id: "p4-con-1", text: "Simulate competition environments: participate in Weekly contests under strict time limits to build coding speed and debugging accuracy." },
          { id: "p4-con-2", text: "Review submissions: check other candidates' code after contests to discover faster logical transitions or cleaner implementation approaches." }
        ]
      },
      {
        id: "p4-rating",
        text: "Reach your targeted competitive programming rating milestone and log details",
        subitems: [
          { id: "p4-rat-1", text: "Log rating progressions, identify pattern clusters that cause contest failures, and update your Spaced Repetition lists with those patterns." }
        ]
      },
      {
        id: "p4-resume",
        text: "Refine resume and GitHub profiles to reflect your strongest 3-4 engineering projects",
        subitems: [
          { id: "p4-res-1", text: "Resume engineering: write clear experience bullet points using the STAR method (Situation, Task, Action, Result) highlighting technical metrics." },
          { id: "p4-res-2", text: "GitHub audit: write comprehensive README profiles, create high-quality demo clips, verify clean commit logs, and deploy active web applications." }
        ]
      },
      {
        id: "p4-mock",
        text: "Complete a mock interview combining DSA, system design, and computer science theory",
        subitems: [
          { id: "p4-mck-1", text: "Conduct simulated technical mock interviews covering live coding, algorithmic derivations, system architecture mapping, and OS/DB theory questions." }
        ]
      }
    ]
  }
];
