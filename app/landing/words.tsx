"use client"

import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './landing.module.css';
import { useScreenWidth } from '@/hooks/use-screen-width';
import { useIsMobile } from '@/hooks/use-mobile';

interface words {
  word: string;
  definition: string;
  type: string;
}

export default function Words({ words }: { words: words[] }) {
  const [coords, setCoords] = useState({ x: 0, y: 0});
  const isSmallerScreen = useScreenWidth();
  const isMobile = useIsMobile();
  const wordsRef = useRef<HTMLParagraphElement>(null);
  const subset = isSmallerScreen ? words.slice(0,275) : words.slice(0,600);

  const refs= useMemo(
    () => Array.from({ length: words.length }).map(() => createRef<HTMLSpanElement>()),
    []
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
      if (distance < 250) {
        const scale = 1 + (((250 - distance)/250) * .4);
        return scale;
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
  }, []);

  useEffect(() => {
    const updateCoords = (e: MouseEvent) => {
      setCoords({
        x: e.clientX,
        y: e.clientY
      })
    };

    if (wordsRef && wordsRef.current) {
      wordsRef.current.addEventListener('mousemove', updateCoords);
    } else {
      window.addEventListener('mousemove', updateCoords);
    }

    return () => {
      if (wordsRef && wordsRef.current) {
        wordsRef.current.removeEventListener('mousemove', updateCoords);
      } else {
        window.removeEventListener('mousemove', updateCoords);
      }
    }
  }, []) 

  return (
    <p className={styles.words} ref={wordsRef}>
      {subset.map((item, idx) => (
        <span key={item.word + idx} className={`${styles.word} ${getMotion(idx)}`} ref={refs[idx]} style={{'scale': getScale(idx)}}>{item.word}</span>
      ))}
    </p>
  )
}

