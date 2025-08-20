import { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import SessionModal from './SessionModal';
import { PomodoroTimerToolProps } from './types';

const STORAGE_KEY = 'focus-space-pomodoro';

const PomodoroTimerTool = ({
  focusDuration = 25,
  breakDuration = 5,
  onSessionComplete,
}: PomodoroTimerToolProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isFocus, setIsFocus] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [focusMinutes, setFocusMinutes] = useState(focusDuration);
  const [breakMinutes, setBreakMinutes] = useState(breakDuration);
  const [totalSessions, setTotalSessions] = useState(4);
  const [completedSessions, setCompletedSessions] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Persist state
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ isFocus, secondsLeft, isRunning })
    );
  }, [isFocus, secondsLeft, isRunning]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            const nextIsFocus = !isFocus;
            setIsFocus(nextIsFocus);
            const nextDuration = nextIsFocus ? focusMinutes : breakMinutes;
            setSecondsLeft(nextDuration * 60);
            setIsRunning(false);

            if (!nextIsFocus) {
              setCompletedSessions((prev) => prev + 1);
            }

            setIsEditing(nextIsFocus); // Allow editing before next focus
            setShowModal(true);

            onSessionComplete?.(isFocus ? 'focus' : 'break');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, isFocus, focusMinutes, breakMinutes]);

  // Reset timer
  const handleReset = () => {
    clearInterval(intervalRef.current!);
    const resetTime = isFocus ? focusMinutes * 60 : breakMinutes * 60;
    setSecondsLeft(resetTime);
    setIsRunning(false);
  };

  // Manual switch
  const handleManualSwitch = () => {
    clearInterval(intervalRef.current!);
    const nextIsFocus = !isFocus;
    setIsFocus(nextIsFocus);
    const nextDuration = nextIsFocus ? focusMinutes : breakMinutes;
    setSecondsLeft(nextDuration * 60);
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

      <TimerDisplay
        secondsLeft={secondsLeft}
        isFocus={isFocus}
        focusMinutes={focusMinutes}
        breakMinutes={breakMinutes}
      />

      <TimerControls
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        handleReset={handleReset}
        openEditModal={() => {
          setIsEditing(true);
          setShowModal(true);
        }}
        handleManualSwitch={handleManualSwitch}
        isFocus={isFocus}
        completedSessions={completedSessions}
        totalSessions={totalSessions}
      />

      <Typography variant='body2'>
        Sessions: {completedSessions} / {totalSessions}
      </Typography>

      <SessionModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setIsEditing(false);
          handleReset();
        }}
        isEditing={isEditing}
        isFocus={isFocus}
        focusMinutes={focusMinutes}
        breakMinutes={breakMinutes}
        totalSessions={totalSessions}
        completedSessions={completedSessions}
        setFocusMinutes={setFocusMinutes}
        setBreakMinutes={setBreakMinutes}
        setTotalSessions={setTotalSessions}
      />
    </Box>
  );
};

export default PomodoroTimerTool;
