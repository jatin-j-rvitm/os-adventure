import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface XPBadgeProps {
  xp: number;
  level: number;
  showAnimation?: boolean;
}

export const XPBadge = ({ xp, level, showAnimation = false }: XPBadgeProps) => {
  return (
    <motion.div
      initial={showAnimation ? { scale: 0.8, opacity: 0 } : {}}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-3 px-4 py-2 bg-secondary rounded-full border border-border"
    >
      <div className="flex items-center gap-1.5">
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
          {level}
        </div>
        <span className="text-muted-foreground text-sm">Level</span>
      </div>
      <div className="w-px h-6 bg-border" />
      <div className="flex items-center gap-1.5">
        <Zap className="w-4 h-4 text-warning fill-warning" />
        <span className="font-mono font-semibold text-foreground">{xp}</span>
        <span className="text-muted-foreground text-sm">XP</span>
      </div>
    </motion.div>
  );
};
