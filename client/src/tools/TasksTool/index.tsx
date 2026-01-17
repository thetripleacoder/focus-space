import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import TaskInput from './TaskInput';
import TaskList from './TaskList';
import taskService from '../../services/tasks';

const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
};

export default function TasksTool() {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: taskKeys.lists(),
    queryFn: taskService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createTaskMutation = useMutation({
    mutationFn: taskService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, task }: { id: string; task: any }) =>
      taskService.update(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  const addTask = (text: string, priority: string) => {
    createTaskMutation.mutate({ text, priority: priority.toLowerCase() });
  };

  const toggleTask = (id: string, completed: boolean) => {
    updateTaskMutation.mutate({ id, task: { completed } });
  };

  const removeTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <Box display='flex' flexDirection='column' gap={2}>
        <Typography variant='h6'>🗂️ Task Prioritizer</Typography>
        <Typography>Loading tasks...</Typography>
      </Box>
    );
  }

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <Typography variant='h6'>🗂️ Task Prioritizer</Typography>
      <TaskInput onAdd={addTask} />
      <TaskList tasks={tasks} onToggle={toggleTask} onRemove={removeTask} />
    </Box>
  );
}
