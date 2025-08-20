import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PropTypes from 'prop-types';
import { useState } from 'react';

const TOOLBAR_TOP_OFFSET = 64;

const tools = [
  { id: 'pomodoro', icon: <TimerOutlinedIcon />, label: 'Pomodoro' },
  { id: 'tasks', icon: <TaskAltIcon />, label: 'Tasks' },
  { id: 'journal', icon: <BookOutlinedIcon />, label: 'Journal' },
];

const ToolSidebar = ({ onSelectTool, selectedTools }) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const isSelected = (id) => selectedTools.includes(id);

  return (
    <>
      <Drawer
        variant='permanent'
        anchor='left'
        sx={{
          width: 64,
          position: 'fixed',
          top: `${TOOLBAR_TOP_OFFSET}px`,
          height: `calc(100vh - ${TOOLBAR_TOP_OFFSET}px)`,
          '& .MuiDrawer-paper': {
            width: 64,
            top: `${TOOLBAR_TOP_OFFSET}px`,
            height: `calc(100vh - ${TOOLBAR_TOP_OFFSET}px)`,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
            borderRight: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        }}
      >
        <List>
          {tools.map((tool) => (
            <Tooltip key={tool.id} title={tool.label} placement='right'>
              <ListItemButton
                selected={isSelected(tool.id)}
                onClick={() => onSelectTool(tool.id)}
                sx={{
                  justifyContent: 'center',
                  paddingY: 1.5,
                  '&.Mui-selected': {
                    backgroundColor: '#e0e0e0',
                    '&:hover': {
                      backgroundColor: '#d5d5d5',
                    },
                  },
                  '&:hover': {
                    backgroundColor: '#eeeeee',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    color: isSelected(tool.id) ? '#1976d2' : 'inherit',
                  }}
                >
                  {tool.icon}
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          ))}
        </List>

        <Box sx={{ textAlign: 'center', paddingBottom: 2 }}>
          <Tooltip title='Focus Mode Info' placement='right'>
            <IconButton onClick={() => setInfoOpen(true)}>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Drawer>

      <Drawer
        anchor='left'
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            padding: 2,
            top: `${TOOLBAR_TOP_OFFSET}px`,
            height: `calc(100vh - ${TOOLBAR_TOP_OFFSET}px)`,
            boxSizing: 'border-box',
          },
        }}
      >
        <Typography variant='h6' gutterBottom>
          🧠 Focus Mode
        </Typography>
        <Typography variant='body2'>
          This space is designed to help you stay focused for short bursts of
          productivity.
          <br />
          <br />
          Any notes, timers, or tasks you create here are temporarily stored in
          your browser to keep things fast and distraction-free.
          <br />
          <br />
          Your data won’t be saved to a cloud or database, and it may disappear
          if you refresh the page or close your browser.
          <br />
          <br />
          Think of it like a digital scratchpad—perfect for staying in the zone,
          not for long-term storage.
        </Typography>
      </Drawer>
    </>
  );
};

ToolSidebar.propTypes = {
  onSelectTool: PropTypes.func.isRequired,
  selectedTools: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ToolSidebar;
