import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import TaskInput from './TaskInput';
import TaskList from './TaskList';

const STORAGE_KEY = 'focus-space-tasks';

export default function TasksTool() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const updated = localStorage.getItem(STORAGE_KEY);
      if (updated) setTasks(JSON.parse(updated));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addTask = (text: string, priority: string) => {
    const newTasks = [...tasks, { text, priority }];
    setTasks(newTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
  };

  const removeTask = (index: number) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <Typography variant='h6'>🗂️ Task Prioritizer</Typography>
      <TaskInput onAdd={addTask} />
      <TaskList tasks={tasks} onRemove={removeTask} />
    </Box>
  );
}
