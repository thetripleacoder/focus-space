import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import JournalInput from './JournalInput';
import JournalList from './JournalList';

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

  useEffect(() => {
    const handleStorageChange = () => {
      const updated = localStorage.getItem(STORAGE_KEY);
      if (updated) setEntries(JSON.parse(updated));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addEntry = (note: string) => {
    const timestamp = new Date().toLocaleString();
    const newEntries = [{ note, timestamp }, ...entries];
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const removeEntry = (index: number) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <Typography variant='h6'>🧠 Focus Journal</Typography>
      <JournalInput onAdd={addEntry} />
      <JournalList entries={entries} onRemove={removeEntry} />
    </Box>
  );
}
