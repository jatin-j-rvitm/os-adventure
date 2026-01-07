import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { QuizSection } from '@/components/QuizSection';
import { Card } from '@/components/ui/card';
import { useGameProgress } from '@/hooks/useGameProgress';

const QuizPage = () => {
  const { xp, level, addXP, completeModule } = useGameProgress();

  const handleXPGain = (amount: number) => {
    addXP(amount);
    completeModule('quiz');
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
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Quiz Challenge</h1>
              <p className="text-muted-foreground">Test Your OS Knowledge</p>
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
          <Card className="p-6 bg-warning/5 border-warning/20">
            <div className="flex items-start gap-3">
              <Trophy className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Earn XP by Answering Questions</h3>
                <p className="text-muted-foreground text-sm">
                  Answer multiple choice questions about FCFS scheduling and First Fit memory allocation. 
                  Each correct answer earns you <span className="text-warning font-semibold">15 XP</span>. 
                  Read the explanations to deepen your understanding!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quiz */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <QuizSection onXPGain={handleXPGain} />
        </motion.div>
      </main>
    </div>
  );
};

export default QuizPage;
