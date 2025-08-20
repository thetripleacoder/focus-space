import { CircularProgress, Typography } from '@mui/material';

const formatTime = (secs: number) => {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
};

const TimerDisplay = ({ secondsLeft, isFocus, focusMinutes, breakMinutes }) => (
  <>
    <CircularProgress
      variant='determinate'
      value={
        ((isFocus ? focusMinutes * 60 : breakMinutes * 60) * 100) / secondsLeft
      }
      size={120}
      thickness={4}
    />
    <Typography variant='h4' fontFamily='monospace'>
      {formatTime(secondsLeft)}
    </Typography>
  </>
);

export default TimerDisplay;
