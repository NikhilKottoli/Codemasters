import { v4 as uuidv4 } from 'uuid';

export interface TaskSubmit {
  taskId: string;
  code: string;
  language: string;
  questionId: string|undefined;
}


export interface TaskRun {
  taskId: string;
  code: string;
  language: string;
  questionId: string|undefined;
  input: string;
  output: string;
}

export interface TaskResult {
  taskId: string;
  questionId: string;
  status: 'pending' | 'completed' | 'failed';
  output?: string;
  completedAt?: string;
  userId: string;
}

export const createTask = (taskData: Omit<TaskSubmit, 'taskId'>|Omit<TaskRun,'taskId'>): TaskSubmit|TaskRun => {
  return {
    ...taskData,
    taskId: uuidv4()
  };
};
