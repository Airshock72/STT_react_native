import type { ReactNode } from "react";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";

const noop = () => {};

type NavItemProps = {
  icon: ReactNode;
  label: string;
  selected?: boolean;
};

function NavItem({ icon, label, selected = false }: NavItemProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      className="items-center"
      onPress={noop}
    >
      {icon}
      <Text
        className="mt-2 text-[12px] font-medium"
        style={{ color: selected ? colors.textMain : colors.textMuted }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function BottomNavigation() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === "ios" ? 18 : 14);

  return (
    <View
      className="absolute inset-x-0 bottom-0"
      style={{
        paddingBottom: bottomInset,
        backgroundColor: colors.canvas,
      }}
    >
      <View className="px-8 pb-2 pt-5">
        <View className="flex-row items-end justify-between">
          <NavItem
            icon={
              <MaterialCommunityIcons
                name="file-plus-outline"
                size={30}
                color={colors.iconSoft}
              />
            }
            label={"\u10d0\u10e3\u10d3\u10d8\u10dd \u10e4\u10d0\u10d8\u10da\u10d8"}
          />

          <NavItem
            selected
            icon={
              <View
                className="h-14 w-14 items-center justify-center rounded-2xl bg-primary"
                style={{
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.18,
                  shadowRadius: 18,
                  elevation: 6,
                }}
              >
                <Feather name="mic" size={22} color="#FFFFFF" />
              </View>
            }
            label={"\u10e9\u10d0\u10ec\u10d4\u10e0\u10d0"}
          />

          <NavItem
            icon={<FontAwesome name="youtube-play" size={34} color={colors.youtube} />}
            label="YouTube Link"
          />
        </View>
      </View>
    </View>
  );
}
