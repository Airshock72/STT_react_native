import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { colors } from "@/theme/colors";

export function TranscriptPlaceholder() {
  return (
    <View className="px-7 pt-1">
      <View className="flex-row items-center">
        <Feather name="mic" size={17} color={colors.primary} />
        <Text
          className="ml-3 text-[14px]"
          style={{ color: colors.textMuted }}
        >
          დაიწყე ჩაწერა...
        </Text>
      </View>
    </View>
  );
}
