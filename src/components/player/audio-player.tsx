"use client";

import * as React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
  Headphones,
} from "lucide-react";
import { usePlayer, formatSec } from "@/context/player-context";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/formatters";

export function AudioPlayer() {
  const {
    currentBook,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    isMuted,
    togglePlay,
    seek,
    skip,
    cycleSpeed,
    toggleMute,
    closePlayer,
  } = usePlayer();

  const [failedBookId, setFailedBookId] = React.useState<string | null>(null);

  if (!currentBook) {
    return null;
  }

  const imgError = failedBookId === currentBook.id;
  const narratorOrAuthor = currentBook.narrator
    ? `با صدای ${currentBook.narrator}`
    : currentBook.author;

  return (
    <div
      role="region"
      aria-label="پخش‌کننده صوتی"
      className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-2xl py-3 px-4 animate-in slide-in-from-bottom duration-200"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Right side: Book cover thumbnail, title (bold truncate), narrator/author name */}
        <div className="flex items-center gap-3 w-full md:w-1/4 justify-start min-w-0">
          <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-muted shadow-sm shrink-0 border border-border/50">
            {!imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentBook.cover}
                alt={currentBook.title}
                onError={() => setFailedBookId(currentBook.id)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-primary">
                <Headphones className="size-5" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-0.5 text-right">
            <h4
              className="font-bold text-sm truncate text-foreground leading-tight"
              title={currentBook.title}
            >
              {currentBook.title}
            </h4>
            <p
              className="text-xs text-muted-foreground truncate"
              title={narratorOrAuthor}
            >
              {narratorOrAuthor}
            </p>
          </div>
        </div>

        {/* Center: Playback controls & Progress timeline */}
        <div className="flex-1 max-w-lg w-full flex flex-col items-center gap-1.5">
          {/* Controls: Skip 15s back button, Play/Pause button, Skip 30s forward button */}
          <div className="flex items-center gap-4" dir="ltr">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => skip(-15)}
              aria-label="۱۵ ثانیه به عقب"
              title="۱۵ ثانیه به عقب"
              className="size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              <RotateCcw className="size-4" />
            </Button>

            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={togglePlay}
              aria-label={isPlaying ? "توقف پخش" : "پخش"}
              title={isPlaying ? "توقف پخش" : "پخش"}
              className="size-10 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-md cursor-pointer transition-transform active:scale-95 flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" />
              ) : (
                <Play className="size-5 fill-current ml-0.5" />
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => skip(30)}
              aria-label="۳۰ ثانیه به جلو"
              title="۳۰ ثانیه به جلو"
              className="size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              <RotateCw className="size-4" />
            </Button>
          </div>

          {/* Progress timeline: Current time, Slider, Duration */}
          <div
            className="w-full flex items-center gap-2.5 text-xs text-muted-foreground font-mono select-none"
            dir="ltr"
          >
            <span className="tabular-nums w-12 text-right text-[11px] font-sans">
              {formatSec(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={1}
              onValueChange={(val) => {
                if (Array.isArray(val) && typeof val[0] === "number") {
                  seek(val[0]);
                } else if (typeof val === "number") {
                  seek(val);
                }
              }}
              className="flex-1 cursor-pointer"
              aria-label="تایم‌لاین موقعیت پخش"
            />
            <span className="tabular-nums w-12 text-left text-[11px] font-sans">
              {formatSec(duration)}
            </span>
          </div>
        </div>

        {/* Left side: Speed badge button, Mute button, Close button */}
        <div className="flex items-center gap-2 w-full md:w-1/4 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={cycleSpeed}
            aria-label={`تغییر سرعت پخش، سرعت فعلی ${toPersianDigits(playbackRate)} برابر`}
            title="تغییر سرعت پخش"
            className="h-8 px-2 text-xs font-bold rounded-lg cursor-pointer hover:bg-muted transition-colors font-mono"
          >
            <span>{toPersianDigits(playbackRate)}x</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            aria-label={isMuted ? "وصل صدا" : "قطع صدا"}
            title={isMuted ? "وصل صدا" : "قطع صدا"}
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="size-4 text-destructive" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={closePlayer}
            aria-label="بستن پلیر"
            title="بستن پلیر"
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
