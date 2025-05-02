"use client"

import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './landing.module.css';
import { useScreenWidth } from '@/hooks/use-screen-width';
import { useIsMobile } from '@/hooks/use-mobile';

interface Word {
  word: string;
  id: string;
}

const SCALE_EFFECT_RADIUS = 250;
const MAX_SCALE_VALUE = .4;

export default function SeveranceWords({ words }: { words: Word[] }) {
  const [coords, setCoords] = useState({ x: 0, y: 0});
  const isSmallerScreen = useScreenWidth();
  const isMobile = useIsMobile();
  const wordsRef = useRef<HTMLParagraphElement>(null);
  const subset = useMemo(() => isSmallerScreen ? words.slice(0,250) : words.slice(0, 500), [isSmallerScreen]);

  const refs= useMemo(
    () => Array.from({ length: subset.length }).map(() => createRef<HTMLSpanElement>()),
    [subset]
  );

  function getScale(idx: number) {
    if (isMobile) return 1;
    
    if (refs && refs[idx] && refs[idx].current) {
      const rect = refs[idx].current.getBoundingClientRect();
      const x = rect.x + (rect.width/2);
      const y = rect.y + (rect.height/2);
      const dx = Math.abs(coords.x - x);
      const dy = Math.abs(coords.y - y);
    
      const distance = Math.sqrt((dx**2) + (dy**2));
      if (distance < SCALE_EFFECT_RADIUS) {
        const scale = 1 + (((SCALE_EFFECT_RADIUS - distance)/SCALE_EFFECT_RADIUS) * MAX_SCALE_VALUE);
        return scale.toFixed(2);
      }
    }
    return 1;
  }

  const getMotion = useCallback((idx: number) => {
    if (idx % 6 === 0) {
      // [6,12,18,24]
      return styles.horizontalDelay;
    } else if (idx % 4 === 0) {
      // [4,8,16,20]
      return styles.verticalDelay;
    } else if (idx % 3 === 0) {
      // [3,9,15,21]
      return styles.horizontal;
    } else if (idx % 2 === 0) {
      // [2,10,14,22]
      return styles.vertical;
    }
    return '';
  }, []);

  
  useEffect(() => {
    const updateCoords = (e: MouseEvent) => {
      if (!wordsRef || !wordsRef.current) return;
      // get height of scroll plus current y on screen to get total page y positioning
      const totalY = window.scrollY + e.clientY;
      // get height of words element plus half of scale effect radius
      const effectZone = wordsRef.current.clientHeight + (SCALE_EFFECT_RADIUS/2);
      if (totalY > effectZone) return;
      setCoords({
        x: e.clientX,
        y: e.clientY
      })
    };
  
    window.addEventListener('mousemove', updateCoords, { passive: true, capture: true });

    return () => {
      window.removeEventListener('mousemove', updateCoords);
    }
  }, []) 

  return (
    <p className={styles.words} ref={wordsRef}>
      {subset.map((item, idx) => (
        <span key={item.id} className={`${styles.word} ${getMotion(idx)}`} ref={refs[idx]} style={{'scale': getScale(idx)}}>{item.word}</span>
      ))}
    </p>
  )
}

