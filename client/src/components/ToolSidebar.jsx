import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
// import BuildIcon from '@mui/icons-material/Build';
// import SettingsIcon from '@mui/icons-material/Settings';
// import CodeIcon from '@mui/icons-material/Code';
// import TimerIcon from '@mui/icons-material/Timer';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import { useState } from 'react';
import PropTypes from 'prop-types';

const tools = [
  { id: 'pomodoro', icon: <TimerOutlinedIcon />, label: 'Pomodoro' },
  { id: 'tasks', icon: <TaskAltIcon />, label: 'Tasks' },
  { id: 'journal', icon: <BookOutlinedIcon />, label: 'Journal' },
  // { id: 'build', icon: <BuildIcon />, label: 'Build' },
  // { id: 'settings', icon: <SettingsIcon />, label: 'Settings' },
  // { id: 'code', icon: <CodeIcon />, label: 'Code' },
];

const TOOLBAR_TOP_OFFSET = 64; // Match your Menu height

const ToolSidebar = ({ onSelectTool }) => {
  const [activeTool, setActiveTool] = useState(null);

  const handleSelect = (toolId) => {
    setActiveTool(toolId);
    onSelectTool(toolId);
  };

  return (
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
        },
      }}
    >
      <List>
        {tools.map((tool) => (
          <Tooltip key={tool.id} title={tool.label} placement='right'>
            <ListItemButton
              selected={activeTool === tool.id}
              onClick={() => handleSelect(tool.id)}
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
                  color: activeTool === tool.id ? '#1976d2' : 'inherit',
                }}
              >
                {tool.icon}
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

ToolSidebar.propTypes = {
  onSelectTool: PropTypes.func.isRequired,
};

export default ToolSidebar;
