import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const STORAGE_KEY = 'focus-space-tasks';
const priorities = ['High', 'Medium', 'Low'];

export default function TasksTool() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('Medium');

  const addTask = () => {
    if (!input.trim()) return;
    const newTasks = [...tasks, { text: input, priority }];
    setTasks(newTasks);
    setInput('');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
  };

  const removeTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Optional: sync across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = localStorage.getItem(STORAGE_KEY);
      if (updated) setTasks(JSON.parse(updated));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <Typography variant='h6'>🗂️ Task Prioritizer</Typography>

      <Box display='flex' gap={1}>
        <TextField
          label='New Task'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
        />
        <IconButton onClick={addTask} color='primary'>
          <AddIcon />
        </IconButton>
      </Box>

      <Box display='flex' gap={1}>
        {priorities.map((p) => (
          <Chip
            key={p}
            label={p}
            color={priority === p ? 'primary' : 'default'}
            onClick={() => setPriority(p)}
          />
        ))}
      </Box>

      <List>
        {tasks.map((task, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge='end' onClick={() => removeTask(index)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={task.text}
              secondary={`Priority: ${task.priority}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
