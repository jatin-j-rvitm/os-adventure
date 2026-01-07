import { motion } from 'framer-motion';
import { Cpu, BookOpen, Target, Zap } from 'lucide-react';
import { Header } from '@/components/Header';
import { ModuleCard } from '@/components/ModuleCard';
import { ProgressRing } from '@/components/ui/progress-ring';
import { useGameProgress } from '@/hooks/useGameProgress';

const Index = () => {
  const { xp, level, progress, completedModules } = useGameProgress();

  const modules = [
    {
      title: 'FCFS Scheduling',
      description: 'Learn First Come First Serve CPU scheduling through interactive simulation',
      icon: Cpu,
      progress: completedModules.includes('fcfs') ? 100 : 0,
      xp: 100,
      href: '/fcfs',
      gradient: 'primary' as const,
    },
    {
      title: 'First Fit Allocation',
      description: 'Explore memory allocation with First Fit algorithm visualization',
      icon: Target,
      progress: completedModules.includes('first-fit') ? 100 : 0,
      xp: 120,
      href: '/first-fit',
      gradient: 'accent' as const,
    },
    {
      title: 'Quiz Challenge',
      description: 'Test your knowledge with MCQs on scheduling and memory management',
      icon: BookOpen,
      progress: completedModules.includes('quiz') ? 100 : 0,
      xp: 90,
      href: '/quiz',
      gradient: 'warning' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header xp={xp} level={level} />

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 terminal-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6"
            >
              <Zap className="w-4 h-4" />
              Learn Operating Systems Through Play
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            >
              Master OS Concepts with{' '}
              <span className="gradient-text">Interactive</span> Simulations
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Experience CPU scheduling, memory allocation, and more through hands-on simulations. 
              Earn XP, track progress, and truly understand how operating systems work.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-8"
            >
              <div className="text-center">
                <ProgressRing progress={progress} size={100} label="Complete" />
              </div>
              <div className="h-16 w-px bg-border hidden sm:block" />
              <div className="text-center">
                <p className="text-3xl font-bold font-mono text-foreground">{modules.length}</p>
                <p className="text-sm text-muted-foreground">Learning Modules</p>
              </div>
              <div className="h-16 w-px bg-border hidden sm:block" />
              <div className="text-center">
                <p className="text-3xl font-bold font-mono text-warning">{xp}</p>
                <p className="text-sm text-muted-foreground">XP Earned</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">Learning Modules</h2>
            <p className="text-muted-foreground">Choose a module to begin your learning journey</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <ModuleCard key={module.href} {...module} delay={0.5 + index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎮', title: 'Gamified Learning', desc: 'Earn XP and level up as you master concepts' },
              { icon: '📊', title: 'Visual Simulations', desc: 'See algorithms in action with real-time animations' },
              { icon: '🧠', title: 'Instant Feedback', desc: 'Learn from detailed explanations and results' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center p-6"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
