/** Versões em inglês e espanhol dos dados do currículo. O português vive em data/profile.ts. */
import {
  DOSSIER,
  EXPERIENCES,
  FLEET_SYSTEMS,
  PROFILE,
  PROJECTS,
  type DossierRow,
  type Experience,
  type FleetSystem,
  type Project,
} from '../data/profile';
import { SIDES, type SideId } from '../data/sides';
import { sideCopy } from './sideCopy';
import type { Lang } from './messages';

export interface LocalizedProfile {
  role: string;
  pitch: string;
  availability: string;
  bio: string[];
  quote: string;
}

const PROFILE_I18N: Record<Exclude<Lang, 'pt'>, LocalizedProfile> = {
  en: {
    role: '.NET Full Stack Developer',
    pitch: 'C#, ASP.NET Core and Angular in corporate systems since 2022. Today, Node.js, Next.js and AI agents.',
    availability: 'on-site, hybrid or remote · open to relocation',
    bio: [
      '.NET Full Stack Developer focused on C#, ASP.NET Core and Angular. Working on corporate systems since 2022: REST APIs with JWT authentication and role-based authorization, Entity Framework with MySQL, Clean Architecture (Repository, Unit of Work, dependency injection), Angular 19 frontends and unit and integration tests with xUnit.',
      'Today I build an omnichannel platform in Node.js and Next.js, with PostgreSQL, Redis and AI agents. I use AI tools to support development, validating every suggestion with documentation, execution and tests.',
    ],
    quote: 'The power of code lies in whoever controls it.',
  },
  es: {
    role: 'Desarrollador Full Stack .NET',
    pitch: 'C#, ASP.NET Core y Angular en sistemas corporativos desde 2022. Hoy, Node.js, Next.js y agentes de IA.',
    availability: 'presencial, híbrido o remoto · dispuesto a mudarse',
    bio: [
      'Desarrollador Full Stack .NET enfocado en C#, ASP.NET Core y Angular. Trabajo en sistemas corporativos desde 2022: APIs REST con autenticación JWT y autorización por rol, Entity Framework con MySQL, Clean Architecture (Repository, Unit of Work, inyección de dependencias), frontend en Angular 19 y pruebas unitarias y de integración con xUnit.',
      'Hoy desarrollo una plataforma omnicanal en Node.js y Next.js, con PostgreSQL, Redis y agentes de IA. Uso herramientas de IA como apoyo al desarrollo, validando cada sugerencia con documentación, ejecución y pruebas.',
    ],
    quote: 'El poder del código está en quien lo controla.',
  },
};

const DOSSIER_I18N: Record<Exclude<Lang, 'pt'>, DossierRow[]> = {
  en: [
    { k: 'Education', v: 'B.Sc. in Information Systems', s: 'PUC Minas · in progress · expected Dec 2027' },
    { k: 'Certifications', v: '.NET 6: building a Web API · Node.js: REST API with Express and MongoDB', s: 'Alura · 2024–2025' },
    { k: 'Languages', v: 'Native Portuguese · Advanced Spanish · Intermediate English', s: 'team communication and documentation' },
    { k: 'Base', v: PROFILE.location, s: PROFILE_I18N.en.availability },
    { k: 'In the field since', v: String(PROFILE.since), s: '.NET and Node.js corporate systems' },
  ],
  es: [
    { k: 'Formación', v: 'Grado en Sistemas de Información', s: 'PUC Minas · en curso · previsto dic 2027' },
    { k: 'Certificaciones', v: '.NET 6: creando una Web API · Node.js: API REST con Express y MongoDB', s: 'Alura · 2024–2025' },
    { k: 'Idiomas', v: 'Portugués nativo · Español avanzado · Inglés intermedio', s: 'comunicación con equipos y documentación' },
    { k: 'Base', v: PROFILE.location, s: PROFILE_I18N.es.availability },
    { k: 'En campo desde', v: String(PROFILE.since), s: 'sistemas corporativos .NET y Node.js' },
  ],
};

type ExperienceText = Pick<Experience, 'period' | 'role' | 'location' | 'duration' | 'type' | 'summary' | 'highlights'>;

/** Na mesma ordem de EXPERIENCES. */
const EXPERIENCES_I18N: Record<Exclude<Lang, 'pt'>, ExperienceText[]> = {
  en: [
    {
      period: 'May 2026 – present',
      role: 'Full Stack Developer',
      location: 'Belo Horizonte, MG',
      duration: 'on-site',
      type: 'Current',
      summary:
        "Omni, the company's own omnichannel platform: support, sales and collections (WhatsApp, e-mail, SMS and voice) in a single system, in Node.js and Next.js, handling about 800 conversations a day.",
      highlights: [
        'Visual no-code editor for chatbot flows — message, condition, integration, database and AI blocks — with versioning and a node-by-node simulator.',
        'AI agent for credit negotiation on WhatsApp: queries partners, simulates terms with real data, negotiates installments and hands over to a human when needed.',
        'Integrations with financial institutions wrapped as reusable tools, used by the agent through tool calling.',
        'Real-time support with Socket.io, multichannel campaigns, dashboards and auditing aligned with the Brazilian data protection law (LGPD).',
      ],
    },
    {
      period: 'Nov 2025 – Mar 2026',
      role: 'Full Stack Developer',
      location: 'Remote',
      duration: '5 months',
      type: 'Full-time',
      summary: 'Maintenance and evolution of legacy legal systems in ASP and development of new screens in the C# MVC pattern.',
      highlights: [
        '.NET bots for collecting and processing legal publications: cases, proceedings, phases and batches in MySQL.',
        'Batch submissions to a REST API authenticated by Bearer Token, with serialized JSON and configurable parameters — around 5,000 batches a day.',
        'Results in JSONL and spreadsheet export with ClosedXML; SQL query investigation and date handling.',
      ],
    },
    {
      period: 'Apr 2025 – Nov 2025',
      role: 'Full Stack Developer',
      location: 'Contagem, MG',
      duration: '8 months',
      type: 'On-site',
      summary: '.NET backend and Angular frontend for internal corporate systems, following Clean Architecture (Domain, Application, Infrastructure).',
      highlights: [
        'Over 20 REST endpoints in C#/ASP.NET Core with pagination, filters and sorting; JWT and role-based authorization integrated with ngx-permissions.',
        'Shared cache with invalidation after writes; integration between 3 APIs via RabbitMQ; .NET and Hangfire workers for background tasks.',
        'Over 20 Angular 19 screens (standalone components, Signals, Angular Material) with internationalization via ngx-translate.',
        'Unit and integration tests with xUnit, TDD on part of the features and structured logging with Serilog/Seq.',
      ],
    },
    {
      period: 'May 2024 – Apr 2025',
      role: 'Systems Development Analyst',
      location: 'Belo Horizonte, MG',
      duration: '1 year',
      type: 'On-site',
      summary: 'Development and maintenance of internal C#/.NET Framework (ASP.NET) applications integrated with an Oracle database.',
      highlights: [
        'Writing and optimizing Oracle SQL queries for business routines and data investigation.',
        'Automation of internal routines and administration of the company network with Mikrotik, alongside development.',
      ],
    },
    {
      period: 'Feb 2023 – Apr 2024',
      role: 'Freelance Developer',
      location: 'Remote',
      duration: '1 year and 3 months',
      type: 'Freelance',
      summary: 'Freelance web development for clients, alongside studies of C#/.NET and web development.',
    },
    {
      period: 'Nov 2022 – Jan 2023',
      role: 'Full Stack Developer Trainee',
      location: 'Belo Horizonte, MG',
      duration: '3 months',
      type: 'Hybrid',
      summary: 'Developing, testing and debugging features in software projects with the support of senior developers. First professional contact with C# and .NET.',
    },
  ],
  es: [
    {
      period: 'may 2026 – actual',
      role: 'Desarrollador Full Stack',
      location: 'Belo Horizonte, MG',
      duration: 'presencial',
      type: 'Actual',
      summary:
        'Omni, la plataforma omnicanal propia de la empresa: atención, ventas y cobranza (WhatsApp, e-mail, SMS y voz) en un único sistema, en Node.js y Next.js, con cerca de 800 atenciones al día.',
      highlights: [
        'Editor visual no-code de flujos de chatbot — bloques de mensajes, condiciones, integraciones, base de datos e IA — con versionado y simulador nodo a nodo.',
        'Agente de IA para negociación de crédito en WhatsApp: consulta socios, simula condiciones con datos reales, negocia cuotas y transfiere a un humano cuando hace falta.',
        'Integraciones con instituciones financieras encapsuladas como herramientas reutilizables, usadas por el agente vía tool calling.',
        'Atención en tiempo real con Socket.io, campañas multicanal, dashboards y auditoría alineada con la LGPD (ley brasileña de datos).',
      ],
    },
    {
      period: 'nov 2025 – mar 2026',
      role: 'Desarrollador Full Stack',
      location: 'Remoto',
      duration: '5 meses',
      type: 'Tiempo completo',
      summary: 'Mantenimiento y evolución de sistemas jurídicos heredados en ASP y desarrollo de nuevas pantallas con el patrón MVC en C#.',
      highlights: [
        'Robots en .NET para recolectar y procesar publicaciones jurídicas: procesos, trámites, fases y lotes en MySQL.',
        'Envío por lotes a una API REST autenticada con Bearer Token, con JSON serializado y parámetros configurables — cerca de 5.000 lotes al día.',
        'Resultados en JSONL y exportación a hojas de cálculo con ClosedXML; investigación de consultas SQL y manejo de fechas.',
      ],
    },
    {
      period: 'abr 2025 – nov 2025',
      role: 'Desarrollador Full Stack',
      location: 'Contagem, MG',
      duration: '8 meses',
      type: 'Presencial',
      summary: 'Backend .NET y frontend Angular en sistemas internos corporativos, siguiendo Clean Architecture (Domain, Application, Infrastructure).',
      highlights: [
        'Más de 20 endpoints REST en C#/ASP.NET Core con paginación, filtros y ordenamiento; JWT y autorización por rol integrados con ngx-permissions.',
        'Caché compartida con invalidación tras escrituras; integración entre 3 APIs vía RabbitMQ; workers en .NET y Hangfire para tareas en segundo plano.',
        'Más de 20 pantallas en Angular 19 (standalone components, Signals, Angular Material) con internacionalización vía ngx-translate.',
        'Pruebas unitarias y de integración con xUnit, TDD en parte de las funcionalidades y logs estructurados con Serilog/Seq.',
      ],
    },
    {
      period: 'may 2024 – abr 2025',
      role: 'Analista de Desarrollo de Sistemas',
      location: 'Belo Horizonte, MG',
      duration: '1 año',
      type: 'Presencial',
      summary: 'Desarrollo y mantenimiento de aplicaciones internas en C#/.NET Framework (ASP.NET) integradas con una base de datos Oracle.',
      highlights: [
        'Escritura y optimización de consultas SQL en Oracle para rutinas del negocio e investigación de datos.',
        'Automatización de rutinas internas y administración de la red de la empresa con Mikrotik, en paralelo al desarrollo.',
      ],
    },
    {
      period: 'feb 2023 – abr 2024',
      role: 'Desarrollador Freelance',
      location: 'Remoto',
      duration: '1 año y 3 meses',
      type: 'Freelance',
      summary: 'Desarrollo web freelance para clientes, en paralelo a estudios de C#/.NET y desarrollo web.',
    },
    {
      period: 'nov 2022 – ene 2023',
      role: 'Desarrollador Full Stack Trainee',
      location: 'Belo Horizonte, MG',
      duration: '3 meses',
      type: 'Híbrido',
      summary: 'Desarrollo, prueba y depuración de funcionalidades en proyectos de software, con apoyo de desarrolladores más experimentados. Primer contacto profesional con C# y .NET.',
    },
  ],
};

type ProjectText = Pick<Project, 'headline' | 'description' | 'kind'>;

const PROJECTS_I18N: Record<Exclude<Lang, 'pt'>, Record<string, ProjectText>> = {
  en: {
    pawvelleco: {
      headline: 'Online pet store for the US market.',
      description: 'Headless storefront in Next.js integrated with the Wix API: catalog, cart and checkout served by a custom layer, with content managed in Wix.',
      kind: 'own project',
    },
    'finance-flow': {
      headline: 'Personal finance management dashboard.',
      description: 'Cash flow, goals and charts in React 18 with TypeScript, Context API and Tailwind. Study project with in-memory storage.',
      kind: 'study project',
    },
    izcode: {
      headline: 'Institutional websites and landing pages for small businesses.',
      description: 'Co-founder. Conversion-focused visual storytelling, modular structure and motion tailored to each brand.',
      kind: 'co-founder · side project',
    },
    motomax: {
      headline: 'Full stack motorcycle catalog.',
      description: 'Platform with advanced filters, authentication and an admin panel. From the database to the interface, built for conversion and easy maintenance.',
      kind: 'own project',
    },
    chamados: {
      headline: 'Corporate support in production.',
      description: 'Ticket creation and tracking, status flow, user roles and secure authentication. In real use inside the company — the code stays in a private repository.',
      kind: 'in production · private repository',
    },
  },
  es: {
    pawvelleco: {
      headline: 'Tienda online de productos para mascotas para el mercado estadounidense.',
      description: 'Storefront headless en Next.js integrado con la API de Wix: catálogo, carrito y checkout servidos por una capa propia, con el contenido gestionado en Wix.',
      kind: 'proyecto propio',
    },
    'finance-flow': {
      headline: 'Dashboard de gestión financiera personal.',
      description: 'Flujo de caja, metas y gráficos en React 18 con TypeScript, Context API y Tailwind. Proyecto de estudio con almacenamiento en memoria.',
      kind: 'proyecto de estudio',
    },
    izcode: {
      headline: 'Sitios institucionales y landing pages para pequeños negocios.',
      description: 'Cofundador. Narrativa visual enfocada en conversión, estructura modular y motion a medida para cada marca.',
      kind: 'cofundador · proyecto paralelo',
    },
    motomax: {
      headline: 'Catálogo de motocicletas full stack.',
      description: 'Plataforma con filtros avanzados, autenticación y panel administrativo. De la base de datos a la interfaz, construida para conversión y mantenimiento simple.',
      kind: 'proyecto propio',
    },
    chamados: {
      headline: 'Soporte corporativo en producción.',
      description: 'Apertura y seguimiento de tickets, flujo de estados, roles de usuario y autenticación segura. En uso real dentro de la empresa — el código sigue en un repositorio privado.',
      kind: 'en producción · repositorio privado',
    },
  },
};

type FleetText = Pick<FleetSystem, 'domain' | 'desc'>;

const FLEET_I18N: Record<Exclude<Lang, 'pt'>, Record<string, FleetText>> = {
  en: {
    ponte: { domain: 'Frontend', desc: 'Angular 19 and React/Next.js interfaces with TypeScript, Signals, Tailwind and tailored motion.' },
    armas: { domain: 'Backend', desc: 'REST APIs in C#/ASP.NET Core and Node.js, Entity Framework with MySQL, PostgreSQL and Redis.' },
    hangar: { domain: 'Integrations & AI', desc: 'Messaging, real time and tool-calling agents connecting systems and partners.' },
    escudos: { domain: 'Quality & Operations', desc: 'Clean Architecture, automated tests, structured logs and continuous delivery.' },
  },
  es: {
    ponte: { domain: 'Frontend', desc: 'Interfaces Angular 19 y React/Next.js con TypeScript, Signals, Tailwind y motion a medida.' },
    armas: { domain: 'Backend', desc: 'APIs REST en C#/ASP.NET Core y Node.js, Entity Framework con MySQL, PostgreSQL y Redis.' },
    hangar: { domain: 'Integraciones e IA', desc: 'Mensajería, tiempo real y agentes con tool calling conectando sistemas y socios.' },
    escudos: { domain: 'Calidad y Operación', desc: 'Clean Architecture, pruebas automatizadas, logs estructurados y entrega continua.' },
  },
};

const TECH_I18N: Record<Exclude<Lang, 'pt'>, Record<string, string>> = {
  en: { 'RAG / APIs de LLM': 'RAG / LLM APIs', 'Agentes · tool calling': 'Agents · tool calling', 'APIs de LLM': 'LLM APIs' },
  es: { 'RAG / APIs de LLM': 'RAG / APIs de LLM', 'Agentes · tool calling': 'Agentes · tool calling', 'APIs de LLM': 'APIs de LLM' },
};

export function localizedProfile(lang: Lang) {
  if (lang === 'pt') return PROFILE;
  return { ...PROFILE, ...PROFILE_I18N[lang] };
}

export function localizedDossier(lang: Lang): DossierRow[] {
  return lang === 'pt' ? DOSSIER : DOSSIER_I18N[lang];
}

export function localizedExperiences(lang: Lang): Experience[] {
  if (lang === 'pt') return EXPERIENCES;
  const map = TECH_I18N[lang];
  return EXPERIENCES.map((e, i) => ({ ...e, ...EXPERIENCES_I18N[lang][i], technologies: e.technologies.map((t) => map[t] ?? t) }));
}

export function localizedProjects(lang: Lang): Project[] {
  if (lang === 'pt') return PROJECTS;
  return PROJECTS.map((p) => ({ ...p, ...PROJECTS_I18N[lang][p.id] }));
}

/** Sistemas da capitânia do lado escolhido no idioma pedido: nomes, pontos no casco e cor seguem lado e língua. */
export function fleetSystems(side: SideId, lang: Lang): FleetSystem[] {
  const s = SIDES[side];
  const regions = sideCopy(side, lang).fleet.systems;
  return FLEET_SYSTEMS.map((f) => {
    const id = f.id as keyof typeof regions;
    const text = lang === 'pt' ? null : FLEET_I18N[lang][f.id];
    const techMap = lang === 'pt' ? null : TECH_I18N[lang];
    return {
      ...f,
      ...(text ?? {}),
      region: regions[id] ?? f.region,
      anchor: s.anchors[id] ?? f.anchor,
      color: f.id === 'ponte' ? s.accent : f.color,
      techs: techMap ? f.techs.map((t) => ({ ...t, name: techMap[t.name] ?? t.name })) : f.techs,
    };
  });
}
