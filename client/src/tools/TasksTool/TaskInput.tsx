import { useState } from 'react';
import { Box, TextField, IconButton, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const priorities = ['High', 'Medium', 'Low'];

export default function TaskInput({
  onAdd,
}: {
  onAdd: (text: string, priority: string) => void;
}) {
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleAdd = () => {
    if (!input.trim()) return;
    onAdd(input, priority);
    setInput('');
  };

  return (
    <Box display='flex' flexDirection='column' gap={1}>
      <Box display='flex' gap={1}>
        <TextField
          label='New Task'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
        />
        <IconButton onClick={handleAdd} color='primary'>
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
    </Box>
  );
}
