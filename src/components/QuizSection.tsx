import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight, Trophy, RotateCcw, Cpu, HardDrive } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { quizQuestions, QuizQuestion } from '@/lib/gameState';

interface QuizSectionProps {
  onXPGain: (amount: number) => void;
}

export const QuizSection = ({ onXPGain }: QuizSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'fcfs' | 'first-fit'>('all');

  const filteredQuestions = useMemo(() => {
    if (filter === 'all') return quizQuestions;
    return quizQuestions.filter(q => q.topic === filter);
  }, [filter]);

  const currentQuestion = filteredQuestions[currentIndex];
  const isComplete = currentIndex >= filteredQuestions.length;

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    if (selectedAnswer === currentQuestion.correctIndex && !answeredQuestions.has(currentQuestion.id)) {
      setScore(score + 1);
      onXPGain(15);
      setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion.id]));
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentIndex(currentIndex + 1);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  if (isComplete) {
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto"
      >
        <Card className="p-8 bg-card border-border text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center"
          >
            <Trophy className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground mb-6">You've finished all the questions</p>
          
          <div className="mb-6">
            <div className="text-5xl font-bold font-mono gradient-text mb-2">{percentage}%</div>
            <p className="text-muted-foreground">
              {score} out of {filteredQuestions.length} correct
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted mb-6">
            <p className="text-sm text-muted-foreground">Total XP earned</p>
            <p className="text-2xl font-bold text-warning font-mono">{score * 15} XP</p>
          </div>

          <Button onClick={resetQuiz} className="gradient-primary text-primary-foreground">
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Topic Filter */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => { setFilter('all'); resetQuiz(); }}
          className={filter === 'all' ? 'gradient-primary text-primary-foreground' : ''}
        >
          All Topics
        </Button>
        <Button
          variant={filter === 'fcfs' ? 'default' : 'outline'}
          size="sm"
          onClick={() => { setFilter('fcfs'); resetQuiz(); }}
          className={filter === 'fcfs' ? 'gradient-primary text-primary-foreground' : ''}
        >
          <Cpu className="w-4 h-4 mr-1" /> FCFS
        </Button>
        <Button
          variant={filter === 'first-fit' ? 'default' : 'outline'}
          size="sm"
          onClick={() => { setFilter('first-fit'); resetQuiz(); }}
          className={filter === 'first-fit' ? 'gradient-primary text-primary-foreground' : ''}
        >
          <HardDrive className="w-4 h-4 mr-1" /> First Fit
        </Button>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {currentIndex + 1} of {filteredQuestions.length}</span>
        <span className="font-mono">Score: {score}/{filteredQuestions.length}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex) / filteredQuestions.length) * 100}%` }}
          className="h-full gradient-primary"
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="p-6 bg-card border-border">
            {/* Topic Badge */}
            <div className="flex items-center gap-2 mb-4">
              {currentQuestion.topic === 'fcfs' ? (
                <span className="px-2 py-1 rounded text-xs font-semibold bg-primary/20 text-primary flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> FCFS Scheduling
                </span>
              ) : (
                <span className="px-2 py-1 rounded text-xs font-semibold bg-accent/20 text-accent flex items-center gap-1">
                  <HardDrive className="w-3 h-3" /> First Fit
                </span>
              )}
            </div>

            {/* Question */}
            <h3 className="text-xl font-semibold text-foreground mb-6">{currentQuestion.question}</h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                let optionClass = 'border-border hover:border-primary/50 hover:bg-primary/5';
                
                if (showResult) {
                  if (index === currentQuestion.correctIndex) {
                    optionClass = 'border-success bg-success/10';
                  } else if (index === selectedAnswer && index !== currentQuestion.correctIndex) {
                    optionClass = 'border-destructive bg-destructive/10';
                  }
                } else if (selectedAnswer === index) {
                  optionClass = 'border-primary bg-primary/10';
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={!showResult ? { scale: 1.01 } : {}}
                    whileTap={!showResult ? { scale: 0.99 } : {}}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${optionClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground shrink-0">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-foreground">{option}</span>
                      {showResult && index === currentQuestion.correctIndex && (
                        <CheckCircle className="w-5 h-5 text-success ml-auto shrink-0" />
                      )}
                      {showResult && index === selectedAnswer && index !== currentQuestion.correctIndex && (
                        <XCircle className="w-5 h-5 text-destructive ml-auto shrink-0" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 rounded-lg bg-muted border border-border"
                >
                  <p className="text-sm font-semibold text-foreground mb-1">Explanation:</p>
                  <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              {!showResult ? (
                <Button 
                  onClick={submitAnswer} 
                  disabled={selectedAnswer === null}
                  className="gradient-primary text-primary-foreground"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={nextQuestion} className="gradient-primary text-primary-foreground">
                  {currentIndex < filteredQuestions.length - 1 ? (
                    <>Next <ChevronRight className="w-4 h-4 ml-1" /></>
                  ) : (
                    'See Results'
                  )}
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
