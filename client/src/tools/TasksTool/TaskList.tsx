import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const priorityOrder = ['high', 'medium', 'low'];

export default function TaskList({
  tasks,
  onToggle,
  onRemove,
}: {
  tasks: { id: string; text: string; priority: string; completed: boolean }[];
  onToggle: (id: string, completed: boolean) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <Box display='flex' flexDirection='column' gap={2}>
      {priorityOrder.map((level) => {
        const filtered = tasks.filter((task) => task.priority === level);

        if (filtered.length === 0) return null;

        return (
          <Box key={level}>
            <Typography
              variant='subtitle1'
              sx={{ textTransform: 'capitalize' }}
            >
              {level} Priority
            </Typography>
            <List>
              {filtered.map((task) => (
                <ListItem
                  key={task.id}
                  secondaryAction={
                    <IconButton edge='end' onClick={() => onRemove(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <Checkbox
                    checked={task.completed || false}
                    onChange={(e) => onToggle(task.id, e.target.checked)}
                  />
                  <ListItemText
                    primary={
                      <span
                        style={{
                          textDecoration: task.completed
                            ? 'line-through'
                            : 'none',
                          opacity: task.completed ? 0.6 : 1,
                        }}
                      >
                        {task.text}
                      </span>
                    }
                    secondary={`Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`}
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
