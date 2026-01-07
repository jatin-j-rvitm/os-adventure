import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Trash2, RotateCcw, Clock, Timer, Cpu } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Process, GanttBlock, calculateFCFS, generateProcessId, PROCESS_COLORS } from '@/lib/gameState';

interface FCFSSimulatorProps {
  onXPGain: (amount: number) => void;
}

export const FCFSSimulator = ({ onXPGain }: FCFSSimulatorProps) => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [newArrival, setNewArrival] = useState('');
  const [newBurst, setNewBurst] = useState('');
  const [gantt, setGantt] = useState<GanttBlock[]>([]);
  const [avgWait, setAvgWait] = useState(0);
  const [avgTurnaround, setAvgTurnaround] = useState(0);
  const [isSimulated, setIsSimulated] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);

  const addProcess = useCallback(() => {
    const arrival = parseInt(newArrival) || 0;
    const burst = parseInt(newBurst) || 1;
    
    if (burst < 1) return;

    const newProcess: Process = {
      id: generateProcessId(),
      name: `P${processes.length + 1}`,
      arrivalTime: arrival,
      burstTime: burst,
      color: PROCESS_COLORS[processes.length % PROCESS_COLORS.length],
    };

    setProcesses([...processes, newProcess]);
    setNewArrival('');
    setNewBurst('');
    setIsSimulated(false);
    setGantt([]);
  }, [newArrival, newBurst, processes]);

  const removeProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
    setIsSimulated(false);
    setGantt([]);
  };

  const runSimulation = () => {
    if (processes.length === 0) return;
    
    const result = calculateFCFS(processes);
    setGantt(result.gantt);
    setAvgWait(result.avgWaitTime);
    setAvgTurnaround(result.avgTurnaroundTime);
    setIsSimulated(true);
    setCurrentStep(0);
    onXPGain(25);
  };

  const reset = () => {
    setProcesses([]);
    setGantt([]);
    setIsSimulated(false);
    setCurrentStep(-1);
    setAvgWait(0);
    setAvgTurnaround(0);
  };

  const totalTime = gantt.length > 0 ? gantt[gantt.length - 1].endTime : 0;

  return (
    <div className="space-y-6">
      {/* Process Input */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Add Process
        </h3>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[120px]">
            <label className="text-xs text-muted-foreground mb-1 block">Arrival Time</label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={newArrival}
              onChange={(e) => setNewArrival(e.target.value)}
              className="font-mono bg-secondary border-border"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="text-xs text-muted-foreground mb-1 block">Burst Time</label>
            <Input
              type="number"
              min="1"
              placeholder="1"
              value={newBurst}
              onChange={(e) => setNewBurst(e.target.value)}
              className="font-mono bg-secondary border-border"
            />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={addProcess} className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
            <Button onClick={reset} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Process List */}
      {processes.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Process Queue</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b border-border">
                  <th className="pb-3 pr-4">Process</th>
                  <th className="pb-3 pr-4">Arrival Time</th>
                  <th className="pb-3 pr-4">Burst Time</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {processes.map((process, index) => (
                    <motion.tr
                      key={process.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center font-mono font-bold text-sm"
                            style={{ backgroundColor: process.color, color: '#0a0f1a' }}
                          >
                            {process.name}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-mono text-foreground">{process.arrivalTime}</td>
                      <td className="py-3 pr-4 font-mono text-foreground">{process.burstTime}</td>
                      <td className="py-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => removeProcess(process.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          <Button 
            onClick={runSimulation} 
            className="mt-4 gradient-primary text-primary-foreground w-full sm:w-auto"
            disabled={processes.length === 0}
          >
            <Play className="w-4 h-4 mr-2" /> Run Simulation
          </Button>
        </Card>
      )}

      {/* Gantt Chart */}
      {isSimulated && gantt.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              Gantt Chart Timeline
            </h3>
            
            {/* Timeline */}
            <div className="relative mb-8">
              <div className="flex h-16 bg-secondary rounded-lg overflow-hidden">
                {gantt.map((block, index) => {
                  const width = ((block.endTime - block.startTime) / totalTime) * 100;
                  return (
                    <motion.div
                      key={`${block.processId}-${index}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      className="h-full flex items-center justify-center font-mono font-bold text-sm origin-left"
                      style={{ 
                        width: `${width}%`,
                        backgroundColor: block.color,
                        color: '#0a0f1a'
                      }}
                    >
                      {block.processName}
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Time markers */}
              <div className="flex mt-2">
                <span className="text-xs font-mono text-muted-foreground">0</span>
                {gantt.map((block, index) => {
                  const left = (block.endTime / totalTime) * 100;
                  return (
                    <span
                      key={`time-${index}`}
                      className="text-xs font-mono text-muted-foreground absolute"
                      style={{ left: `${left}%`, transform: 'translateX(-50%)' }}
                    >
                      {block.endTime}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  Average Waiting Time
                </div>
                <p className="text-2xl font-bold font-mono text-foreground">
                  {avgWait.toFixed(2)} <span className="text-sm text-muted-foreground">units</span>
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Timer className="w-4 h-4" />
                  Average Turnaround Time
                </div>
                <p className="text-2xl font-bold font-mono text-foreground">
                  {avgTurnaround.toFixed(2)} <span className="text-sm text-muted-foreground">units</span>
                </p>
              </div>
            </div>

            {/* Step-by-step explanation */}
            <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-3">Step-by-Step Execution</h4>
              <div className="space-y-2 text-sm">
                {gantt.map((block, index) => (
                  <motion.div
                    key={`step-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="flex items-start gap-3 p-2 rounded bg-background/50"
                  >
                    <div 
                      className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: block.color, color: '#0a0f1a' }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <span className="font-mono font-semibold text-foreground">{block.processName}</span>
                      <span className="text-muted-foreground"> executes from time </span>
                      <span className="font-mono text-primary">{block.startTime}</span>
                      <span className="text-muted-foreground"> to </span>
                      <span className="font-mono text-primary">{block.endTime}</span>
                      <span className="text-muted-foreground"> (burst: {block.endTime - block.startTime} units)</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
