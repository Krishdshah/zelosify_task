import prisma from "../config/prisma/prisma.js";

/**
 * Seeds the database with sample job openings for testing purposes.
 */
async function seedOpenings() {
  try {
    console.log("🌱 Seeding openings data...");

    // 1. Create or update the target tenant: Bruce Wayne Corp
    const tenantId = "b78e2448-f1c5-4a62-9e8a-49340989b52a";
    const tenant = await prisma.tenants.upsert({
      where: { tenantId },
      update: { companyName: "Bruce Wayne Corp" },
      create: {
        tenantId,
        companyName: "Bruce Wayne Corp",
      },
    });

    console.log(`✅ Tenant loaded: ${tenant.companyName} (${tenant.tenantId})`);

    // Default hiring manager ID (can be updated or mapped to a real user during testing)
    const defaultHiringManagerId = "default-hiring-manager-id";

    // 2. Define 12 diverse job openings
    const openingsData = [
      {
        id: "opening-001",
        title: "Senior Fullstack Engineer (React/Node)",
        description: "Looking for an expert developer to design scalable web architectures for Wayne Enterprises.",
        location: "Gotham City",
        contractType: "Contract",
        hiringManagerId: defaultHiringManagerId,
        experienceMin: 5,
        experienceMax: 9,
      },
      {
        id: "opening-002",
        title: "Cloud Infrastructure Architect (AWS)",
        description: "Orchestrate and optimize secure multi-tenant cloud networks and compute clusters.",
        location: "Remote",
        contractType: "Contract",
        hiringManagerId: defaultHiringManagerId,
        experienceMin: 7,
        experienceMax: 12,
      },
      {
        id: "opening-003",
        title: "AI/ML Research Scientist",
        description: "Design computer vision models and generative algorithms for vehicle navigation systems.",
        location: "Gotham City",
        contractType: "Full-Time",
        hiringManagerId: defaultHiringManagerId,
        experienceMin: 5,
        experienceMax: 10,
      },
      {
        id: "opening-004",
        title: "Cybersecurity Incident Responder",
        description: "Defend local networks against advanced persistent threat actors and secure S3 storage pipelines.",
        location: "Gotham City",
        contractType: "Contract",
        hiringManagerId: defaultHiringManagerId,
        experienceMin: 4,
        experienceMax: 8,
      },
      {
        id: "opening-005",
        title: "Junior Frontend Engineer (Next.js)",
        description: "Help build the next generation of Wayne Corp's supplier portals using Next.js and Tailwind CSS.",
        location: "Remote",
        contractType: "Contract",
        hiringManagerId: defaultHiringManagerId,
        experienceMin: 1,
        experienceMax: 3,
      },
      {
        id: "opening-006",
        title: "Database Administrator (PostgreSQL)",
        description: "Maintain, optimize index layouts, and ensure replication integrity across high-load Postgres clusters.",
        location: "Gotham City",
        contractType: "Full-Time",
        hiringManagerId: defaultHiringManagerId,
        experienceMin: 4,
        experienceMax: 7,
      },
      {
        id: "opening-007",
        title: "QA Automation Engineer (Cypress/Playwright)",
        description: "Establish regression testing suites and E2E automation pipelines for tenant security validation.",
        location: "Remote",
        contractType: "Contract",
        hiringManagerId: defaultHiringManagerId,
        experienceMin: 3,
        experienceMax: 6,
      },
      {
        id: "opening-008",
        title: "Lead DevOps Engineer (Kubernetes)",
        description: "Manage GitOps workflows, Docker registry integration, and service mesh structures.",
        location: "Remote",
        contractType: "Contract",
        hiringManagerId: defaultHiringManagerId,
        experienceMin: 6,
        experienceMax: 10,
      },
      {
        id: "opening-009",
        title: "Senior Product Manager",
        description: "Direct the roadmap for the Bruce Wayne Corp contract vendor placement tool module.",
        location: "Gotham City",
        contractType: "Full-Time",
        hiringManagerId: defaultHiringManagerId,
        experienceMin: 5,
        experienceMax: 8,
      },
      {
        id: "opening-010",
        title: "Data Analyst & Report Specialist",
        description: "Structure complex SQL reporting metrics and coordinate telemetry dashboard charts.",
        location: "Remote",
        contractType: "Contract",
        hiringManagerId: defaultHiringManagerId,
        experienceMin: 2,
        experienceMax: 5,
      },
      {
        id: "opening-011",
        title: "Embedded Systems Software Engineer",
        description: "Write low-level firmware in C/C++ for hardware telemetry devices and field operations.",
        location: "Gotham City",
        contractType: "Full-Time",
        hiringManagerId: defaultHiringManagerId,
        experienceMin: 5,
        experienceMax: null,
      },
      {
        id: "opening-012",
        title: "Technical Content & Documentation Writer",
        description: "Author precise architectural workflow guides, API schema documents, and developer manuals.",
        location: "Remote",
        contractType: "Contract",
        hiringManagerId: defaultHiringManagerId,
        experienceMin: 1,
        experienceMax: 4,
      },
    ];

    // 3. Upsert openings to ensure idempotence
    for (const opening of openingsData) {
      await prisma.opening.upsert({
        where: { id: opening.id },
        update: {
          title: opening.title,
          description: opening.description,
          location: opening.location,
          contractType: opening.contractType,
          hiringManagerId: opening.hiringManagerId,
          experienceMin: opening.experienceMin,
          experienceMax: opening.experienceMax,
          tenantId,
        },
        create: {
          id: opening.id,
          title: opening.title,
          description: opening.description,
          location: opening.location,
          contractType: opening.contractType,
          hiringManagerId: opening.hiringManagerId,
          experienceMin: opening.experienceMin,
          experienceMax: opening.experienceMax,
          tenantId,
        },
      });
    }

    console.log("✅ Seeded 12 openings successfully under 'Bruce Wayne Corp' tenant!");
  } catch (error) {
    console.error("❌ Error seeding openings:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedOpenings();
