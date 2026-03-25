import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme/colors";

type RecordingPlaybackBarProps = {
  elapsedLabel: string;
  isPlaying: boolean;
  progress: number;
  onTogglePlayback: () => void;
};

export function RecordingPlaybackBar({
  elapsedLabel,
  isPlaying,
  progress,
  onTogglePlayback,
}: RecordingPlaybackBarProps) {
  return (
    <View className="px-6 pb-4">
      <View
        className="rounded-[18px] px-3 py-3"
        style={{ backgroundColor: colors.surfaceSoft }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full"
            onPress={onTogglePlayback}
            style={{ backgroundColor: colors.primary }}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={20}
              color="#FFFFFF"
              style={{ marginLeft: isPlaying ? 0 : 2 }}
            />
          </TouchableOpacity>

          <View className="flex-1">
            <View
              className="h-[5px] overflow-hidden rounded-full"
              style={{ backgroundColor: colors.playerTrack }}
            >
              <View
                className="h-full rounded-full"
                style={{
                  backgroundColor: colors.primary,
                  width: `${Math.max(0, Math.min(progress, 1)) * 100}%`,
                }}
              />
            </View>
            <Text
              className="mt-1 text-[12px] font-medium"
              style={{ color: colors.textMuted }}
            >
              {elapsedLabel}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
