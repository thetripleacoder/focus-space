import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Collapse, Fade, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ToolSidebar from './ToolSidebar';
import Menu from './Menu';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Tool Components
import PomodoroTimerTool from '../tools/PomodoroTimerTool';
import TasksTool from '../tools/TasksTool';
import JournalTool from '../tools/JournalTool';

const TOOLBAR_WIDTH = 64;
const MENU_HEIGHT = 64;
const MIN_WIDTH = 240;
const MAX_WIDTH_RATIO = 0.5;

const toolRegistry = {
  pomodoro: {
    component: PomodoroTimerTool,
    title: 'Pomodoro Timer',
    collapsible: true,
  },
  tasks: {
    component: TasksTool,
    title: 'Task Manager',
    collapsible: true,
  },
  journal: {
    component: JournalTool,
    title: 'Focus Journal',
    collapsible: true,
  },
};

const AppLayout = ({ children }) => {
  const [selectedTools, setSelectedTools] = useState([]);
  const [collapsedTools, setCollapsedTools] = useState({});
  const [toolsWidth, setToolsWidth] = useState(320);

  const layoutRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('selectedTools');
    if (saved) setSelectedTools(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedTools', JSON.stringify(selectedTools));
  }, [selectedTools]);

  const handleToolSelect = (toolKey) => {
    if (!selectedTools.includes(toolKey)) {
      setSelectedTools([...selectedTools, toolKey]);
    }
  };

  const handleToolClose = (toolKey) => {
    setSelectedTools((prev) => prev.filter((key) => key !== toolKey));
  };

  const toggleCollapse = (toolKey) => {
    setCollapsedTools((prev) => ({
      ...prev,
      [toolKey]: !prev[toolKey],
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(selectedTools);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setSelectedTools(reordered);
  };

  const handleResize = (e) => {
    const layoutWidth = layoutRef.current?.offsetWidth || window.innerWidth;
    const newWidth = Math.min(
      Math.max(e.clientX - TOOLBAR_WIDTH, MIN_WIDTH),
      layoutWidth * MAX_WIDTH_RATIO
    );
    setToolsWidth(newWidth);
  };

  return (
    <>
      {/* Top Menu */}
      <Box
        position='fixed'
        top={0}
        left={0}
        right={0}
        height={MENU_HEIGHT}
        zIndex={1100}
      >
        <Menu />
      </Box>

      {/* Sidebar */}
      <Box
        position='fixed'
        top={MENU_HEIGHT}
        left={0}
        width={TOOLBAR_WIDTH}
        height={`calc(100vh - ${MENU_HEIGHT}px)`}
        zIndex={1000}
      >
        <ToolSidebar
          onSelectTool={handleToolSelect}
          selectedTools={selectedTools}
        />
      </Box>

      {/* Main Layout */}
      <Box
        ref={layoutRef}
        display='flex'
        flexDirection='row'
        marginTop={`${MENU_HEIGHT}px`}
        marginLeft={`${TOOLBAR_WIDTH}px`}
        height={`calc(100vh - ${MENU_HEIGHT}px)`}
        overflow='hidden'
      >
        {/* Tools Panel */}
        {selectedTools.length > 0 && (
          <Fade in>
            <Box
              width={toolsWidth}
              p={2}
              borderLeft='1px solid #ddd'
              bgcolor='#fafafa'
              display='flex'
              flexDirection='column'
              overflow='auto'
              flexShrink={0}
              position='relative'
            >
              {/* Resizer Handle */}
              <Box
                position='absolute'
                top={0}
                right={0}
                width={6}
                height='100%'
                sx={{ cursor: 'col-resize', zIndex: 10 }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.addEventListener('mousemove', handleResize);
                  document.addEventListener(
                    'mouseup',
                    () => {
                      document.removeEventListener('mousemove', handleResize);
                    },
                    { once: true }
                  );
                }}
              />

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='toolStack'>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      display='flex'
                      flexDirection='column'
                      gap={2}
                    >
                      {selectedTools.map((toolKey, index) => {
                        const {
                          component: ToolComponent,
                          title,
                          collapsible,
                        } = toolRegistry[toolKey];
                        const isCollapsed = collapsedTools[toolKey];

                        return (
                          <Draggable
                            key={toolKey}
                            draggableId={toolKey}
                            index={index}
                          >
                            {(dragProvided, snapshot) => (
                              <Box
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                sx={{
                                  borderBottom: '1px solid #ccc',
                                  pb: 2,
                                  position: 'relative',
                                  transition: 'box-shadow 0.2s ease',
                                  boxShadow: snapshot.isDragging
                                    ? '0 2px 8px rgba(0,0,0,0.2)'
                                    : 'none',
                                  backgroundColor: snapshot.isDragging
                                    ? '#fff'
                                    : 'transparent',
                                }}
                              >
                                <Box
                                  display='flex'
                                  justifyContent='space-between'
                                  alignItems='center'
                                  mb={1}
                                >
                                  <Box display='flex' alignItems='center'>
                                    <Box
                                      {...dragProvided.dragHandleProps}
                                      sx={{
                                        mr: 1,
                                        cursor: 'grab',
                                        transition: 'transform 0.2s ease',
                                        '&:hover': { transform: 'scale(1.2)' },
                                      }}
                                    >
                                      <DragIndicatorIcon fontSize='small' />
                                    </Box>
                                    <Typography variant='subtitle1'>
                                      {title}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    {collapsible && (
                                      <IconButton
                                        onClick={() => toggleCollapse(toolKey)}
                                        size='small'
                                      >
                                        {isCollapsed ? '▶️' : '🔽'}
                                      </IconButton>
                                    )}
                                    <IconButton
                                      onClick={() => handleToolClose(toolKey)}
                                      size='small'
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  </Box>
                                </Box>
                                <Collapse in={!isCollapsed}>
                                  <ToolComponent />
                                </Collapse>
                              </Box>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
            </Box>
          </Fade>
        )}

        {/* Routed Content */}
        <Box flex={1} p={2} overflow='auto' height='100%'>
          {children}
        </Box>
      </Box>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
