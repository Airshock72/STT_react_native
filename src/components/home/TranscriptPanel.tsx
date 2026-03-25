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
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        onContentSizeChange={handleContentSizeChange}
        showsVerticalScrollIndicator={hasTranscript}
      >
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
          <Text
            className="text-[16px] leading-[26px]"
            style={{ color: colors.textMain }}
          >
            {transcript}
          </Text>
        ) : (
          <View className="flex-row items-center">
            <Feather
              name="mic"
              size={17}
              color={isRecording ? colors.recordingStop : colors.primary}
            />
            <Text
              className="ml-3 text-[14px]"
              style={{ color: colors.textMuted }}
            >
              {isRecording ? 'ილაპარაკე, ტექსტი რეალურ დროში ჩაიწერება' : 'დაიწყე ჩაწერა, ტექსტი აქ გამოჩნდება.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
