import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Trash2, RotateCcw, HardDrive, Box, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { MemoryBlock, MemoryProcess, firstFitAllocation, generateBlockId, generateProcessId, PROCESS_COLORS } from '@/lib/gameState';

interface FirstFitSimulatorProps {
  onXPGain: (amount: number) => void;
}

export const FirstFitSimulator = ({ onXPGain }: FirstFitSimulatorProps) => {
  const [blocks, setBlocks] = useState<MemoryBlock[]>([]);
  const [processes, setProcesses] = useState<MemoryProcess[]>([]);
  const [newBlockSize, setNewBlockSize] = useState('');
  const [newProcessSize, setNewProcessSize] = useState('');
  const [isAllocated, setIsAllocated] = useState(false);
  const [allocatedBlocks, setAllocatedBlocks] = useState<MemoryBlock[]>([]);
  const [allocatedProcesses, setAllocatedProcesses] = useState<MemoryProcess[]>([]);

  const addBlock = useCallback(() => {
    const size = parseInt(newBlockSize) || 0;
    if (size < 1) return;

    const newBlock: MemoryBlock = {
      id: generateBlockId(),
      size,
      allocated: false,
    };

    setBlocks([...blocks, newBlock]);
    setNewBlockSize('');
    setIsAllocated(false);
  }, [newBlockSize, blocks]);

  const addProcess = useCallback(() => {
    const size = parseInt(newProcessSize) || 0;
    if (size < 1) return;

    const newProcess: MemoryProcess = {
      id: generateProcessId(),
      name: `P${processes.length + 1}`,
      size,
      color: PROCESS_COLORS[processes.length % PROCESS_COLORS.length],
      allocated: false,
    };

    setProcesses([...processes, newProcess]);
    setNewProcessSize('');
    setIsAllocated(false);
  }, [newProcessSize, processes]);

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    setIsAllocated(false);
  };

  const removeProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
    setIsAllocated(false);
  };

  const runAllocation = () => {
    if (blocks.length === 0 || processes.length === 0) return;

    const result = firstFitAllocation(blocks, processes);
    setAllocatedBlocks(result.blocks);
    setAllocatedProcesses(result.processes);
    setIsAllocated(true);
    onXPGain(30);
  };

  const reset = () => {
    setBlocks([]);
    setProcesses([]);
    setIsAllocated(false);
    setAllocatedBlocks([]);
    setAllocatedProcesses([]);
  };

  const totalFragmentation = allocatedBlocks.reduce((sum, b) => sum + (b.internalFragmentation || 0), 0);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Memory Blocks Input */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-primary" />
            Memory Blocks
          </h3>
          <div className="flex gap-3 mb-4">
            <Input
              type="number"
              min="1"
              placeholder="Block Size (KB)"
              value={newBlockSize}
              onChange={(e) => setNewBlockSize(e.target.value)}
              className="font-mono bg-secondary border-border"
            />
            <Button onClick={addBlock} className="gradient-primary text-primary-foreground shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {blocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative"
                >
                  <div className="px-4 py-2 bg-secondary rounded-lg border border-border font-mono text-sm">
                    B{index + 1}: {block.size} KB
                  </div>
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>

        {/* Processes Input */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Box className="w-5 h-5 text-accent" />
            Processes
          </h3>
          <div className="flex gap-3 mb-4">
            <Input
              type="number"
              min="1"
              placeholder="Process Size (KB)"
              value={newProcessSize}
              onChange={(e) => setNewProcessSize(e.target.value)}
              className="font-mono bg-secondary border-border"
            />
            <Button onClick={addProcess} variant="outline" className="border-accent text-accent hover:bg-accent/10 shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {processes.map((process) => (
                <motion.div
                  key={process.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative"
                >
                  <div 
                    className="px-4 py-2 rounded-lg font-mono text-sm font-semibold"
                    style={{ backgroundColor: process.color, color: '#0a0f1a' }}
                  >
                    {process.name}: {process.size} KB
                  </div>
                  <button
                    onClick={() => removeProcess(process.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={runAllocation} 
          className="gradient-primary text-primary-foreground"
          disabled={blocks.length === 0 || processes.length === 0}
        >
          <Play className="w-4 h-4 mr-2" /> Run Allocation
        </Button>
        <Button onClick={reset} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
          <RotateCcw className="w-4 h-4 mr-2" /> Reset
        </Button>
      </div>

      {/* Memory Visualization */}
      {isAllocated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-primary" />
              Memory Allocation Visualization
            </h3>

            {/* Memory Blocks Visualization */}
            <div className="space-y-3 mb-6">
              {allocatedBlocks.map((block, index) => {
                const process = allocatedProcesses.find(p => p.blockId === block.id);
                const usedPercent = process ? (process.size / block.size) * 100 : 0;
                const fragPercent = block.internalFragmentation ? (block.internalFragmentation / block.size) * 100 : 0;

                return (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-sm font-mono text-muted-foreground w-12">B{index + 1}</span>
                    <div className="flex-1 h-12 bg-muted rounded-lg overflow-hidden border border-border flex">
                      {block.allocated && process ? (
                        <>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${usedPercent}%` }}
                            transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                            className="h-full flex items-center justify-center font-mono font-bold text-sm"
                            style={{ backgroundColor: process.color, color: '#0a0f1a' }}
                          >
                            {process.name} ({process.size} KB)
                          </motion.div>
                          {fragPercent > 0 && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${fragPercent}%` }}
                              transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
                              className="h-full bg-warning/30 flex items-center justify-center text-xs text-warning font-mono border-l-2 border-dashed border-warning"
                            >
                              {block.internalFragmentation} KB
                            </motion.div>
                          )}
                        </>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground font-mono text-sm">
                          Free ({block.size} KB)
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-mono text-foreground w-16">{block.size} KB</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Allocation Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-muted-foreground text-sm mb-1">Allocated Processes</p>
                <p className="text-2xl font-bold font-mono text-success">
                  {allocatedProcesses.filter(p => p.allocated).length}/{allocatedProcesses.length}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-muted-foreground text-sm mb-1">Used Blocks</p>
                <p className="text-2xl font-bold font-mono text-primary">
                  {allocatedBlocks.filter(b => b.allocated).length}/{allocatedBlocks.length}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-muted-foreground text-sm mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-warning" />
                  Internal Fragmentation
                </p>
                <p className="text-2xl font-bold font-mono text-warning">{totalFragmentation} KB</p>
              </div>
            </div>

            {/* Unallocated Processes Warning */}
            {allocatedProcesses.some(p => !p.allocated) && (
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                <p className="text-destructive text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Some processes could not be allocated:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {allocatedProcesses.filter(p => !p.allocated).map(p => (
                    <span 
                      key={p.id} 
                      className="px-2 py-1 rounded text-xs font-mono font-semibold"
                      style={{ backgroundColor: p.color, color: '#0a0f1a' }}
                    >
                      {p.name} ({p.size} KB)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allocation Steps */}
            <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-3">Allocation Steps</h4>
              <div className="space-y-2 text-sm">
                {allocatedProcesses.map((process, index) => {
                  const block = allocatedBlocks.find(b => b.id === process.blockId);
                  return (
                    <motion.div
                      key={process.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="flex items-start gap-3 p-2 rounded bg-background/50"
                    >
                      <div 
                        className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: process.color, color: '#0a0f1a' }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <span className="font-mono font-semibold" style={{ color: process.color }}>{process.name}</span>
                        <span className="text-muted-foreground"> ({process.size} KB) → </span>
                        {process.allocated && block ? (
                          <>
                            <span className="text-success font-semibold">Allocated to Block {allocatedBlocks.indexOf(block) + 1}</span>
                            <span className="text-muted-foreground"> ({block.size} KB)</span>
                            {block.internalFragmentation && block.internalFragmentation > 0 && (
                              <span className="text-warning"> [Fragmentation: {block.internalFragmentation} KB]</span>
                            )}
                          </>
                        ) : (
                          <span className="text-destructive font-semibold">Not allocated (no suitable block)</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
