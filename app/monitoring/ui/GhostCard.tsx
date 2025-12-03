'use client';
import React from 'react';
import styles from './GhostCard.module.css';
import { Ghost } from '@/app/entities/ghost/model';
import { Button } from '@/app/shared/ui/Button/Button';

export const GhostCard: React.FC<{ ghost: Ghost; onCapture: (id: string) => void }> = ({ ghost, onCapture }) => {
  const color = ghost.threatLevel === 'Low' ? '#22c55e' : ghost.threatLevel === 'Medium' ? '#f59e0b' : '#ef4444';
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{ghost.name}</h3>
        <span className={styles.badge} style={{ background: color }}>{ghost.threatLevel}</span>
      </div>
      <div className={styles.body}>
        <div>локация: <strong>{ghost.location}</strong></div>
        <div>статус: <strong>{ghost.status}</strong></div>
      </div>
      <div className={styles.actions}>
        <Button disabled={ghost.status === 'Captured'} onClick={() => onCapture(ghost.id)}>
          Capture
        </Button>
      </div>
    </div>
  );
};
