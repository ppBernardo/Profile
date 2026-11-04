import { SIDES, type SideId } from './sides';

export const PROFILE = {
  firstName: 'Bernardo',
  name: 'Bernardo Pereira',
  fullName: 'Bernardo Pereira Pinto',
  wordmark: 'Bernardo',
  role: 'Desenvolvedor Full Stack .NET',
  headline: 'C# · ASP.NET Core · Angular | APIs REST · SQL · xUnit · Clean Architecture',
  pitch: 'C#, ASP.NET Core e Angular em sistemas corporativos desde 2022. Hoje, Node.js, Next.js e agentes de IA.',
  tagline: ['um portfólio', 'forjado no', 'lado sombrio.'],
  since: 2022,
  location: 'Belo Horizonte, MG',
  availability: 'presencial, híbrido ou remoto · aceita mudança de cidade',
  email: 'bernardo0kneezmz@gmail.com',
  site: 'https://bernardopereiraprofile.vercel.app',
  siteLabel: 'bernardopereiraprofile.vercel.app',
  githubUser: 'ppBernardo',
  github: 'https://github.com/ppBernardo',
  linkedin: 'https://www.linkedin.com/in/bernardo-pereira-b80a0924a/',
  instagram: 'https://www.instagram.com/bernard0pereira?igsh=MWduNm9pdmdtbjBqNw==',
  bio: [
    'Desenvolvedor Full Stack .NET com foco em C#, ASP.NET Core e Angular. Atuo em sistemas corporativos desde 2022: APIs REST com autenticação JWT e autorização por papel, Entity Framework com MySQL, Clean Architecture (Repository, Unit of Work, injeção de dependência), frontend em Angular 19 e testes unitários e de integração com xUnit.',
    'Hoje desenvolvo uma plataforma omnichannel em Node.js e Next.js, com PostgreSQL, Redis e agentes de IA. Uso ferramentas de IA como apoio ao desenvolvimento, validando cada sugestão com documentação, execução e testes.',
  ],
  quote: 'O poder do código está em quem o controla.',
  tags: ['C#', '.NET', 'ASP.NET Core', 'Angular 19', 'Node.js', 'Next.js', 'TypeScript', 'SQL', 'xUnit'],
};

export interface DossierRow {
  k: string;
  v: string;
  s: string;
}

export const DOSSIER: DossierRow[] = [
  {
    k: 'Formação',
    v: 'Bacharelado em Sistemas de Informação',
    s: 'PUC Minas · em andamento · previsão dez 2027',
  },
  {
    k: 'Certificações',
    v: '.NET 6: criando uma Web API · Node.js: API REST com Express e MongoDB',
    s: 'Alura · 2024–2025',
  },
  {
    k: 'Idiomas',
    v: 'Português nativo · Espanhol avançado · Inglês intermediário',
    s: 'comunicação com times e documentação',
  },
  {
    k: 'Base',
    v: PROFILE.location,
    s: PROFILE.availability,
  },
  {
    k: 'Em campo desde',
    v: String(PROFILE.since),
    s: 'sistemas corporativos .NET e Node.js',
  },
];

export interface Experience {
  year: string;
  period: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  type: string;
  summary: string;
  highlights?: string[];
  technologies: string[];
  current?: boolean;
}

export const EXPERIENCES: Experience[] = [
  {
    year: '2026',
    period: 'mai 2026 – atual',
    company: 'Fiducial Consultoria e Serviços Financeiros',
    role: 'Desenvolvedor Full Stack',
    location: 'Belo Horizonte, MG',
    duration: 'presencial',
    type: 'Atual',
    current: true,
    summary:
      'Omni, a plataforma omnichannel própria da empresa: atendimento, vendas e cobrança (WhatsApp, e-mail, SMS e voz) em um único sistema, em Node.js e Next.js, com cerca de 800 atendimentos por dia.',
    highlights: [
      'Editor visual no-code de fluxos de chatbot — blocos de mensagens, condições, integrações, banco e IA — com versionamento e simulador nó a nó.',
      'Agente de IA para negociação de crédito no WhatsApp: consulta parceiros, simula condições com dados reais, negocia parcelas e transfere para humano quando preciso.',
      'Integrações com instituições financeiras encapsuladas como ferramentas reutilizáveis, usadas pelo agente via tool calling.',
      'Atendimento em tempo real com Socket.io, campanhas multicanal, dashboards e auditoria alinhada à LGPD.',
    ],
    technologies: [
      'Node.js',
      'Express',
      'Next.js',
      'React',
      'TypeScript',
      'PostgreSQL',
      'Redis',
      'Socket.io',
      'RAG',
      'APIs de LLM',
      'Jest',
      'Vitest',
    ],
  },
  {
    year: '2025',
    period: 'nov 2025 – mar 2026',
    company: 'MyLegal',
    role: 'Desenvolvedor Full Stack',
    location: 'Remoto',
    duration: '5 meses',
    type: 'Tempo integral',
    summary:
      'Sustentação e evolução de sistemas jurídicos legados em ASP e desenvolvimento de novas telas no padrão MVC em C#.',
    highlights: [
      'Robôs em .NET para coleta e processamento de publicações jurídicas: processos, tramitações, fases e lotes em MySQL.',
      'Envio em lotes a uma API REST autenticada por Bearer Token, com JSON serializado e parâmetros configuráveis — cerca de 5.000 lotes por dia.',
      'Resultados em JSONL e exportação para planilhas com ClosedXML; investigação de consultas SQL e tratamento de datas.',
    ],
    technologies: ['C#', '.NET', 'ASP', 'MVC', 'MySQL', 'REST', 'ClosedXML', 'Clean Architecture'],
  },
  {
    year: '2025',
    period: 'abr 2025 – nov 2025',
    company: 'Alterosa MK',
    role: 'Desenvolvedor Full Stack',
    location: 'Contagem, MG',
    duration: '8 meses',
    type: 'Presencial',
    summary:
      'Backend .NET e frontend Angular em sistemas internos corporativos, seguindo Clean Architecture (Domain, Application, Infrastructure).',
    highlights: [
      'Mais de 20 endpoints REST em C#/ASP.NET Core com paginação, filtros e ordenação; JWT e autorização por papel integrados ao ngx-permissions.',
      'Cache compartilhado com invalidação após escritas; integração entre 3 APIs via RabbitMQ; workers em .NET e Hangfire para tarefas em segundo plano.',
      'Mais de 20 telas em Angular 19 (standalone components, Signals, Angular Material) com internacionalização via ngx-translate.',
      'Testes unitários e de integração com xUnit, TDD em parte das funcionalidades e logs estruturados com Serilog/Seq.',
    ],
    technologies: [
      'C#',
      'ASP.NET Core',
      'Angular 19',
      'TypeScript',
      'MySQL',
      'EF Core',
      'xUnit',
      'JWT',
      'RabbitMQ',
      'Hangfire',
      'Serilog',
    ],
  },
  {
    year: '2024',
    period: 'mai 2024 – abr 2025',
    company: 'Mais Distribuidora',
    role: 'Analista de Desenvolvimento de Sistemas',
    location: 'Belo Horizonte, MG',
    duration: '1 ano',
    type: 'Presencial',
    summary:
      'Desenvolvimento e manutenção de aplicações internas em C#/.NET Framework (ASP.NET) integradas ao banco de dados Oracle.',
    highlights: [
      'Escrita e otimização de consultas SQL em Oracle para rotinas do negócio e investigação de dados.',
      'Automação de rotinas internas e administração da rede da empresa com Mikrotik, em paralelo ao desenvolvimento.',
    ],
    technologies: ['C#', '.NET Framework', 'ASP.NET', 'Oracle', 'SQL', 'Mikrotik'],
  },
  {
    year: '2023',
    period: 'fev 2023 – abr 2024',
    company: 'Autônomo',
    role: 'Desenvolvedor Freelancer',
    location: 'Remoto',
    duration: '1 ano e 3 meses',
    type: 'Freelance',
    summary:
      'Desenvolvimento web freelance para clientes, em paralelo a estudos de C#/.NET e desenvolvimento web.',
    technologies: ['JavaScript', 'HTML', 'CSS', 'C#', '.NET'],
  },
  {
    year: '2022',
    period: 'nov 2022 – jan 2023',
    company: 'Mais Dados Digital',
    role: 'Desenvolvedor Full Stack Trainee',
    location: 'Belo Horizonte, MG',
    duration: '3 meses',
    type: 'Híbrido',
    summary:
      'Desenvolvimento, teste e depuração de funcionalidades em projetos de software, com apoio de desenvolvedores mais experientes. Primeiro contato profissional com C# e .NET.',
    technologies: ['C#', '.NET', 'SQL', 'Bitbucket'],
  },
];

export interface Project {
  id: string;
  numeral: string;
  title: string;
  headline: string;
  description: string;
  stack: string[];
  link?: string;
  privateRepo?: boolean;
  kind: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'pawvelleco',
    numeral: 'I',
    title: 'Pawvelleco',
    headline: 'Loja virtual de produtos pet para o mercado americano.',
    description:
      'Storefront headless em Next.js integrado à API do Wix: catálogo, carrinho e checkout servidos por uma camada própria, com o conteúdo gerido no Wix.',
    stack: ['Next.js', 'React', 'TypeScript', 'Wix API'],
    link: 'https://pawvelleco.com',
    kind: 'projeto próprio',
  },
  {
    id: 'finance-flow',
    numeral: 'II',
    title: 'Finance Flow',
    headline: 'Dashboard de gestão financeira pessoal.',
    description:
      'Fluxo de caixa, metas e gráficos em React 18 com TypeScript, Context API e Tailwind. Projeto de estudo com armazenamento em memória.',
    stack: ['React 18', 'TypeScript', 'Context API', 'Tailwind'],
    link: 'https://personal-financial-management-platf.vercel.app/',
    kind: 'projeto de estudo',
  },
  {
    id: 'izcode',
    numeral: 'III',
    title: 'Iz Code',
    headline: 'Sites institucionais e landing pages para pequenos negócios.',
    description:
      'Cofundador. Narrativa visual focada em conversão, estrutura modular e motion sob medida para cada marca.',
    stack: ['React', 'UI System', 'Motion', 'Responsive'],
    link: 'https://izcode.com.br/',
    kind: 'cofundador · projeto paralelo',
  },
  {
    id: 'motomax',
    numeral: 'IV',
    title: 'MotoMax',
    headline: 'Catálogo de motocicletas full stack.',
    description:
      'Plataforma com filtros avançados, autenticação e painel administrativo. Do banco de dados à interface, construída para conversão e manutenção simples.',
    stack: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    link: 'https://moto-max-eight.vercel.app/',
    kind: 'projeto próprio',
  },
  {
    id: 'chamados',
    numeral: 'V',
    title: 'Sistema de Chamados',
    headline: 'Suporte corporativo em produção.',
    description:
      'Abertura e acompanhamento de chamados, fluxo de status, papéis de usuário e autenticação segura. Solução em uso real dentro da empresa — o código permanece em repositório privado.',
    stack: ['Node.js', 'Express', 'REST API', 'React'],
    privateRepo: true,
    kind: 'em produção · repositório privado',
  },
];

export const CRYSTALS_PER_PROJECT = 3;

export interface Skill {
  name: string;
  pct: number;
}

export const SKILLS = {
  frontend: {
    label: 'Frontend',
    score: 91,
    items: [
      { name: 'Angular 19 · Signals', pct: 92 },
      { name: 'React / Next.js', pct: 90 },
      { name: 'TypeScript', pct: 92 },
      { name: 'Tailwind / CSS', pct: 88 },
      { name: 'Motion (GSAP)', pct: 84 },
    ] as Skill[],
  },
  backend: {
    label: 'Backend',
    score: 93,
    items: [
      { name: 'C# / ASP.NET Core', pct: 94 },
      { name: 'Node.js / Express', pct: 90 },
      { name: 'EF Core / MySQL', pct: 91 },
      { name: 'PostgreSQL / Redis', pct: 86 },
      { name: 'xUnit · Jest · Vitest', pct: 88 },
    ] as Skill[],
  },
  arsenal: [
    'Clean Architecture',
    'SOLID',
    'JWT',
    'RabbitMQ',
    'Hangfire',
    'Serilog / Seq',
    'Socket.io',
    'RAG / LLM',
    'Oracle',
    'SQL Server',
    'Linux / PM2',
    'Git / CI/CD',
    'Mikrotik',
  ],
};

export interface FleetSystem {
  id: string;
  code: string;
  region: string;
  domain: string;
  desc: string;
  level: number;
  color: string;
  /** Ponto no casco, em unidades da nave normalizada (comprimento 1, proa em +Z, torre em -Z). */
  anchor: [number, number, number];
  techs: Skill[];
}

/** Sistemas da capitânia do lado escolhido: nomes e pontos no casco mudam com o modelo. */
export function fleetSystems(side: SideId): FleetSystem[] {
  const s = SIDES[side];
  return FLEET_SYSTEMS.map((f) => {
    const o = s.copy.fleet.systems[f.id as keyof typeof s.copy.fleet.systems];
    return {
      ...f,
      region: o?.region ?? f.region,
      anchor: o?.anchor ?? f.anchor,
      color: f.id === 'ponte' ? s.accent : f.color,
    };
  });
}

export const FLEET_SYSTEMS: FleetSystem[] = [
  {
    id: 'ponte',
    code: '01',
    region: 'Ponte de comando',
    domain: 'Frontend',
    desc: 'Interfaces Angular 19 e React/Next.js com TypeScript, Signals, Tailwind e motion sob medida.',
    level: SKILLS.frontend.score,
    color: '#e3242b',
    anchor: [0, 0.11, -0.3],
    techs: SKILLS.frontend.items,
  },
  {
    id: 'armas',
    code: '02',
    region: 'Armas · turbolasers',
    domain: 'Backend',
    desc: 'APIs REST em C#/ASP.NET Core e Node.js, Entity Framework com MySQL, PostgreSQL e Redis.',
    level: SKILLS.backend.score,
    color: '#ff6a3c',
    anchor: [-0.08, 0.035, -0.06],
    techs: SKILLS.backend.items,
  },
  {
    id: 'hangar',
    code: '03',
    region: 'Hangar e comunicações',
    domain: 'Integrações & IA',
    desc: 'Mensageria, tempo real e agentes com tool calling conectando sistemas e parceiros.',
    level: 88,
    color: '#a855f7',
    anchor: [0, -0.07, 0.12],
    techs: [
      { name: 'REST / JWT', pct: 91 },
      { name: 'RabbitMQ / Hangfire', pct: 84 },
      { name: 'Socket.io', pct: 86 },
      { name: 'RAG / APIs de LLM', pct: 82 },
      { name: 'Agentes · tool calling', pct: 80 },
    ],
  },
  {
    id: 'escudos',
    code: '04',
    region: 'Escudos defletores',
    domain: 'Qualidade & Operação',
    desc: 'Clean Architecture, testes automatizados, logs estruturados e entrega contínua.',
    level: 87,
    color: '#4aa8ff',
    anchor: [0, -0.01, 0.46],
    techs: [
      { name: 'Clean Architecture / SOLID', pct: 90 },
      { name: 'xUnit · Jest · Vitest · TDD', pct: 88 },
      { name: 'Serilog / Seq', pct: 82 },
      { name: 'Git / CI/CD', pct: 90 },
      { name: 'Linux / PM2', pct: 78 },
    ],
  },
];

export interface ContactChannel {
  id: 'email' | 'linkedin' | 'github' | 'instagram';
  label: string;
  value: string;
  href: string;
  copy?: boolean;
  /** Casa de Tatooine que abriga o canal. */
  variant: 'homestead' | 'vaporator' | 'cantina' | 'tower';
  glyph: string;
}

export const CONTACTS: ContactChannel[] = [
  {
    id: 'email',
    label: 'E-mail',
    value: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    copy: true,
    variant: 'homestead',
    glyph: '✉',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'Bernardo Pereira Pinto',
    href: PROFILE.linkedin,
    variant: 'tower',
    glyph: 'in',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: '@ppBernardo',
    href: PROFILE.github,
    variant: 'cantina',
    glyph: '</>',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    value: '@bernard0pereira',
    href: PROFILE.instagram,
    variant: 'vaporator',
    glyph: '◎',
  },
];
