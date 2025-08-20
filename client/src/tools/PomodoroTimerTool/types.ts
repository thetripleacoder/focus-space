export interface PomodoroTimerToolProps {
  focusDuration?: number;
  breakDuration?: number;
  onSessionComplete?: (type: 'focus' | 'break') => void;
}

export interface SessionModalProps {
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

export interface TimerDisplayProps {
  secondsLeft: number;
  isFocus: boolean;
  focusMinutes: number;
  breakMinutes: number;
}

export interface TimerControlsProps {
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  handleReset: () => void;
  openEditModal: () => void;
  handleManualSwitch: () => void;
  isFocus: boolean;
  completedSessions: number;
  totalSessions: number;
}

export interface SessionConfigEditorProps {
  focusMinutes: number;
  breakMinutes: number;
  totalSessions: number;
  setFocusMinutes: (value: number) => void;
  setBreakMinutes: (value: number) => void;
  setTotalSessions: (value: number) => void;
}
