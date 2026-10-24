"use client";

import * as React from "react";
import type { Book } from "@/types/book";
import { toPersianDigits } from "@/lib/formatters";

export const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

export interface PlayerControlsType {
  currentBook: Book | null;
  isPlaying: boolean;
  duration: number;
  playbackRate: PlaybackSpeed;
  isMuted: boolean;
  playBook: (book: Book) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  skip: (seconds: number) => void;
  cycleSpeed: () => void;
  toggleMute: () => void;
  closePlayer: () => void;
}

export interface PlayerContextType extends PlayerControlsType {
  currentTime: number;
}

const PlayerContext = React.createContext<PlayerControlsType | null>(null);
const PlayerTimeContext = React.createContext<number>(0);

/**
 * Parses Persian or standard duration string to seconds, defaulting to 180s (3m).
 */
export function parseDuration(duration?: string): number {
  if (!duration) return 180;

  // Convert Persian digits to Latin
  const normalized = duration.replace(/[۰-۹]/g, (d) =>
    String(d.charCodeAt(0) - 1776)
  );

  const hoursMatch = normalized.match(/(\d+)\s*(?:ساعت|hour|h)/i);
  const minsMatch = normalized.match(/(\d+)\s*(?:دقیقه|min|m)/i);
  const secsMatch = normalized.match(/(\d+)\s*(?:ثانیه|sec|s)/i);

  if (hoursMatch || minsMatch || secsMatch) {
    const h = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const m = minsMatch ? parseInt(minsMatch[1], 10) : 0;
    const s = secsMatch ? parseInt(secsMatch[1], 10) : 0;
    const total = h * 3600 + m * 60 + s;
    if (total > 0) return total;
  }

  // Check for "MM:SS" or "HH:MM:SS" format
  const parts = normalized.split(":").map((p) => parseInt(p.trim(), 10));
  if (parts.length === 2 && !parts.some(Number.isNaN)) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && !parts.some(Number.isNaN)) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  const rawNum = parseInt(normalized.replace(/[^\d]/g, ""), 10);
  if (!Number.isNaN(rawNum) && rawNum > 0) {
    return rawNum;
  }

  return 180;
}

/**
 * Formats seconds into Persian-digit time string (HH:MM:SS or MM:SS).
 */
export function formatSec(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  if (hours > 0) {
    return `${toPersianDigits(hours)}:${toPersianDigits(pad(minutes))}:${toPersianDigits(pad(secs))}`;
  }
  return `${toPersianDigits(pad(minutes))}:${toPersianDigits(pad(secs))}`;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentBook, setCurrentBook] = React.useState<Book | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(180);
  const [playbackRate, setPlaybackRate] = React.useState<PlaybackSpeed>(1);
  const [isMuted, setIsMuted] = React.useState(false);

  // Simulated audio playback timer
  // ponytail: simulated timer interval; upgrade to Web Audio API or HTMLAudioElement when backend audio streams are connected
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + playbackRate;
        if (next >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, playbackRate, duration]);

  const currentTimeRef = React.useRef(0);
  currentTimeRef.current = currentTime;

  const playBook = React.useCallback((book: Book) => {
    const dur = parseDuration(book.duration);
    setCurrentBook(book);
    setDuration(dur);
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  const togglePlay = React.useCallback(() => {
    setIsPlaying((prev) => {
      if (!prev && currentTimeRef.current >= duration) {
        setCurrentTime(0);
      }
      return !prev;
    });
  }, [duration]);

  const seek = React.useCallback(
    (time: number) => {
      setCurrentTime(Math.max(0, Math.min(time, duration)));
    },
    [duration]
  );

  const skip = React.useCallback(
    (seconds: number) => {
      setCurrentTime((prev) => Math.max(0, Math.min(prev + seconds, duration)));
    },
    [duration]
  );

  const cycleSpeed = React.useCallback(() => {
    setPlaybackRate((prev) => {
      const idx = PLAYBACK_SPEEDS.indexOf(prev);
      const nextIdx = (idx + 1) % PLAYBACK_SPEEDS.length;
      return PLAYBACK_SPEEDS[nextIdx];
    });
  }, []);

  const toggleMute = React.useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const closePlayer = React.useCallback(() => {
    setIsPlaying(false);
    setCurrentBook(null);
    setCurrentTime(0);
  }, []);

  const value = React.useMemo<PlayerControlsType>(
    () => ({
      currentBook,
      isPlaying,
      duration,
      playbackRate,
      isMuted,
      playBook,
      togglePlay,
      seek,
      skip,
      cycleSpeed,
      toggleMute,
      closePlayer,
    }),
    [
      currentBook,
      isPlaying,
      duration,
      playbackRate,
      isMuted,
      playBook,
      togglePlay,
      seek,
      skip,
      cycleSpeed,
      toggleMute,
      closePlayer,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>
      <PlayerTimeContext.Provider value={currentTime}>
        {children}
      </PlayerTimeContext.Provider>
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerControlsType {
  const context = React.useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}

export function usePlayerTime(): number {
  return React.useContext(PlayerTimeContext);
}
