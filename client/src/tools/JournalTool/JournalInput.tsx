import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

export default function JournalInput({
  onAdd,
}: {
  onAdd: (note: string) => void;
}) {
  const [note, setNote] = useState('');

  const handleAdd = () => {
    if (!note.trim()) return;
    onAdd(note);
    setNote('');
  };

  return (
    <Box display='flex' flexDirection='column' gap={1}>
      <TextField
        label="What's on your mind?"
        multiline
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        fullWidth
      />
      <Button variant='contained' onClick={handleAdd}>
        Log Entry
      </Button>
    </Box>
  );
}
