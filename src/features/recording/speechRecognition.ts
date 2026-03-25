import { requireOptionalNativeModule } from "expo";
import { useEffect, useRef } from "react";
import type {
  ExpoSpeechRecognitionNativeEventMap,
  ExpoSpeechRecognitionOptions,
} from "expo-speech-recognition";

type NativeSubscription = {
  remove: () => void;
};

type PermissionResponseLike = {
  granted: boolean;
};

type SpeechRecognitionModule = {
  addListener: <EventName extends keyof ExpoSpeechRecognitionNativeEventMap>(
    eventName: EventName,
    listener: (event: ExpoSpeechRecognitionNativeEventMap[EventName]) => void,
  ) => NativeSubscription;
  isRecognitionAvailable: () => boolean;
  requestPermissionsAsync: () => Promise<PermissionResponseLike>;
  start: (options: ExpoSpeechRecognitionOptions) => void;
  stop: () => void;
  supportsRecording: () => boolean;
};

const speechRecognitionModule =
  requireOptionalNativeModule<SpeechRecognitionModule>("ExpoSpeechRecognition") ?? null;

export const hasSpeechRecognitionNativeModule = speechRecognitionModule !== null;

export { speechRecognitionModule };

export function useSpeechRecognitionListener<
  EventName extends keyof ExpoSpeechRecognitionNativeEventMap,
>(
  eventName: EventName,
  listener: (event: ExpoSpeechRecognitionNativeEventMap[EventName]) => void,
) {
  const listenerRef = useRef(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    if (!speechRecognitionModule) {
      return;
    }

    const subscription = speechRecognitionModule.addListener(eventName, (event) => {
      listenerRef.current(event);
    });

    return () => {
      subscription.remove();
    };
  }, [eventName]);
}
