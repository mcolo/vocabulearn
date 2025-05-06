"use client"

import React, { useCallback, useEffect, useMemo } from 'react';
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
  const isSmallerScreen = useScreenWidth();
  const isMobile = useIsMobile();
  const subset = useMemo(() => isSmallerScreen ? words.slice(0,250) : words.slice(0, 500), [isSmallerScreen]);


  const getScale = useCallback((el: HTMLSpanElement, clientX: number, clientY: number) => {
    if (isMobile) return "1";
    
    if (el) {
      let rect = {x:0, y:0};
      let mid =  {x:0, y:0};
      rect.x = (el.offsetLeft + (el.parentElement?.offsetLeft || 0));
      rect.y = (el.offsetTop - window.scrollY);
      mid.x = rect.x + (el.offsetWidth/2);
      mid.y = rect.y + (el.offsetHeight/2);
      const dx = clientX - mid.x;
      const dy = clientY - mid.y;
    
      const distance = Math.abs(dx) + Math.abs(dy);
      if (distance < SCALE_EFFECT_RADIUS) {
        const scale = 1 + (((SCALE_EFFECT_RADIUS - distance)/SCALE_EFFECT_RADIUS) * MAX_SCALE_VALUE);
        return scale.toFixed(2);
      }
    }
    return "1";
  }, [isMobile]);

  const getMotion = useCallback((idx: number) => {
    if (idx % 6 === 0) {
      // [6,12,18,24,...]
      return styles.horizontalDelay;
    } else if (idx % 4 === 0) {
      // [4,8,16,20,...]
      return styles.verticalDelay;
    } else if (idx % 3 === 0) {
      // [3,9,15,21,...]
      return styles.horizontal;
    } else if (idx % 2 === 0) {
      // [2,10,14,22,...]
      return styles.vertical;
    }
    return '';
  }, []);

  useEffect(() => {
    const wordElements = document.querySelectorAll<HTMLSpanElement>(`span.${styles.word}`);
    const handler = (e: MouseEvent) => {
      wordElements.forEach((el) => {
        const { clientX, clientY } = e;
        const scale = getScale(el, clientX, clientY);
        el.style.scale = scale;
      })
    }

    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);


  return (
    <p className={styles.words}>
      {subset.map((item, idx) => (
        <span key={item.id} className={`${styles.word} ${getMotion(idx)}`}>{item.word}</span>
      ))}
    </p>
  )
}
