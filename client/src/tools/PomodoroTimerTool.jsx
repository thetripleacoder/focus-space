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

const STORAGE_KEY = 'focus-space-pomodoro';

const PomodoroTimerTool = ({
  focusDuration = 25,
  breakDuration = 5,
  onSessionComplete,
}) => {
  const intervalRef = useRef(null);

  const getInitialState = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          isFocus: parsed.isFocus ?? true,
          secondsLeft: parsed.secondsLeft ?? focusDuration * 60,
          isRunning: parsed.isRunning ?? false,
        };
      } catch {
        return {
          isFocus: true,
          secondsLeft: focusDuration * 60,
          isRunning: false,
        };
      }
    }
    return {
      isFocus: true,
      secondsLeft: focusDuration * 60,
      isRunning: false,
    };
  };

  const initial = getInitialState();
  const [isFocus, setIsFocus] = useState(initial.isFocus);
  const [secondsLeft, setSecondsLeft] = useState(initial.secondsLeft);
  const [isRunning, setIsRunning] = useState(initial.isRunning);

  // Persist entire state to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ isFocus, secondsLeft, isRunning })
    );
  }, [isFocus, secondsLeft, isRunning]);

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
    const resetTime = isFocus ? focusDuration * 60 : breakDuration * 60;
    setSecondsLeft(resetTime);
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
