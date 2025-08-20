import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import SessionConfigEditor from './SessionConfigEditor';

interface SessionModalProps {
  open: boolean;
  onClose: () => void;
  isEditing: boolean;
  isFocus: boolean;
  focusMinutes: number;
  breakMinutes: number;
  totalSessions: number;
  completedSessions: number;
  setFocusMinutes: (value: number) => void;
  setBreakMinutes: (value: number) => void;
  setTotalSessions: (value: number) => void;
}

const SessionModal = ({
  open,
  onClose,
  isEditing,
  isFocus,
  focusMinutes,
  breakMinutes,
  totalSessions,
  completedSessions,
  setFocusMinutes,
  setBreakMinutes,
  setTotalSessions,
}: SessionModalProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isEditing ? 'Edit Timer Settings' : 'Session Complete'}
      </DialogTitle>

      <DialogContent>
        {!isEditing && (
          <Typography gutterBottom>
            {isFocus ? 'Focus' : 'Break'} session finished.
          </Typography>
        )}

        <SessionConfigEditor
          focusMinutes={focusMinutes}
          breakMinutes={breakMinutes}
          totalSessions={totalSessions}
          setFocusMinutes={setFocusMinutes}
          setBreakMinutes={setBreakMinutes}
          setTotalSessions={setTotalSessions}
        />

        <Typography mt={2}>
          Completed Sessions: {completedSessions} / {totalSessions}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color='primary'>
          {isEditing ? 'Save' : 'Continue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionModal;
