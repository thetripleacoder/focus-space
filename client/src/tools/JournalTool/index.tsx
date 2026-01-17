import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import JournalInput from './JournalInput';
import JournalList from './JournalList';
import journalService from '../../services/journal';

const journalKeys = {
  all: ['journal'],
  lists: () => [...journalKeys.all, 'list'],
};

export default function JournalTool() {
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: journalKeys.lists(),
    queryFn: journalService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createEntryMutation = useMutation({
    mutationFn: journalService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: journalService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
    },
  });

  const addEntry = (note: string) => {
    createEntryMutation.mutate({ note });
  };

  const removeEntry = (id: string) => {
    deleteEntryMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <Box display='flex' flexDirection='column' gap={2}>
        <Typography variant='h6'>🧠 Focus Journal</Typography>
        <Typography>Loading journal entries...</Typography>
      </Box>
    );
  }

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <Typography variant='h6'>🧠 Focus Journal</Typography>
      <JournalInput onAdd={addEntry} />
      <JournalList entries={entries} onRemove={removeEntry} />
    </Box>
  );
}
