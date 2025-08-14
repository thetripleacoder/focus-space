import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

export default function JournalTool() {
  const [entries, setEntries] = useState([]);
  const [note, setNote] = useState('');

  const addEntry = () => {
    if (!note.trim()) return;
    const timestamp = new Date().toLocaleString();
    setEntries([{ note, timestamp }, ...entries]);
    setNote('');
  };

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
