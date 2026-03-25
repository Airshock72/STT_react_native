import { useCallback, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";

import { colors } from "@/theme/colors";

type TranscriptPanelProps = {
  errorMessage: string | null;
  helperMessage: string | null;
  isRecording: boolean;
  transcript: string;
};

export function TranscriptPanel({
  errorMessage,
  helperMessage,
  isRecording,
  transcript,
}: TranscriptPanelProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const hasTranscript = transcript.trim().length > 0;

  const handleContentSizeChange = useCallback(() => {
    if (!hasTranscript) {
      return;
    }

    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [hasTranscript]);

  return (
    <View className="flex-1 px-6 pb-4 pt-2">
      {errorMessage ? (
        <Text
          className="mb-3 text-[13px] font-medium"
          style={{ color: colors.error }}
        >
          {errorMessage}
        </Text>
      ) : null}

      {helperMessage ? (
        <Text
          className="mb-3 text-[13px]"
          style={{ color: colors.textMuted }}
        >
          {helperMessage}
        </Text>
      ) : null}

      {hasTranscript ? (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingBottom: 24,
          }}
          onContentSizeChange={handleContentSizeChange}
          showsVerticalScrollIndicator
        >
          <Text
            className="text-center text-[17px] leading-[28px]"
            style={{ color: colors.textMain }}
          >
            {transcript}
          </Text>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Feather
            name="mic"
            size={32}
            color={isRecording ? colors.recordingStop : colors.primary}
          />
          <Text
            className="mt-4 text-center text-[15px]"
            style={{ color: colors.textMuted }}
          >
            {isRecording ? 'ილაპარაკე, ტექსტი რეალურ დროში ჩაიწერება' : 'დაიწყე ჩაწერა, ტექსტი აქ გამოჩნდება.'}
          </Text>
        </View>
      )}
    </View>
  );
}
