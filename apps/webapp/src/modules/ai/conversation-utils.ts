export interface TaskType {
  state: 'Pending' | 'Done';
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponseType = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTasks(thought: any) {
  if (!thought) {
    return {};
  }

  const pendingTask = thought.tasks.find(
    (task: TaskType) => task.state === 'Pending',
  );

  if (!pendingTask) {
    return {};
  }

  const pendingTaskInfo = thought.responses.find((response: ResponseType) =>
    Object.keys(response).includes(pendingTask.name),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tasks = (Object.values(pendingTaskInfo)[0] as any).tasks;

  return {
    pendingTasks: tasks.filter((task: TaskType) => task.state === 'Pending'),
    task: pendingTask,
  };
}
