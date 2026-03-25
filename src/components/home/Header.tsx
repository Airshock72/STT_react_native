import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme/colors";

const noop = () => {};

type HeaderProps = {
  onHistoryPress?: () => void;
};

export function Header({ onHistoryPress = noop }: HeaderProps) {
  return (
    <View>
      <View className="flex-row items-center justify-between px-6 pb-4 pt-3">
        <View className="flex-row items-center gap-2">
          <Text
            className="text-[17px] font-bold tracking-[0.2px]"
            style={{ color: colors.textMain }}
          >
            ხმა
          </Text>
          <MaterialIcons name="swap-horiz" size={22} color={colors.textMain} />
          <Text
            className="text-[17px] font-bold tracking-[0.2px]"
            style={{ color: colors.textMain }}
          >
            ტექსტი
          </Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.8}
          className="h-10 w-10 items-center justify-center"
          hitSlop={10}
          onPress={onHistoryPress}
        >
          <Ionicons name="menu" size={32} color={colors.textMain} />
        </TouchableOpacity>
      </View>

      <View className="h-px w-full" style={{ backgroundColor: colors.divider }} />
    </View>
  );
}
