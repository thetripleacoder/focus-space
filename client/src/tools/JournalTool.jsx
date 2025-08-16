import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const STORAGE_KEY = 'focus-space-journal';

export default function JournalTool() {
  const [entries, setEntries] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [note, setNote] = useState('');

  const addEntry = () => {
    if (!note.trim()) return;
    const timestamp = new Date().toLocaleString();
    const newEntries = [{ note, timestamp }, ...entries];
    setEntries(newEntries);
    setNote('');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    // console.log('New entry added:', newEntries);
  };

  // Optional: sync localStorage if entries change externally
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = localStorage.getItem(STORAGE_KEY);
      if (updated) setEntries(JSON.parse(updated));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <Typography variant='h6'>🧠 Focus Journal</Typography>

      <TextField
        label="What's on your mind?"
        multiline
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        fullWidth
      />
      <Button variant='contained' onClick={addEntry}>
        Log Entry
      </Button>

      <List>
        {entries.map((entry, index) => (
          <ListItem key={index} alignItems='flex-start'>
            <ListItemText primary={entry.note} secondary={entry.timestamp} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
