import { db } from "./db.js";
import { projects, skills, experiences, profile } from "../shared/schema.js";
import { log } from "./index.js";

export async function seedDatabase() {
  const existingProjects = await db.select().from(projects).limit(1);
  if (existingProjects.length > 0) {
    log("Database already seeded, skipping...");
    return;
  }

  log("Seeding database...");

  await db.insert(projects).values([
    {
      title: {
        pt: "Internal Ticket Manager",
        en: "Internal Ticket Manager",
      },
      slug: "internal-ticket-manager",
      description: {
        pt: "Sistema completo de helpdesk com quadro Kanban, gerenciamento robusto de estado e controle de acesso baseado em papéis. Projetado para otimizar fluxos de trabalho de suporte interno.",
        en: "Complete helpdesk system with Kanban board, robust state management and role-based access control. Designed to optimize internal support workflows.",
      },
      content: {
        pt: "O Internal Ticket Manager é um sistema de helpdesk completo projetado para equipes internas. O projeto foi construído do zero com foco em uma arquitetura limpa e escalável.\n\nO sistema inclui um quadro Kanban interativo para visualização de tickets, permitindo arrastar e soltar entre colunas. A autenticação é baseada em papéis (Admin, Agente, Usuário), garantindo que cada tipo de usuário tenha acesso apenas às funcionalidades pertinentes.\n\nFeatures principais:\n- Quadro Kanban com drag-and-drop\n- Sistema de autenticação com controle de papéis\n- Dashboard com métricas em tempo real\n- Notificações em tempo real via WebSocket\n- Filtros avançados e busca\n- Histórico completo de ações por ticket\n\nO backend foi construído com Node.js e TypeScript, usando Drizzle ORM para interação com o banco de dados. O frontend utiliza React com gerenciamento de estado eficiente. Todo o sistema roda em containers Docker com Nginx como proxy reverso.",
        en: "The Internal Ticket Manager is a full-featured helpdesk system designed for internal teams. The project was built from scratch with a focus on clean and scalable architecture.\n\nThe system includes an interactive Kanban board for ticket visualization, supporting drag-and-drop between columns. Authentication is role-based (Admin, Agent, User), ensuring each user type has access only to relevant features.\n\nKey features:\n- Drag-and-drop Kanban board\n- Role-based authentication system\n- Real-time metrics dashboard\n- Real-time notifications via WebSocket\n- Advanced filters and search\n- Complete ticket action history\n\nThe backend was built with Node.js and TypeScript, using Drizzle ORM for database interaction. The frontend uses React with efficient state management. The entire system runs in Docker containers with Nginx as a reverse proxy.",
      },
      imageUrls: [],
      githubUrl: null,
      liveUrl: null,
      techStack: ["Node.js", "TypeScript", "React", "Drizzle ORM", "Docker", "Nginx"],
      featured: true,
    },
    {
      title: {
        pt: "ERP Backend Architecture",
        en: "ERP Backend Architecture",
      },
      slug: "erp-backend-architecture",
      description: {
        pt: "Manutenção e evolução de um sistema ERP robusto. Desenvolvimento de features complexas de back-end, relatórios RDLC customizados e queries SQL altamente otimizadas.",
        en: "Maintenance and evolution of a robust ERP system. Development of complex back-end features, custom RDLC reports and highly optimized SQL queries.",
      },
      content: {
        pt: "Projeto de manutenção e modernização de um sistema ERP (Enterprise Resource Planning) de larga escala, demonstrando domínio profundo do ecossistema Microsoft.\n\nResponsabilidades incluíram o desenvolvimento de funcionalidades complexas no back-end, criação de relatórios RDLC customizados para diferentes áreas de negócio, e otimização intensiva de queries SQL para melhorar a performance do sistema.\n\nDestaques técnicos:\n- Arquitetura backend robusta com C# e .NET\n- Migração gradual de módulos VB.NET para C#\n- Relatórios RDLC complexos com sub-relatórios e parâmetros dinâmicos\n- Otimização de queries SQL com redução de até 80% no tempo de execução\n- Implementação de Entity Framework para novos módulos\n- Integração com APIs externas de fornecedores",
        en: "Maintenance and modernization project for a large-scale ERP (Enterprise Resource Planning) system, demonstrating deep expertise in the Microsoft ecosystem.\n\nResponsibilities included developing complex back-end features, creating custom RDLC reports for different business areas, and intensive SQL query optimization to improve system performance.\n\nKey highlights:\n- Robust backend architecture with C# and .NET\n- Gradual migration of VB.NET modules to C#\n- Complex RDLC reports with sub-reports and dynamic parameters\n- SQL query optimization with up to 80% reduction in execution time\n- Entity Framework implementation for new modules\n- Integration with external vendor APIs",
      },
      imageUrls: [],
      githubUrl: null,
      liveUrl: null,
      techStack: ["C#", "VB.NET", "ASP.NET Web Forms", "Entity Framework", "SQL Server", "RDLC"],
      featured: true,
    },
    {
      title: {
        pt: "Paperless API",
        en: "Paperless API",
      },
      slug: "paperless-api",
      description: {
        pt: "API RESTful completa construída com C# e .NET para digitalizar completamente fluxos de trabalho de escritório e eliminar o uso de papel. Inovação sustentável com automação end-to-end.",
        en: "Complete RESTful API built with C# and .NET to fully digitize office workflows and eliminate paper usage. Sustainable innovation with end-to-end automation.",
      },
      content: {
        pt: "A Paperless API é uma solução completa de backend desenvolvida para digitalizar processos de escritório que antes dependiam de papel, promovendo sustentabilidade e eficiência operacional.\n\nO projeto foi concebido como uma API RESTful robusta que automatiza processos de ponta a ponta, desde a criação de documentos até sua aprovação e arquivamento digital.\n\nFeatures principais:\n- API RESTful completa com documentação Swagger\n- Sistema de workflows automatizados para aprovação de documentos\n- Integração com SQL Server para relatórios e analytics\n- Sistema de notificações para pendências\n- Assinatura digital de documentos\n\nO impacto do projeto foi significativo: redução de 90% no uso de papel do escritório, diminuição do tempo de aprovação de documentos em 60%, e melhoria na rastreabilidade de processos.",
        en: "The Paperless API is a complete backend solution developed to digitize office processes that previously relied on paper, promoting sustainability and operational efficiency.\n\nThe project was conceived as a robust RESTful API that automates end-to-end processes, from document creation to digital approval and archiving.\n\nKey features:\n- Complete RESTful API with Swagger documentation\n- Automated workflow system for document approval\n- SQL Server integration for reporting and analytics\n- Notification system for pending items\n- Digital document signing\n\nThe project had a significant impact: 90% reduction in office paper usage, 60% decrease in document approval time, and improved process traceability.",
      },
      imageUrls: [],
      githubUrl: null,
      liveUrl: null,
      techStack: ["C#", ".NET", "SQL Server", "REST API", "Swagger"],
      featured: true,
    },
  ]);


  await db.insert(skills).values([
    { name: "React", category: "Frontend", proficiency: 90 },
    { name: "TypeScript", category: "Frontend", proficiency: 92 },
    { name: "Tailwind CSS", category: "Frontend", proficiency: 88 },
    { name: "HTML/CSS", category: "Frontend", proficiency: 95 },
    { name: "JavaScript", category: "Frontend", proficiency: 93 },
    { name: "Next.js", category: "Frontend", proficiency: 75 },
    { name: "Node.js", category: "Backend", proficiency: 88 },
    { name: "C#", category: "Backend", proficiency: 85 },
    { name: ".NET", category: "Backend", proficiency: 83 },
    { name: "PostgreSQL", category: "Backend", proficiency: 82 },
    { name: "SQL Server", category: "Backend", proficiency: 80 },
    { name: "REST APIs", category: "Backend", proficiency: 90 },
    { name: "Docker", category: "DevOps", proficiency: 78 },
    { name: "CI/CD", category: "DevOps", proficiency: 75 },
    { name: "Nginx", category: "DevOps", proficiency: 70 },
    { name: "Git", category: "Tools", proficiency: 90 },
    { name: "VS Code", category: "Tools", proficiency: 95 },
    { name: "Drizzle ORM", category: "Tools", proficiency: 82 },
  ]);

  await db.insert(experiences).values([
    {
      company: "Empresa de Tecnologia",
      role: {
        pt: "Desenvolvedora Fullstack",
        en: "Fullstack Developer",
      },
      startDate: "Jan 2024",
      endDate: null,
      description: {
        pt: "Desenvolvimento e manutenção de aplicações web fullstack, implementando pipelines CI/CD, APIs escaláveis e interfaces responsivas.",
        en: "Development and maintenance of fullstack web applications, implementing CI/CD pipelines, scalable APIs and responsive interfaces.",
      },
      achievements: {
        pt: "Implementação de sistema de tickets com Kanban e RBAC\nOtimização de queries SQL com redução de 80% no tempo de execução\nMigração de módulos legados VB.NET para C#\nAutomação de processos internos com redução de 90% no uso de papel",
        en: "Implemented ticket system with Kanban board and RBAC\nOptimized SQL queries reducing execution time by 80%\nMigrated legacy VB.NET modules to C#\nAutomated internal processes reducing paper usage by 90%",
      },
    },
    {
      company: "Empresa de Software ERP",
      role: {
        pt: "Desenvolvedora Backend",
        en: "Backend Developer",
      },
      startDate: "Jun 2023",
      endDate: "Dec 2023",
      description: {
        pt: "Manutenção e evolução de sistema ERP corporativo, desenvolvimento de features complexas de backend e relatórios customizados.",
        en: "Maintenance and evolution of corporate ERP system, developing complex backend features and custom reports.",
      },
      achievements: {
        pt: "Desenvolvimento de relatórios RDLC complexos\nIntegração com APIs externas de fornecedores\nImplementação de Entity Framework para novos módulos",
        en: "Developed complex RDLC reports\nIntegrated external vendor APIs\nImplemented Entity Framework for new modules",
      },
    },
    {
      company: "Universidade",
      role: {
        pt: "Bacharelado em Ciência da Computação",
        en: "Bachelor's Degree in Computer Science",
      },
      startDate: "Mar 2020",
      endDate: "Dec 2024",
      description: {
        pt: "Formação acadêmica em Ciência da Computação com foco em algoritmos, estruturas de dados, engenharia de software e desenvolvimento web.",
        en: "Academic education in Computer Science focused on algorithms, data structures, software engineering and web development.",
      },
      achievements: {
        pt: "Projetos acadêmicos em inteligência artificial e machine learning\nParticipação em hackathons e competições de programação\nMonitoria em disciplinas de programação",
        en: "Academic projects in artificial intelligence and machine learning\nParticipation in hackathons and programming competitions\nTeaching assistant in programming courses",
      },
    },
  ]);

  await db.insert(profile).values([
    {
      bio: {
        pt: "Desenvolvedora Fullstack e Cientista da Computação, movida por desafios, focada em elevar a qualidade de entregas e resolver gargalos operacionais. Possuo sólida experiência implementando pipelines CI/CD, APIs escaláveis e interfaces responsivas.",
        en: "Proactive Fullstack Developer and Computer Scientist driven by challenges, focused on elevating delivery quality and solving operational bottlenecks. I have strong experience implementing CI/CD pipelines, scalable APIs, and responsive interfaces.",
      },
    },
  ]);

  log("Database seeded successfully!");
}
