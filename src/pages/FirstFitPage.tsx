import { motion } from 'framer-motion';
import { ArrowLeft, HardDrive, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { FirstFitSimulator } from '@/components/FirstFitSimulator';
import { Card } from '@/components/ui/card';
import { useGameProgress } from '@/hooks/useGameProgress';

const FirstFitPage = () => {
  const { xp, level, addXP, completeModule } = useGameProgress();

  const handleXPGain = (amount: number) => {
    addXP(amount);
    completeModule('first-fit');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header xp={xp} level={level} />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Modules
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">First Fit Memory Allocation</h1>
              <p className="text-muted-foreground">Dynamic Memory Partitioning</p>
            </div>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6 bg-accent/5 border-accent/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">How First Fit Works</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  First Fit allocates the first memory block that is large enough to accommodate a process. 
                  It searches from the beginning of memory and assigns the first suitable block found. 
                  This can lead to internal fragmentation when block sizes don't match process sizes exactly.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-muted-foreground">Fast allocation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    <span className="text-muted-foreground">Internal fragmentation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-muted-foreground">Simple implementation</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Simulator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FirstFitSimulator onXPGain={handleXPGain} />
        </motion.div>
      </main>
    </div>
  );
};

export default FirstFitPage;
