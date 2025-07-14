export interface TIL {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TILConfig {
  reminderInterval: number | 'never';
}