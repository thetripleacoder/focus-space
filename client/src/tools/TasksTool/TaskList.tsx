import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const priorityOrder = ['High', 'Medium', 'Low'];

export default function TaskList({
  tasks,
  onRemove,
}: {
  tasks: { text: string; priority: string }[];
  onRemove: (index: number) => void;
}) {
  return (
    <Box display='flex' flexDirection='column' gap={2}>
      {priorityOrder.map((level) => {
        const filtered = tasks
          .map((task, index) => ({ ...task, index }))
          .filter((task) => task.priority === level);

        if (filtered.length === 0) return null;

        return (
          <Box key={level}>
            <Typography variant='subtitle1'>{level} Priority</Typography>
            <List>
              {filtered.map(({ text, priority, index }) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge='end' onClick={() => onRemove(index)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={text}
                    secondary={`Priority: ${priority}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        );
      })}
    </Box>
  );
}
