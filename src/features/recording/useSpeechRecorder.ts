import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import {
  type ExpoSpeechRecognitionErrorEvent,
  type ExpoSpeechRecognitionOptions,
  type ExpoSpeechRecognitionResultEvent,
} from "expo-speech-recognition";

import {
  hasSpeechRecognitionNativeModule,
  speechRecognitionModule,
  useSpeechRecognitionListener,
} from "@/features/recording/speechRecognition";

type RecordingPhase = "idle" | "starting" | "recording" | "stopping" | "recorded";

const RECOGNITION_LOCALE = "ka-GE";
const BASE_AUDIO_MODE = {
  allowsRecording: false,
  interruptionMode: "doNotMix" as const,
  playsInSilentMode: true,
  shouldPlayInBackground: false,
  shouldRouteThroughEarpiece: false,
};
const RECORDING_AUDIO_MODE = {
  ...BASE_AUDIO_MODE,
  allowsRecording: true,
};

const LANGUAGE_NOT_SUPPORTED_MESSAGE =
  "ქართული ენა ამ მოწყობილობაზე მიუწვდომელია.";
const NO_SPEECH_MESSAGE =
  "საუბარი ვერ დაფიქსირდა. კიდევ სცადე.";
const NOT_ALLOWED_MESSAGE =
  "მიკროფონისა და მეტყველების ნებართვა საჭიროა.";
const SERVICE_NOT_ALLOWED_MESSAGE =
  "ამ მოწყობილობაზე მეტყველების ამოცნობა მიუწვდომელია.";
const GENERIC_RECORDING_ERROR_MESSAGE =
  "ჩაწერის დროს შეცდომა მოხდა.";
const START_RECORDING_ERROR_MESSAGE =
  "ჩაწერის დაწყება ვერ მოხერხდა.";
const STOP_RECORDING_ERROR_MESSAGE =
  "ჩაწერის შეჩერება ვერ მოხერხდა.";
const PLAYBACK_UNAVAILABLE_MESSAGE =
  "ამ მოწყობილობაზე ჩაწერილი აუდიოს მოსმენა მიუწვდომელი არ არის.";

function normalizeTranscript(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function appendTranscript(base: string, next: string) {
  const normalizedBase = normalizeTranscript(base);
  const normalizedNext = normalizeTranscript(next);

  if (!normalizedNext) {
    return normalizedBase;
  }

  if (!normalizedBase) {
    return normalizedNext;
  }

  if (normalizedBase.endsWith(normalizedNext)) {
    return normalizedBase;
  }

  return `${normalizedBase} ${normalizedNext}`;
}

function formatAudioTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safeSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function getPrimaryTranscript(event: ExpoSpeechRecognitionResultEvent) {
  return normalizeTranscript(event.results[0]?.transcript ?? "");
}

function mapErrorMessage(event: ExpoSpeechRecognitionErrorEvent) {
  switch (event.error) {
    case "language-not-supported":
      return LANGUAGE_NOT_SUPPORTED_MESSAGE;
    case "no-speech":
      return NO_SPEECH_MESSAGE;
    case "not-allowed":
      return NOT_ALLOWED_MESSAGE;
    case "service-not-allowed":
      return SERVICE_NOT_ALLOWED_MESSAGE;
    default:
      return GENERIC_RECORDING_ERROR_MESSAGE;
  }
}

export function useSpeechRecorder() {
  const [phase, setPhase] = useState<RecordingPhase>("idle");
  const [committedTranscript, setCommittedTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [playbackNotice, setPlaybackNotice] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 200);
  const player = useAudioPlayer(null, { updateInterval: 150 });
  const playbackStatus = useAudioPlayerStatus(player);
  const supportsRecordingPlayback = useMemo(
    () => speechRecognitionModule?.supportsRecording() ?? false,
    [],
  );

  const phaseRef = useRef<RecordingPhase>("idle");
  const committedTranscriptRef = useRef("");
  const interimTranscriptRef = useRef("");
  const audioUriRef = useRef<string | null>(null);

  const setPhaseState = useCallback((nextPhase: RecordingPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  const clearSession = useCallback(() => {
    committedTranscriptRef.current = "";
    interimTranscriptRef.current = "";
    audioUriRef.current = null;
    setVolumeLevel(0);

    startTransition(() => {
      setCommittedTranscript("");
      setInterimTranscript("");
      setAudioUri(null);
    });
  }, []);

  const commitTranscript = useCallback((value: string) => {
    const nextTranscript = appendTranscript(committedTranscriptRef.current, value);
    committedTranscriptRef.current = nextTranscript;
    interimTranscriptRef.current = "";

    startTransition(() => {
      setCommittedTranscript(nextTranscript);
      setInterimTranscript("");
    });
  }, []);

  useEffect(() => {
    void setAudioModeAsync(BASE_AUDIO_MODE);
  }, []);

  useEffect(() => {
    if (!audioUri) {
      player.pause();
      return;
    }

    player.pause();
    player.replace(audioUri);
  }, [audioUri, player]);

  useEffect(() => {
    if (!playbackStatus.didJustFinish) {
      return;
    }

    player.pause();
    void player.seekTo(0);
  }, [playbackStatus.didJustFinish, player]);

  useEffect(() => {
    if (hasSpeechRecognitionNativeModule) {
      return;
    }

    if (recorderState.isRecording && phaseRef.current === "starting") {
      setPhaseState("recording");
    }
  }, [recorderState.isRecording, setPhaseState]);

  useSpeechRecognitionListener("start", () => {
    setPhaseState("recording");
    setErrorMessage(null);
  });

  useSpeechRecognitionListener("audiostart", () => {
    audioUriRef.current = null;
    setAudioUri(null);
  });

  useSpeechRecognitionListener("audioend", (event) => {
    audioUriRef.current = event.uri;
    setAudioUri(event.uri);
  });

  useSpeechRecognitionListener("result", (event) => {
    const transcript = getPrimaryTranscript(event);

    if (!transcript) {
      return;
    }

    if (event.isFinal) {
      commitTranscript(transcript);
      return;
    }

    interimTranscriptRef.current = transcript;
    startTransition(() => {
      setInterimTranscript(transcript);
    });
  });

  useSpeechRecognitionListener("nomatch", () => {
    interimTranscriptRef.current = "";
    setInterimTranscript("");
  });

  useSpeechRecognitionListener("volumechange", (event) => {
    setVolumeLevel(Math.max(0, event.value));
  });

  useSpeechRecognitionListener("error", (event) => {
    if (event.error === "aborted") {
      setPhaseState("idle");
      return;
    }

    setErrorMessage(mapErrorMessage(event));
  });

  useSpeechRecognitionListener("end", () => {
    const trailingTranscript = normalizeTranscript(interimTranscriptRef.current);

    if (trailingTranscript) {
      commitTranscript(trailingTranscript);
    }

    setVolumeLevel(0);
    void setAudioModeAsync(BASE_AUDIO_MODE);

    const hasSessionOutput =
      Boolean(audioUriRef.current) || Boolean(committedTranscriptRef.current);

    setPhaseState(hasSessionOutput ? "recorded" : "idle");
  });

  const startRecording = useCallback(async () => {
    if (
      phaseRef.current === "starting" ||
      phaseRef.current === "recording" ||
      phaseRef.current === "stopping"
    ) {
      return;
    }

    if (!speechRecognitionModule || !hasSpeechRecognitionNativeModule) {
      try {
        const permissionResponse = await requestRecordingPermissionsAsync();

        if (!permissionResponse.granted) {
          setErrorMessage(NOT_ALLOWED_MESSAGE);
          return;
        }

        player.pause();
        clearSession();
        setErrorMessage(null);
        setPlaybackNotice(null);
        setPhaseState("starting");

        await setAudioModeAsync(RECORDING_AUDIO_MODE);
        await recorder.prepareToRecordAsync();
        recorder.record();
      } catch {
        setPhaseState("idle");
        setErrorMessage(START_RECORDING_ERROR_MESSAGE);
      }

      return;
    }

    if (!speechRecognitionModule.isRecognitionAvailable()) {
      setErrorMessage(SERVICE_NOT_ALLOWED_MESSAGE);
      return;
    }

    try {
      const permissionResponse =
        await speechRecognitionModule.requestPermissionsAsync();

      if (!permissionResponse.granted) {
        setErrorMessage(NOT_ALLOWED_MESSAGE);
        return;
      }

      player.pause();
      clearSession();
      setErrorMessage(null);
      setPlaybackNotice(supportsRecordingPlayback ? null : PLAYBACK_UNAVAILABLE_MESSAGE);
      setPhaseState("starting");

      const recognitionOptions: ExpoSpeechRecognitionOptions = {
        addsPunctuation: true,
        continuous: true,
        interimResults: true,
        iosVoiceProcessingEnabled: true,
        lang: RECOGNITION_LOCALE,
        maxAlternatives: 1,
        recordingOptions: {
          persist: supportsRecordingPlayback,
        },
        volumeChangeEventOptions: {
          enabled: true,
          intervalMillis: 180,
        },
      };

      speechRecognitionModule.start(recognitionOptions);
    } catch {
      setPhaseState("idle");
      setErrorMessage(START_RECORDING_ERROR_MESSAGE);
    }
  }, [clearSession, player, recorder, setPhaseState, supportsRecordingPlayback]);

  const stopRecording = useCallback(async () => {
    if (
      phaseRef.current !== "starting" &&
      phaseRef.current !== "recording" &&
      phaseRef.current !== "stopping"
    ) {
      return;
    }

    if (!speechRecognitionModule || !hasSpeechRecognitionNativeModule) {
      try {
        setPhaseState("stopping");
        await recorder.stop();

        const recordedUri =
          recorder.uri ?? recorder.getStatus().url ?? recorderState.url ?? null;

        audioUriRef.current = recordedUri;
        setAudioUri(recordedUri);
        setVolumeLevel(0);
        await setAudioModeAsync(BASE_AUDIO_MODE);
        setPhaseState(recordedUri ? "recorded" : "idle");
      } catch {
        setPhaseState("idle");
        setErrorMessage(STOP_RECORDING_ERROR_MESSAGE);
      }

      return;
    }

    setPhaseState("stopping");
    speechRecognitionModule.stop();
  }, [recorder, recorderState.url, setPhaseState]);

  const togglePlayback = useCallback(async () => {
    if (!audioUriRef.current || !playbackStatus.isLoaded) {
      return;
    }

    if (playbackStatus.playing) {
      player.pause();
      return;
    }

    if (
      playbackStatus.duration > 0 &&
      playbackStatus.currentTime >= playbackStatus.duration - 0.1
    ) {
      await player.seekTo(0);
    }

    player.play();
  }, [
    playbackStatus.currentTime,
    playbackStatus.duration,
    playbackStatus.isLoaded,
    playbackStatus.playing,
    player,
  ]);

  const transcript = useMemo(
    () => appendTranscript(committedTranscript, interimTranscript),
    [committedTranscript, interimTranscript],
  );

  const isRecording =
    phase === "starting" || phase === "recording" || phase === "stopping";
  const isBusy = phase === "starting" || phase === "stopping";
  const hasPlayback = phase === "recorded" && Boolean(audioUri);
  const playbackProgress =
    playbackStatus.duration > 0
      ? playbackStatus.currentTime / playbackStatus.duration
      : 0;

  return {
    elapsedLabel: formatAudioTime(playbackStatus.currentTime),
    errorMessage,
    hasPlayback,
    helperMessage: phase === "recorded" && !hasPlayback ? playbackNotice : null,
    isBusy,
    isPlaying: playbackStatus.playing,
    isRecording,
    playbackProgress,
    transcript,
    volumeLevel,
    startRecording,
    stopRecording,
    togglePlayback,
  };
}
