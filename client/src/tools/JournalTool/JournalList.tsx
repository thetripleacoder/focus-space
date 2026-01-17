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
  entries: { id: string; note: string; timestamp: string }[];
  onRemove: (id: string) => void;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (confirmId !== null) {
      onRemove(confirmId);
      setConfirmId(null);
    }
  };

  return (
    <Box>
      <List>
        {entries.map((entry) => (
          <ListItem
            key={entry.id}
            alignItems='flex-start'
            secondaryAction={
              <IconButton edge='end' onClick={() => setConfirmId(entry.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={entry.note}
              secondary={new Date(entry.timestamp).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={confirmId !== null} onClose={() => setConfirmId(null)}>
        <DialogTitle>Delete this journal entry?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button onClick={handleConfirm} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
