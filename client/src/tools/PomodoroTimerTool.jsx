import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PropTypes from 'prop-types';

const PomodoroTimerTool = ({
  focusDuration = 25, // minutes
  breakDuration = 5,
  onSessionComplete,
}) => {
  const [isFocus, setIsFocus] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            const nextIsFocus = !isFocus;
            setIsFocus(nextIsFocus);
            const nextDuration = nextIsFocus ? focusDuration : breakDuration;
            setSecondsLeft(nextDuration * 60);
            setIsRunning(false);
            if (onSessionComplete)
              onSessionComplete(isFocus ? 'focus' : 'break');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setSecondsLeft(isFocus ? focusDuration * 60 : breakDuration * 60);
    setIsRunning(false);
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      gap={2}
      p={2}
      borderRadius={2}
      bgcolor={isFocus ? '#ffe0e0' : '#e0f7fa'}
      boxShadow={3}
    >
      <Typography variant='h6' fontWeight='bold'>
        {isFocus ? 'Focus Time' : 'Break Time'}
      </Typography>

      <CircularProgress
        variant='determinate'
        value={
          (secondsLeft / (isFocus ? focusDuration * 60 : breakDuration * 60)) *
          100
        }
        size={120}
        thickness={4}
      />
      <Typography variant='h4' fontFamily='monospace'>
        {formatTime(secondsLeft)}
      </Typography>

      <Box display='flex' gap={2}>
        <Button
          variant='contained'
          color={isRunning ? 'error' : 'primary'}
          onClick={() => setIsRunning((prev) => !prev)}
        >
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <IconButton onClick={handleReset}>
          <RestartAltIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

PomodoroTimerTool.propTypes = {
  focusDuration: PropTypes.number,
  breakDuration: PropTypes.number,
  onSessionComplete: PropTypes.func,
};

export default PomodoroTimerTool;
