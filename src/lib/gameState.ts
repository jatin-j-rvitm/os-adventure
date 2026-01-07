// Game state management for the OS Learning platform

export interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  color: string;
}

export interface MemoryBlock {
  id: string;
  size: number;
  allocated: boolean;
  processId?: string;
  processName?: string;
  internalFragmentation?: number;
}

export interface MemoryProcess {
  id: string;
  name: string;
  size: number;
  color: string;
  allocated: boolean;
  blockId?: string;
}

export interface GanttBlock {
  processId: string;
  processName: string;
  startTime: number;
  endTime: number;
  color: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: 'fcfs' | 'first-fit';
}

export const PROCESS_COLORS = [
  'hsl(185, 80%, 50%)',  // Cyan
  'hsl(160, 70%, 45%)',  // Green
  'hsl(280, 70%, 60%)',  // Purple
  'hsl(38, 92%, 55%)',   // Orange
  'hsl(340, 70%, 55%)',  // Pink
  'hsl(200, 80%, 55%)',  // Blue
];

export const generateProcessId = () => `P${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
export const generateBlockId = () => `B${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

export const calculateFCFS = (processes: Process[]): { gantt: GanttBlock[]; avgWaitTime: number; avgTurnaroundTime: number } => {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const gantt: GanttBlock[] = [];
  let currentTime = 0;
  let totalWaitTime = 0;
  let totalTurnaroundTime = 0;

  sorted.forEach((process) => {
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }

    const waitTime = currentTime - process.arrivalTime;
    const turnaroundTime = waitTime + process.burstTime;

    totalWaitTime += waitTime;
    totalTurnaroundTime += turnaroundTime;

    gantt.push({
      processId: process.id,
      processName: process.name,
      startTime: currentTime,
      endTime: currentTime + process.burstTime,
      color: process.color,
    });

    currentTime += process.burstTime;
  });

  return {
    gantt,
    avgWaitTime: processes.length > 0 ? totalWaitTime / processes.length : 0,
    avgTurnaroundTime: processes.length > 0 ? totalTurnaroundTime / processes.length : 0,
  };
};

export const firstFitAllocation = (
  blocks: MemoryBlock[],
  processes: MemoryProcess[]
): { blocks: MemoryBlock[]; processes: MemoryProcess[] } => {
  const updatedBlocks = blocks.map(b => ({ ...b, allocated: false, processId: undefined, processName: undefined, internalFragmentation: undefined }));
  const updatedProcesses = processes.map(p => ({ ...p, allocated: false, blockId: undefined }));

  updatedProcesses.forEach((process) => {
    for (let i = 0; i < updatedBlocks.length; i++) {
      const block = updatedBlocks[i];
      if (!block.allocated && block.size >= process.size) {
        block.allocated = true;
        block.processId = process.id;
        block.processName = process.name;
        block.internalFragmentation = block.size - process.size;
        process.allocated = true;
        process.blockId = block.id;
        break;
      }
    }
  });

  return { blocks: updatedBlocks, processes: updatedProcesses };
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'In FCFS scheduling, which process gets CPU first?',
    options: [
      'The process with shortest burst time',
      'The process that arrives first',
      'The process with highest priority',
      'Random selection'
    ],
    correctIndex: 1,
    explanation: 'FCFS (First Come First Serve) allocates CPU to processes in the order they arrive in the ready queue.',
    topic: 'fcfs'
  },
  {
    id: 'q2',
    question: 'What is the main disadvantage of FCFS scheduling?',
    options: [
      'Complex implementation',
      'Starvation of short processes',
      'Convoy effect (short processes wait for long ones)',
      'Requires priority assignment'
    ],
    correctIndex: 2,
    explanation: 'The convoy effect occurs when short processes get stuck behind long ones, leading to poor average waiting time.',
    topic: 'fcfs'
  },
  {
    id: 'q3',
    question: 'First Fit memory allocation searches for:',
    options: [
      'The smallest block that fits the process',
      'The largest available block',
      'The first block large enough to fit the process',
      'A block of exact size'
    ],
    correctIndex: 2,
    explanation: 'First Fit allocates the first memory block that is large enough to accommodate the process.',
    topic: 'first-fit'
  },
  {
    id: 'q4',
    question: 'What is internal fragmentation?',
    options: [
      'Unused memory outside allocated blocks',
      'Unused memory inside an allocated block',
      'Memory corruption',
      'Process overflow'
    ],
    correctIndex: 1,
    explanation: 'Internal fragmentation is the wasted space inside an allocated memory block when the process doesn\'t use the entire block.',
    topic: 'first-fit'
  },
  {
    id: 'q5',
    question: 'Is FCFS a preemptive scheduling algorithm?',
    options: [
      'Yes, it can interrupt running processes',
      'No, once a process starts it runs to completion',
      'Only for I/O bound processes',
      'Depends on the OS implementation'
    ],
    correctIndex: 1,
    explanation: 'FCFS is non-preemptive. Once a process gets the CPU, it runs until it finishes or blocks for I/O.',
    topic: 'fcfs'
  },
  {
    id: 'q6',
    question: 'What happens in First Fit if no block is large enough?',
    options: [
      'The process is split across blocks',
      'The largest block is used anyway',
      'The process cannot be allocated (must wait)',
      'Memory is automatically expanded'
    ],
    correctIndex: 2,
    explanation: 'If no suitable block is found, the process cannot be allocated and must wait until memory becomes available.',
    topic: 'first-fit'
  }
];
