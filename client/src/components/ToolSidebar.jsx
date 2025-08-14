import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import PropTypes from 'prop-types';

const TOOLBAR_TOP_OFFSET = 64;

const tools = [
  { id: 'pomodoro', icon: <TimerOutlinedIcon />, label: 'Pomodoro' },
  { id: 'tasks', icon: <TaskAltIcon />, label: 'Tasks' },
  { id: 'journal', icon: <BookOutlinedIcon />, label: 'Journal' },
];

const ToolSidebar = ({ onSelectTool, selectedTools }) => {
  const isSelected = (id) => selectedTools.includes(id);

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
    </Drawer>
  );
};

ToolSidebar.propTypes = {
  onSelectTool: PropTypes.func.isRequired,
  selectedTools: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ToolSidebar;
