import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  progress: number;
  xp: number;
  href: string;
  gradient: 'primary' | 'accent' | 'warning';
  delay?: number;
}

const gradientClasses = {
  primary: 'from-primary/20 to-primary/5 border-primary/30 hover:border-primary/60',
  accent: 'from-accent/20 to-accent/5 border-accent/30 hover:border-accent/60',
  warning: 'from-warning/20 to-warning/5 border-warning/30 hover:border-warning/60',
};

const iconBgClasses = {
  primary: 'bg-primary/20 text-primary',
  accent: 'bg-accent/20 text-accent',
  warning: 'bg-warning/20 text-warning',
};

export const ModuleCard = ({ title, description, icon: Icon, progress, xp, href, gradient, delay = 0 }: ModuleCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="h-full"
    >
      <Link to={href} className="block h-full">
        <div className={`relative h-full p-6 rounded-xl bg-gradient-to-br ${gradientClasses[gradient]} border-2 transition-all duration-300 overflow-hidden group`}>
          {/* Background pattern */}
          <div className="absolute inset-0 terminal-grid opacity-30" />
          
          <div className="relative z-10">
            {/* Icon */}
            <div className={`w-14 h-14 rounded-xl ${iconBgClasses[gradient]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-7 h-7" />
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-mono text-foreground">{progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ delay: delay + 0.3, duration: 0.8 }}
                  className="h-full gradient-primary rounded-full"
                />
              </div>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Earn up to</span>
              <span className="font-mono font-bold text-warning">{xp} XP</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
