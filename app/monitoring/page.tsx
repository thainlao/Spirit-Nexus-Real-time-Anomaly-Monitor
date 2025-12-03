'use client';
import React, { useEffect } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import styles from './MonitoringPage.module.css';
import { toast } from 'react-hot-toast';
import { Ghost } from '../entities/ghost/model';
import { useCaptureGhost } from '../features/CaptureGhost/useCaptureGhost';
import { Notifications } from '../shared/ui/Notification/Notification';
import { GhostCard } from './ui/GhostCard';

async function fetchGhosts(): Promise<Ghost[]> {
  const res = await axios.get('/api/ghosts');
  return res.data as Ghost[];
}

export default function MonitoringPage() {
  const qc = useQueryClient();

  const { data: ghosts = [] } = useQuery({
    queryKey: ['ghosts'],
    queryFn: fetchGhosts,
    refetchOnWindowFocus: false,
  });

  const capture = useCaptureGhost();

  useEffect(() => {
    const es = new EventSource('/api/ghosts/events');

    es.onmessage = ev => {
      try {
        const payload = JSON.parse(ev.data);

        if (payload.type === 'snapshot') {
          qc.setQueryData(['ghosts'], payload.ghosts);
        }

        if (payload.type === 'threatUpdate') {
          const updated: Ghost = payload.ghost;

          qc.setQueryData<Ghost[]>(['ghosts'], old =>
            old?.map(g =>
              g.id === updated.id
                ? { ...g, threatLevel: updated.threatLevel }
                : g
            )
          );

          toast(`Threat change: ${updated.name} — ${updated.threatLevel}`);
        }
      } catch (e) {
        console.error(e);
      }
    };

    es.onerror = () => {
      console.warn('SSE connection error');
      es.close();
    };

    return () => es.close();
  }, [qc]);

  return (
    <main className={styles.container}>
      <Notifications />
      <h1 className={styles.title}>Monitoring Dashboard — Tokyo</h1>

      <div className={styles.grid}>
        {ghosts.map(g => (
          <GhostCard
            key={g.id}
            ghost={g}
            onCapture={(id) => capture.mutate(id)}
          />
        ))}
      </div>
    </main>
  );
}
