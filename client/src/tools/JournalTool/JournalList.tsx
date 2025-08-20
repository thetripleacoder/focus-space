import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useState } from 'react';

export default function JournalList({
  entries,
  onRemove,
}: {
  entries: { note: string; timestamp: string }[];
  onRemove: (index: number) => void;
}) {
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);

  const handleConfirm = () => {
    if (confirmIndex !== null) {
      onRemove(confirmIndex);
      setConfirmIndex(null);
    }
  };

  return (
    <Box>
      <List>
        {entries.map((entry, index) => (
          <ListItem
            key={index}
            alignItems='flex-start'
            secondaryAction={
              <IconButton edge='end' onClick={() => setConfirmIndex(index)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={entry.note} secondary={entry.timestamp} />
          </ListItem>
        ))}
      </List>

      <Dialog
        open={confirmIndex !== null}
        onClose={() => setConfirmIndex(null)}
      >
        <DialogTitle>Delete this journal entry?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmIndex(null)}>Cancel</Button>
          <Button onClick={handleConfirm} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
