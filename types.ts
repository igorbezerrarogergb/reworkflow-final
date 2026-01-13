
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum Status {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CANCELLED = 'Cancelled'
}

export interface ReworkTicket {
  id: string;
  title: string;
  description: string;
  department: string;
  priority: Priority;
  status: Status;
  cost: number;
  hours: number;
  createdAt: string;
  rootCause?: string;
}

export interface AIAnalysisResult {
  suggestion: string;
  estimatedRisk: string;
  preventiveMeasures: string[];
  category: string;
}
