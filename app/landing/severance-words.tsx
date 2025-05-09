"use client"

import React, { useCallback, useEffect, useMemo } from 'react';
import styles from './landing.module.css';
import { useScreenWidth } from '@/hooks/use-screen-width';
import { useIsMobile } from '@/hooks/use-mobile';

interface Word {
  word: string;
  id: string;
}

const EFFECT_RADIUS = 250;
const MAX_SCALE_VALUE = .35;

export default function SeveranceWords({ words }: { words: Word[] }) {
  const isSmallerScreen = useScreenWidth();
  const isMobile = useIsMobile();
  const subset = useMemo(() => isSmallerScreen ? words.slice(0,250) : words.slice(0, 500), [isSmallerScreen]);

  const getDistance = useCallback((el: HTMLSpanElement, clientX: number, clientY: number) => {
    if (isMobile) return 0;

    let rect = {x:0, y:0};
    let mid =  {x:0, y:0};
    rect.x = (el.offsetLeft + (el.parentElement?.offsetLeft || 0));
    rect.y = (el.offsetTop - window.scrollY);
    mid.x = rect.x + (el.offsetWidth/2);
    mid.y = rect.y + (el.offsetHeight/2);
    const dx = clientX - mid.x;
    const dy = clientY - mid.y;
  
    // const distance = Math.abs(dx) + Math.abs(dy);
    const distance = Math.hypot(dx, dy);
    return (EFFECT_RADIUS - distance) / EFFECT_RADIUS;
  }, [])


  const getScale = useCallback((el: HTMLSpanElement, clientX: number, clientY: number) => {
    if (isMobile) return "1";
    
    let rect = {x:0, y:0};
    let mid =  {x:0, y:0};
    rect.x = (el.offsetLeft + (el.parentElement?.offsetLeft || 0));
    rect.y = (el.offsetTop - window.scrollY);
    mid.x = rect.x + (el.offsetWidth/2);
    mid.y = rect.y + (el.offsetHeight/2);
    const dx = clientX - mid.x;
    const dy = clientY - mid.y;
  
    const distance = Math.abs(dx) + Math.abs(dy);
    if (distance < EFFECT_RADIUS) {
      const scale = 1 + (((EFFECT_RADIUS - distance)/EFFECT_RADIUS) * MAX_SCALE_VALUE);
      return scale.toFixed(2);
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
        const distance = getDistance(el, clientX, clientY);
        let color, scale;
        if (distance > 0) {
          const perc = distance * 100;
          color = `rgb(${241 - perc} ${245 - perc} 249)`
          scale = 1 + (distance * MAX_SCALE_VALUE);
        } else {
          color = 'rgb(241 245 249)';
          scale = 1;
        }
        el.style.scale = scale.toFixed(2);
        // el.style.color = color;
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
