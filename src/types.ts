export interface TIL {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: {
    source?: 'manual' | 'git' | 'reminder';
    commitHash?: string;
    repository?: string;
  };
}

export interface TILConfig {
  reminderInterval: number | 'never';
}