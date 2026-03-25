import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActionRow } from "@/components/home/ActionRow";
import { BottomNavigation } from "@/components/home/BottomNavigation";
import { Header } from "@/components/home/Header";
import { RecordingPlaybackBar } from "@/components/home/RecordingPlaybackBar";
import {
  defaultSpeechSettings,
  SettingsSheet,
  type SpeechSettings,
} from "@/components/home/SettingsSheet";
import { TranscriptPanel } from "@/components/home/TranscriptPanel";
import { useSpeechRecorder } from "@/features/recording/useSpeechRecorder";
import { colors } from "@/theme/colors";
import { createStory, type Story } from "@/types/story";

const noop = () => {};

type MainScreenProps = {
  onHistoryPress?: () => void;
  onStorySave?: (story: Story) => void;
};

export function MainScreen({
  onHistoryPress = noop,
  onStorySave = noop,
}: MainScreenProps) {
  const insets = useSafeAreaInsets();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [speechSettings, setSpeechSettings] =
    useState<SpeechSettings>(defaultSpeechSettings);

  const {
    elapsedLabel,
    errorMessage,
    hasPlayback,
    helperMessage,
    isBusy,
    isPlaying,
    isRecording,
    playbackProgress,
    startRecording,
    stopRecording,
    togglePlayback,
    transcript,
  } = useSpeechRecorder();

  const prevHasPlayback = useRef(false);

  useEffect(() => {
    if (hasPlayback && !prevHasPlayback.current) {
      const story = createStory(transcript, null);
      onStorySave(story);
    }
    prevHasPlayback.current = hasPlayback;
  }, [hasPlayback, transcript, onStorySave]);

  const handleAudioFilePick = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) {
        return;
      }

      const asset = result.assets[0];
      const fileName = asset.name?.replace(/\.[^.]+$/, "") ?? "აუდიო ფაილი";
      const story = createStory(fileName, asset.uri);
      onStorySave(story);
    } catch {
      // user cancelled or error
    }
  }, [onStorySave]);

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.canvas,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <View className="flex-1">
        <Header onHistoryPress={onHistoryPress} />
        <ActionRow onSettingsPress={() => setIsSettingsOpen(true)} />
        <TranscriptPanel
          errorMessage={errorMessage}
          helperMessage={helperMessage}
          isRecording={isRecording}
          transcript={transcript}
        />
        {hasPlayback ? (
          <RecordingPlaybackBar
            elapsedLabel={elapsedLabel}
            isPlaying={isPlaying}
            onTogglePlayback={togglePlayback}
            progress={playbackProgress}
          />
        ) : null}
        <BottomNavigation
          isBusy={isBusy}
          isRecording={isRecording}
          onAudioFilePress={handleAudioFilePick}
          onPrimaryPress={isRecording ? stopRecording : startRecording}
        />
      </View>
      <SettingsSheet
        onCancel={() => setIsSettingsOpen(false)}
        onSave={(nextSettings) => {
          setSpeechSettings(nextSettings);
          setIsSettingsOpen(false);
        }}
        value={speechSettings}
        visible={isSettingsOpen}
      />
    </View>
  );
}
