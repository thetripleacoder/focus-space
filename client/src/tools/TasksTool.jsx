import { useState } from 'react';
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

const priorities = ['High', 'Medium', 'Low'];

export default function TasksTool() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('Medium');

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { text: input, priority }]);
    setInput('');
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

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
