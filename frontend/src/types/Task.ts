import { v4 as uuidv4 } from 'uuid';

export interface Task {
  taskId: string;
  code: string;
  language: string;
  questionId: string|undefined;
}

export const createTask = (taskData: Omit<Task, 'taskId'>): Task => {
  return {
    ...taskData,
    taskId: uuidv4()
  };
};
