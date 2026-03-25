import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActionRow } from "@/components/home/ActionRow";
import { BottomNavigation } from "@/components/home/BottomNavigation";
import { Header } from "@/components/home/Header";
import { TranscriptPlaceholder } from "@/components/home/TranscriptPlaceholder";
import { colors } from "@/theme/colors";

export function MainScreen() {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-canvas"
      style={{ backgroundColor: colors.canvas }}
    >
      <View className="flex-1 bg-canvas">
        <Header />
        <ActionRow />
        <TranscriptPlaceholder />
        <View className="flex-1" />
        <BottomNavigation />
      </View>
    </SafeAreaView>
  );
}
