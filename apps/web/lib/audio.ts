"use client";

const audioContextRef: AudioContext | null = null;

export function playSfx(type: "bet" | "cashout") {
  if (typeof window === "undefined") return;

  try {
    const AudioContextConstructor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;

    const context = new AudioContextConstructor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(type === "cashout" ? 880 : 660, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(type === "cashout" ? 1320 : 780, context.currentTime + 0.14);

    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.04, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
    context.close().catch(() => undefined);
  } catch {
    // no-op for browsers without audio support
  }
}
