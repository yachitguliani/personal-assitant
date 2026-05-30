export interface SpeechProfile {
  rate: number;
  pitch: number;
  pauseAfterMs: number;
  phrasePauseMs: number;
}

const PREFERRED_VOICES = [
  "Natural",
  "Neural",
  "Microsoft Ryan Online",
  "Microsoft Guy Online",
  "Microsoft Mark",
  "Microsoft David",
  "Google UK English Male",
  "Daniel",
  "Alex",
  "Fred",
];

const DEFAULT_PROFILE: SpeechProfile = {
  rate: 0.84,
  pitch: 0.92,
  pauseAfterMs: 1100,
  phrasePauseMs: 420,
};

const STARTUP_PROFILES: SpeechProfile[] = [
  { rate: 0.8, pitch: 0.9, pauseAfterMs: 1400, phrasePauseMs: 500 },
  { rate: 0.83, pitch: 0.91, pauseAfterMs: 1200, phrasePauseMs: 400 },
  { rate: 0.85, pitch: 0.92, pauseAfterMs: 1100, phrasePauseMs: 380 },
  { rate: 0.84, pitch: 0.93, pauseAfterMs: 1000, phrasePauseMs: 350 },
  { rate: 0.84, pitch: 0.93, pauseAfterMs: 1000, phrasePauseMs: 350 },
  { rate: 0.82, pitch: 0.94, pauseAfterMs: 900, phrasePauseMs: 400 },
];

let warmedUp = false;
let cachedVoice: SpeechSynthesisVoice | null = null;
let resumeInterval: ReturnType<typeof setInterval> | null = null;

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function warmUpSpeech(): void {
  if (!isSpeechSupported() || warmedUp) return;
  warmedUp = true;

  const synth = window.speechSynthesis;
  synth.getVoices();

  const warmup = new SpeechSynthesisUtterance("");
  warmup.volume = 0;
  synth.speak(warmup);
  synth.cancel();

  synth.resume();

  if (resumeInterval) clearInterval(resumeInterval);
  resumeInterval = setInterval(() => {
    if (synth.speaking || synth.pending) synth.resume();
  }, 8000);
}

export function waitForVoices(timeoutMs = 3000): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechSupported()) {
      resolve([]);
      return;
    }

    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }

    const timer = setTimeout(() => {
      synth.removeEventListener("voiceschanged", onChange);
      resolve(synth.getVoices());
    }, timeoutMs);

    const onChange = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        clearTimeout(timer);
        synth.removeEventListener("voiceschanged", onChange);
        resolve(voices);
      }
    };

    synth.addEventListener("voiceschanged", onChange);
    synth.getVoices();
  });
}

function scoreVoice(voice: SpeechSynthesisVoice): number {
  let score = 0;
  const name = voice.name;

  if (/natural|neural/i.test(name)) score += 50;
  if (/microsoft ryan|microsoft guy|microsoft mark|microsoft david/i.test(name)) score += 30;
  if (/google uk english male|daniel/i.test(name)) score += 25;
  if (voice.lang.startsWith("en")) score += 10;
  if (/female|zira|samantha|jenny|aria|susan|hazel/i.test(name)) score -= 40;
  if (/online/i.test(name)) score += 5;

  return score;
}

export function pickVoice(voices?: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  if (cachedVoice) return cachedVoice;

  const list = voices ?? window.speechSynthesis.getVoices();
  if (list.length === 0) return null;

  const ranked = [...list]
    .filter((v) => v.lang.startsWith("en"))
    .sort((a, b) => scoreVoice(b) - scoreVoice(a));

  for (const preferred of PREFERRED_VOICES) {
    const match = ranked.find((v) => v.name.includes(preferred));
    if (match) {
      cachedVoice = match;
      return match;
    }
  }

  cachedVoice = ranked[0] ?? list.find((v) => v.lang.startsWith("en")) ?? list[0];
  return cachedVoice;
}

export function getStartupProfile(lineIndex: number): SpeechProfile {
  return STARTUP_PROFILES[lineIndex] ?? DEFAULT_PROFILE;
}

function splitIntoPhrases(text: string): string[] {
  if (text.length < 40) return [text];
  return text
    .split(/(?<=[.,;:])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function speakText(
  text: string,
  options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    cancelFirst?: boolean;
    profile?: SpeechProfile;
  } = {}
): Promise<void> {
  const profile = options.profile ?? DEFAULT_PROFILE;
  const phrases = splitIntoPhrases(text);

  return speakPhrases(phrases, {
    rate: options.rate ?? profile.rate,
    pitch: options.pitch ?? profile.pitch,
    volume: options.volume ?? 1,
    cancelFirst: options.cancelFirst ?? true,
    phrasePauseMs: profile.phrasePauseMs,
  });
}

export function speakPhrases(
  phrases: string[],
  options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    cancelFirst?: boolean;
    phrasePauseMs?: number;
  } = {}
): Promise<void> {
  return new Promise(async (resolve) => {
    if (!isSpeechSupported() || phrases.length === 0) {
      resolve();
      return;
    }

    const synth = window.speechSynthesis;
    if (options.cancelFirst !== false) {
      synth.cancel();
    }
    synth.resume();

    const voice = pickVoice();
    const phrasePause = options.phrasePauseMs ?? DEFAULT_PROFILE.phrasePauseMs;

    for (let i = 0; i < phrases.length; i++) {
      await new Promise<void>((phraseResolve) => {
        const utterance = new SpeechSynthesisUtterance(phrases[i]);
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        } else {
          utterance.lang = "en-US";
        }

        utterance.rate = options.rate ?? DEFAULT_PROFILE.rate;
        utterance.pitch = options.pitch ?? DEFAULT_PROFILE.pitch;
        utterance.volume = options.volume ?? 1;

        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          phraseResolve();
        };

        const wordCount = phrases[i].split(/\s+/).length;
        const timeout = setTimeout(finish, Math.max(3000, wordCount * 520 + 1500));

        utterance.onstart = () => synth.resume();
        utterance.onend = finish;
        utterance.onerror = finish;

        synth.speak(utterance);
        setTimeout(() => synth.resume(), 50);
      });

      if (i < phrases.length - 1) {
        await delay(phrasePause);
      }
    }

    resolve();
  });
}

export async function speakLineNaturally(
  text: string,
  lineIndex: number,
  cancelFirst = false
): Promise<void> {
  const profile = getStartupProfile(lineIndex);
  await speakText(text, { profile, cancelFirst });
  await delay(profile.pauseAfterMs);
}
