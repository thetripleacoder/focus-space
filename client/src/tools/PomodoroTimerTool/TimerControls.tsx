import { Button, IconButton } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SettingsIcon from '@mui/icons-material/Settings';

const TimerControls = ({
  isRunning,
  setIsRunning,
  handleReset,
  openEditModal,
  handleManualSwitch,
  isFocus,
  completedSessions,
  totalSessions,
}) => (
  <div
    style={{
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      justifyContent: 'center',
    }}
  >
    <Button
      variant='contained'
      color={isRunning ? 'error' : 'primary'}
      onClick={() => setIsRunning((prev) => !prev)}
      disabled={completedSessions >= totalSessions}
    >
      {isRunning ? 'Pause' : 'Start'}
    </Button>
    <IconButton onClick={handleReset}>
      <RestartAltIcon />
    </IconButton>
    <IconButton onClick={openEditModal}>
      <SettingsIcon />
    </IconButton>
    <Button variant='outlined' onClick={handleManualSwitch}>
      Switch to {isFocus ? 'Break' : 'Focus'}
    </Button>
  </div>
);

export default TimerControls;
