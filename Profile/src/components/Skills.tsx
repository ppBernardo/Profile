import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  FileCode,
  Layout,
  Palette,
  Server,
  Database,
  Layers,
  GitBranch,
  Monitor,
  Wifi,
  Github,
  Terminal,
  Box,
  Sparkles,
  Network,
  Search,
  Filter,
} from 'lucide-react';
import { viewportDefault, staggerContainer, fadeUpItem, scaleInItem } from '../utils/animations';

const AREAS = ['all', 'Frontend', 'Backend', 'Ferramentas'] as const;
const AREA_LABELS: Record<string, string> = {
  all: 'Todos',
  Frontend: 'Frontend',
  Backend: 'Backend',
  Ferramentas: 'Ferramentas',
};

const stats = [
  { value: '15', label: 'tecnologias' },
  { value: '4+', label: 'anos de experiência' },
  { value: '6.28', label: 'nível médio' },
  { value: '3', label: 'áreas', subLabel: 'front · back · tools' },
];

const iconByTech: Record<string, typeof Code2> = {
  React: Sparkles,
  'Next.js': Layers,
  Angular: Box,
  TypeScript: FileCode,
  'HTML5 / CSS': Layout,
  'Tailwind CSS': Palette,
  JavaScript: Code2,
  'Node.js': Server,
  'C# / .NET': Code2,
  'ASP.NET': Server,
  'Clean Architecture': Layers,
  SQL: Database,
  Git: GitBranch,
  Windows: Monitor,
  Mikrotik: Wifi,
  GitHub: Github,
  Bitbucket: Github,
  'VS Code': Code2,
  Terminal: Terminal,
  'APIs REST': Network,
};

const resultsTable = [
  { area: 'Frontend', name: 'React', level: 85 },
  { area: 'Frontend', name: 'Next.js', level: 80 },
  { area: 'Frontend', name: 'Angular', level: 90 },
  { area: 'Frontend', name: 'TypeScript', level: 75 },
  { area: 'Frontend', name: 'HTML5 / CSS', level: 95 },
  { area: 'Frontend', name: 'Tailwind CSS', level: 70 },
  { area: 'Frontend', name: 'JavaScript', level: 80 },
  { area: 'Backend', name: 'Node.js', level: 85 },
  { area: 'Backend', name: 'C# / .NET', level: 95 },
  { area: 'Backend', name: 'ASP.NET', level: 90 },
  { area: 'Backend', name: 'Clean Architecture', level: 95 },
  { area: 'Backend', name: 'SQL', level: 85 },
  { area: 'Ferramentas', name: 'Git', level: 90 },
  { area: 'Ferramentas', name: 'Windows', level: 80 },
  { area: 'Ferramentas', name: 'Mikrotik', level: 70 },
];

const foundations = [
  { title: 'Versionamento', items: ['Git', 'GitHub', 'Bitbucket'] },
  { title: 'Ambiente', items: ['Windows', 'VS Code', 'Terminal'] },
  { title: 'Rede & Infra', items: ['Mikrotik', 'APIs REST'] },
];

const Skills = () => {
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResults = useMemo(() => {
    return resultsTable.filter((row) => {
      const matchArea = areaFilter === 'all' || row.area === areaFilter;
      const matchSearch =
        !searchQuery.trim() ||
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.area.toLowerCase().includes(searchQuery.toLowerCase());
      return matchArea && matchSearch;
    });
  }, [areaFilter, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Título estilo "f1 career" / "since 2019" */}
      <motion.div
        className="mb-4"
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        variants={staggerContainer}
      >
        <motion.p
          variants={fadeUpItem}
          className="text-lando-lime text-sm uppercase tracking-[0.2em] font-medium"
        >
          Competências Técnicas
        </motion.p>
        <motion.h2
          variants={fadeUpItem}
          className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide mt-1"
        >
          carreira em dev
        </motion.h2>
        <motion.p variants={fadeUpItem} className="text-gray-500 text-sm mt-2 uppercase tracking-wider">
          since 2020
        </motion.p>
      </motion.div>

      <motion.p
        variants={fadeUpItem}
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        className="text-gray-400 max-w-2xl mb-12 text-sm leading-relaxed"
      >
        Stack e ferramentas que uso no dia a dia para entregar produtos escaláveis e de qualidade.
      </motion.p>

      {/* Stats – estilo "44 podiums" / "11 wins" com números em destaque */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
      >
        {stats.map(({ value, label, subLabel }) => (
          <motion.div
            key={label}
            variants={scaleInItem}
            whileHover={{ scale: 1.05 }}
            className="border border-lando-border rounded-lg p-6 sm:p-8 bg-lando-surface/30 text-center hover:border-lando-lime/30 transition-colors"
          >
            <p className="font-display text-4xl sm:text-5xl text-lando-lime leading-none">{value}</p>
            <p className="text-gray-500 text-xs uppercase tracking-wider mt-2">{label}</p>
            {subLabel && (
              <p className="text-gray-600 text-[10px] uppercase tracking-wider mt-1">{subLabel}</p>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Grid stack & resultados – título + filtros */}
      <motion.div
        className="mb-4"
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        variants={fadeUpItem}
      >
        <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide">
          stack & resultados
        </h3>
        <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">
          Tecnologias e nível de domínio — filtre por área ou busque pelo nome
        </p>
      </motion.div>

      {/* Filtros: área + busca */}
      <motion.div
        className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        variants={fadeUpItem}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-gray-500 text-xs uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Filter size={14} />
            Área
          </span>
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => setAreaFilter(area)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-colors ${
                areaFilter === area
                  ? 'bg-lando-lime text-lando-bg'
                  : 'border border-lando-border text-gray-400 hover:border-lando-lime/50 hover:text-lando-lime'
              }`}
            >
              {AREA_LABELS[area]}
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar tecnologia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md bg-lando-surface/50 border border-lando-border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lando-lime/50 transition-colors"
          />
        </div>
        <span className="text-gray-500 text-xs">
          {filteredResults.length} {filteredResults.length === 1 ? 'tecnologia' : 'tecnologias'}
        </span>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-16"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredResults.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center text-gray-500 py-8"
            >
              Nenhuma tecnologia encontrada. Tente outro filtro ou busca.
            </motion.p>
          ) : (
            filteredResults.map((row, i) => {
              const Icon = iconByTech[row.name] ?? Code2;
              return (
                <motion.div
                  key={`${row.area}-${row.name}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.08 }}
                  className="group rounded-lg border border-lando-border p-4 sm:p-5 bg-lando-surface/20 hover:border-lando-lime/40 hover:bg-lando-surface/40 transition-colors cursor-default"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider truncate">
                      {row.area}
                    </span>
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-lando-lime/10 text-lando-lime opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      <Icon size={18} />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-white truncate mb-2">{row.name}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lando-lime text-xs font-medium">{row.level}%</span>
                    <div className="h-1.5 flex-1 max-w-[80px] bg-lando-surface rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-lando-lime rounded-full"
                        initial={false}
                        animate={{ width: `${row.level}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bloco "pre-career" / ferramentas & base – estilo títulos de pista */}
      <motion.h3
        className="font-display text-2xl sm:text-3xl text-white tracking-wide mb-6"
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        variants={fadeUpItem}
      >
        ferramentas & base
      </motion.h3>
      <motion.p
        className="text-gray-500 text-xs uppercase tracking-wider mb-6"
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        variants={fadeUpItem}
      >
        Versionamento, ambiente e infraestrutura no dia a dia
      </motion.p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
      >
        {foundations.map((block) => (
          <motion.div
            key={block.title}
            variants={scaleInItem}
            whileHover={{ scale: 1.05 }}
            className="rounded-lg border border-lando-border p-5 sm:p-6 bg-lando-surface/20 hover:border-lando-lime/30 transition-colors"
          >
            <p className="text-lando-lime font-display text-lg tracking-wide mb-4">{block.title}</p>
            <ul className="space-y-2">
              {block.items.map((item) => {
                const Icon = iconByTech[item] ?? Code2;
                return (
                  <motion.li
                    key={item}
                    className="flex items-center gap-3 text-gray-400 text-sm group/item hover:text-lando-lime/90 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-lando-surface text-lando-lime opacity-80 group-hover/item:opacity-100 transition-opacity">
                      <Icon size={16} />
                    </span>
                    {item}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* Linha decorativa "pista" */}
      <motion.div
        className="mt-16 flex items-center gap-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportDefault}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-lando-lime/30 to-transparent" />
        <span className="text-gray-600 text-xs uppercase tracking-[0.2em]">full stack</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-lando-lime/30 to-transparent" />
      </motion.div>
    </div>
  );
};

export default Skills;
