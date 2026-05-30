"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  isSpeechSupported,
  warmUpSpeech,
  waitForVoices,
  speakLineNaturally,
} from "@/lib/speech-engine";

interface UseNeuronVoiceOptions {
  onLineStart?: (line: string, index: number) => void;
  onLineEnd?: (line: string, index: number) => void;
  onComplete?: () => void;
  onSpeakingChange?: (speaking: boolean) => void;
}

function pause(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function useNeuronVoice({
  onLineStart,
  onLineEnd,
  onComplete,
  onSpeakingChange,
}: UseNeuronVoiceOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLine, setCurrentLine] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [voiceReady, setVoiceReady] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);
  const cancelledRef = useRef(false);
  const levelIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingLinesRef = useRef<string[] | null>(null);

  useEffect(() => {
    if (!isSpeechSupported()) return;

    warmUpSpeech();
    waitForVoices(4000).then((voices) => {
      setVoiceReady(voices.length > 0);
    });

    return () => {
      cancelledRef.current = true;
      window.speechSynthesis?.cancel();
      if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
    };
  }, []);

  const startLevelSimulation = useCallback(() => {
    if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
    levelIntervalRef.current = setInterval(() => {
      setAudioLevel((prev) => {
        const target = 0.35 + Math.random() * 0.45;
        return prev * 0.6 + target * 0.4;
      });
    }, 120);
  }, []);

  const stopLevelSimulation = useCallback(() => {
    if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
    levelIntervalRef.current = null;
    setAudioLevel(0);
  }, []);

  const runSequence = useCallback(
    async (lines: string[]) => {
      cancelledRef.current = false;
      setNeedsUnlock(false);

      await waitForVoices(2000);
      warmUpSpeech();
      window.speechSynthesis?.resume();
      window.speechSynthesis?.cancel();

      for (let i = 0; i < lines.length; i++) {
        if (cancelledRef.current) break;

        const line = lines[i];
        setCurrentLine(line);
        onLineStart?.(line, i);
        setIsSpeaking(true);
        onSpeakingChange?.(true);
        startLevelSimulation();

        await speakLineNaturally(line, i, false);

        stopLevelSimulation();
        if (cancelledRef.current) break;

        onLineEnd?.(line, i);
      }

      setIsSpeaking(false);
      setCurrentLine("");
      onSpeakingChange?.(false);
      onComplete?.();
    },
    [onLineStart, onLineEnd, onComplete, onSpeakingChange, startLevelSimulation, stopLevelSimulation]
  );

  const speakSequence = useCallback(
    async (lines: string[]) => {
      pendingLinesRef.current = lines;

      if (!isSpeechSupported()) {
        for (let i = 0; i < lines.length; i++) {
          if (cancelledRef.current) break;
          setCurrentLine(lines[i]);
          onLineStart?.(lines[i], i);
          await pause(1800);
          onLineEnd?.(lines[i], i);
        }
        setCurrentLine("");
        onComplete?.();
        return;
      }

      warmUpSpeech();
      window.speechSynthesis?.resume();

      const voices = await waitForVoices(1500);
      if (voices.length === 0) {
        setNeedsUnlock(true);
        return;
      }

      await runSequence(lines);
    },
    [runSequence, onLineStart, onLineEnd, onComplete]
  );

  const unlockAndSpeak = useCallback(
    async (lines?: string[]) => {
      warmUpSpeech();
      window.speechSynthesis?.resume();

      const voices = await waitForVoices(3000);
      setVoiceReady(voices.length > 0);
      setNeedsUnlock(false);

      const toSpeak = lines ?? pendingLinesRef.current;
      if (toSpeak && !cancelledRef.current) {
        await runSequence(toSpeak);
      }
    },
    [runSequence]
  );

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    pendingLinesRef.current = null;
    window.speechSynthesis?.cancel();
    stopLevelSimulation();
    setIsSpeaking(false);
    setCurrentLine("");
    setNeedsUnlock(false);
    onSpeakingChange?.(false);
  }, [stopLevelSimulation, onSpeakingChange]);

  return {
    isSpeaking,
    currentLine,
    audioLevel,
    voiceReady,
    needsUnlock,
    speakSequence,
    unlockAndSpeak,
    cancel,
  };
}
