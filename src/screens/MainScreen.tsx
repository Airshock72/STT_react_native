import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export function MainScreen() {
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

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-canvas"
      style={{ backgroundColor: colors.canvas }}
    >
      <View className="flex-1 bg-canvas">
        <Header />
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
    </SafeAreaView>
  );
}
