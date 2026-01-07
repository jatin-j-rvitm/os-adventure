import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { FCFSSimulator } from '@/components/FCFSSimulator';
import { Card } from '@/components/ui/card';
import { useGameProgress } from '@/hooks/useGameProgress';

const FCFSPage = () => {
  const { xp, level, addXP, completeModule } = useGameProgress();

  const handleXPGain = (amount: number) => {
    addXP(amount);
    completeModule('fcfs');
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
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">FCFS CPU Scheduling</h1>
              <p className="text-muted-foreground">First Come, First Served Algorithm</p>
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
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">How FCFS Works</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  FCFS (First Come First Serve) is the simplest CPU scheduling algorithm. 
                  Processes are executed in the order they arrive in the ready queue. 
                  It's non-preemptive, meaning once a process starts, it runs until completion.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-muted-foreground">Simple to implement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    <span className="text-muted-foreground">Convoy effect possible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Non-preemptive</span>
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
          <FCFSSimulator onXPGain={handleXPGain} />
        </motion.div>
      </main>
    </div>
  );
};

export default FCFSPage;
