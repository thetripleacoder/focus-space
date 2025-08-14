import { useState } from 'react';
import { Box, IconButton, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ToolSidebar from './ToolSidebar';
import BuildTool from '../tools/BuildTool';
import SettingsTool from '../tools/SettingsTool';
import CodeTool from '../tools/CodeTool';
import Menu from './Menu';
import PropTypes from 'prop-types';
import PomodoroTimer from '../tools/PomodoroTimer';

const TOOLBAR_WIDTH = 64;
const MENU_HEIGHT = 64;

const toolRegistry = {
  pomodoro: PomodoroTimer,
  build: BuildTool,
  settings: SettingsTool,
  code: CodeTool,
};

const AppLayout = ({ children }) => {
  const [activeTool, setActiveTool] = useState(null);
  const ToolComponent = activeTool ? toolRegistry[activeTool] : null;

  return (
    <>
      {/* Fixed Top Menu */}
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

      {/* Fixed Sidebar */}
      <Box
        position='fixed'
        top={MENU_HEIGHT}
        left={0}
        width={TOOLBAR_WIDTH}
        height={`calc(100vh - ${MENU_HEIGHT}px)`}
        zIndex={1000}
      >
        <ToolSidebar onSelectTool={setActiveTool} />
      </Box>

      {/* Main Content Area */}
      <Box
        display='flex'
        flexDirection='row'
        marginTop={`${MENU_HEIGHT}px`}
        marginLeft={`${TOOLBAR_WIDTH}px`}
        height={`calc(100vh - ${MENU_HEIGHT}px)`}
        overflow='hidden' // prevent outer scroll
      >
        {/* Animated Tool Panel */}
        {ToolComponent && (
          <Slide direction='right' in={true} mountOnEnter unmountOnExit>
            <Box
              flex={1}
              p={2}
              borderLeft='1px solid #ddd'
              bgcolor='#fafafa'
              position='relative'
              display='flex'
              flexDirection='column'
            >
              <Box position='absolute' top={8} right={8}>
                <IconButton onClick={() => setActiveTool(null)} size='small'>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box flex={1} mt={4}>
                <ToolComponent />
              </Box>
            </Box>
          </Slide>
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
