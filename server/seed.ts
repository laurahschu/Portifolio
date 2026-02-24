import { db } from "./db";
import { projects, skills, experiences } from "@shared/schema";
import { log } from "./index";

export async function seedDatabase() {
  const existingProjects = await db.select().from(projects).limit(1);
  if (existingProjects.length > 0) {
    log("Database already seeded, skipping...");
    return;
  }

  log("Seeding database...");

  await db.insert(projects).values([
    {
      title: "Internal Ticket Manager",
      slug: "internal-ticket-manager",
      description: "Sistema completo de helpdesk com quadro Kanban, gerenciamento robusto de estado e controle de acesso baseado em papéis. Projetado para otimizar fluxos de trabalho de suporte interno.",
      content: "O Internal Ticket Manager é um sistema de helpdesk completo projetado para equipes internas. O projeto foi construído do zero com foco em uma arquitetura limpa e escalável.\n\nO sistema inclui um quadro Kanban interativo para visualização de tickets, permitindo arrastar e soltar entre colunas. A autenticação é baseada em papéis (Admin, Agente, Usuário), garantindo que cada tipo de usuário tenha acesso apenas às funcionalidades pertinentes.\n\nFeatures principais:\n- Quadro Kanban com drag-and-drop\n- Sistema de autenticação com controle de papéis\n- Dashboard com métricas em tempo real\n- Notificações em tempo real via WebSocket\n- Filtros avançados e busca\n- Histórico completo de ações por ticket\n\nO backend foi construído com Node.js e TypeScript, usando Drizzle ORM para interação com o banco de dados. O frontend utiliza React com gerenciamento de estado eficiente. Todo o sistema roda em containers Docker com Nginx como proxy reverso.",
      imageUrl: null,
      githubUrl: null,
      liveUrl: null,
      techStack: ["Node.js", "TypeScript", "React", "Drizzle ORM", "Docker", "Nginx"],
      featured: true,
    },
    {
      title: "ERP Backend Architecture",
      slug: "erp-backend-architecture",
      description: "Manutenção e evolução de um sistema ERP robusto. Desenvolvimento de features complexas de back-end, relatórios RDLC customizados e queries SQL altamente otimizadas.",
      content: "Projeto de manutenção e modernização de um sistema ERP (Enterprise Resource Planning) de larga escala, demonstrando domínio profundo do ecossistema Microsoft.\n\nResponsabilidades incluíram o desenvolvimento de funcionalidades complexas no back-end, criação de relatórios RDLC customizados para diferentes áreas de negócio, e otimização intensiva de queries SQL para melhorar a performance do sistema.\n\nDestaques técnicos:\n- Arquitetura backend robusta com C# e .NET\n- Migração gradual de módulos VB.NET para C#\n- Relatórios RDLC complexos com sub-relatórios e parâmetros dinâmicos\n- Otimização de queries SQL com redução de até 80% no tempo de execução\n- Implementação de Entity Framework para novos módulos\n- Integração com APIs externas de fornecedores\n\nO projeto demonstra capacidade de trabalhar com sistemas legados de grande porte, entender código existente rapidamente e implementar melhorias significativas mantendo a estabilidade do sistema.",
      imageUrl: null,
      githubUrl: null,
      liveUrl: null,
      techStack: ["C#", "VB.NET", "ASP.NET Web Forms", "Entity Framework", "SQL Server", "RDLC"],
      featured: true,
    },
    {
      title: "Paperless API",
      slug: "paperless-api",
      description: "API RESTful completa construída com C# e .NET para digitalizar completamente fluxos de trabalho de escritório e eliminar o uso de papel. Inovação sustentável com automação end-to-end.",
      content: "A Paperless API é uma solução completa de backend desenvolvida para digitalizar processos de escritório que antes dependiam de papel, promovendo sustentabilidade e eficiência operacional.\n\nO projeto foi concebido como uma API RESTful robusta que automatiza processos de ponta a ponta, desde a criação de documentos até sua aprovação e arquivamento digital.\n\nFeatures principais:\n- API RESTful completa com documentação Swagger\n- Sistema de workflows automatizados para aprovação de documentos\n- Integração com SQL Server para relatórios e analytics\n- Prototipagem rápida para validação com stakeholders\n- Sistema de notificações para pendências\n- Assinatura digital de documentos\n\nO impacto do projeto foi significativo: redução de 90% no uso de papel do escritório, diminuição do tempo de aprovação de documentos em 60%, e melhoria na rastreabilidade de processos.\n\nDemonstra habilidades em arquitetura de backend, automação de processos de negócio e inovação orientada a resultados.",
      imageUrl: null,
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
      role: "Desenvolvedora Fullstack",
      startDate: "Jan 2024",
      endDate: null,
      description: "Desenvolvimento e manutenção de aplicações web fullstack, implementando pipelines CI/CD, APIs escaláveis e interfaces responsivas.",
      achievements: [
        "Implementação de sistema de tickets com Kanban e RBAC",
        "Otimização de queries SQL com redução de 80% no tempo de execução",
        "Migração de módulos legados VB.NET para C#",
        "Automação de processos internos com redução de 90% no uso de papel",
      ],
    },
    {
      company: "Empresa de Software ERP",
      role: "Desenvolvedora Backend",
      startDate: "Jun 2023",
      endDate: "Dec 2023",
      description: "Manutenção e evolução de sistema ERP corporativo, desenvolvimento de features complexas de backend e relatórios customizados.",
      achievements: [
        "Desenvolvimento de relatórios RDLC complexos",
        "Integração com APIs externas de fornecedores",
        "Implementação de Entity Framework para novos módulos",
      ],
    },
    {
      company: "Universidade",
      role: "Bacharelado em Ciência da Computação",
      startDate: "Mar 2020",
      endDate: "Dec 2024",
      description: "Formação acadêmica em Ciência da Computação com foco em algoritmos, estruturas de dados, engenharia de software e desenvolvimento web.",
      achievements: [
        "Projetos acadêmicos em inteligência artificial e machine learning",
        "Participação em hackathons e competições de programação",
        "Monitoria em disciplinas de programação",
      ],
    },
  ]);

  log("Database seeded successfully!");
}
