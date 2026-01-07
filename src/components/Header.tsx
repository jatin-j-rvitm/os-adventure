import { motion } from 'framer-motion';
import { Terminal, Home, Cpu, HardDrive, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { XPBadge } from './ui/xp-badge';

interface HeaderProps {
  xp: number;
  level: number;
}

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/fcfs', icon: Cpu, label: 'FCFS' },
  { href: '/first-fit', icon: HardDrive, label: 'First Fit' },
  { href: '/quiz', icon: HelpCircle, label: 'Quiz' },
];

export const Header = ({ xp, level }: HeaderProps) => {
  const location = useLocation();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center group-hover:glow-primary transition-all duration-300">
              <Terminal className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-foreground">OS<span className="gradient-text">Lab</span></h1>
              <p className="text-xs text-muted-foreground">Learn by Doing</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg border border-primary/50"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* XP Badge */}
          <XPBadge xp={xp} level={level} />
        </div>
      </div>
    </motion.header>
  );
};
