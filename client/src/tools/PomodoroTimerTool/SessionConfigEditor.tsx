import { TextField } from '@mui/material';

const SessionConfigEditor = ({
  focusMinutes,
  breakMinutes,
  totalSessions,
  setFocusMinutes,
  setBreakMinutes,
  setTotalSessions,
}) => (
  <>
    <TextField
      label='Focus Minutes'
      type='number'
      value={focusMinutes}
      onChange={(e) => setFocusMinutes(Number(e.target.value))}
      fullWidth
      margin='dense'
      inputProps={{ min: 1 }}
    />
    <TextField
      label='Break Minutes'
      type='number'
      value={breakMinutes}
      onChange={(e) => setBreakMinutes(Number(e.target.value))}
      fullWidth
      margin='dense'
      inputProps={{ min: 1 }}
    />
    <TextField
      label='Total Sessions'
      type='number'
      value={totalSessions}
      onChange={(e) => setTotalSessions(Number(e.target.value))}
      fullWidth
      margin='dense'
      inputProps={{ min: 1 }}
    />
  </>
);

export default SessionConfigEditor;
