import { Ghost } from '@/app/entities/ghost/model';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export function useCaptureGhost() {
  const qc = useQueryClient();

  return useMutation<Ghost, Error, string>({
    mutationFn: async (id: string) => {
      const res = await axios.post('/api/ghosts', { id });
      return res.data as Ghost;
    },
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ['ghosts'] });
      const previous = qc.getQueryData<Ghost[]>(['ghosts']);
      qc.setQueryData<Ghost[]>(['ghosts'], old =>
        old ? old.map(g => (g.id === id ? { ...g, status: 'Captured' } : g)) : old
      );
      return { previous };
    },
    onError: (_err, _id, context: any) => {
      if (context?.previous) qc.setQueryData(['ghosts'], context.previous);
      toast.error('Capture failed — откатено');
    },
    onSuccess: () => {
      toast.success('Captured');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['ghosts'] });
    },
  });
}
