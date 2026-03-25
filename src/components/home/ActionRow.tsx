import type { ComponentProps } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme/colors";

const noop = () => {};

type ActionRowProps = {
  onNewPress?: () => void;
  onSettingsPress?: () => void;
};

type ActionChipProps = {
  icon: ComponentProps<typeof Ionicons>["name"] | ComponentProps<typeof Feather>["name"];
  iconSet: "ionicons" | "feather";
  label: string;
  onPress?: () => void;
  variant: "filled" | "outlined";
};

function ActionChip({
  icon,
  iconSet,
  label,
  onPress = noop,
  variant,
}: ActionChipProps) {
  const isFilled = variant === "filled";

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      className={`h-10 flex-row items-center rounded-[8px] px-3 ${
        isFilled ? "bg-primary" : "border border-primary bg-canvas"
      }`}
      hitSlop={8}
      onPress={onPress}
      style={{
        backgroundColor: isFilled ? colors.primary : colors.canvas,
        borderColor: isFilled ? colors.primary : colors.primaryDark,
      }}
    >
      {iconSet === "ionicons" ? (
        <Ionicons
          name={icon as ComponentProps<typeof Ionicons>["name"]}
          size={17}
          color={isFilled ? "#FFFFFF" : colors.primaryDark}
        />
      ) : (
        <Feather
          name={icon as ComponentProps<typeof Feather>["name"]}
          size={16}
          color={isFilled ? "#FFFFFF" : colors.primaryDark}
        />
      )}

      <Text
        className={`ml-2 text-[13px] font-semibold ${
          isFilled ? "text-white" : "text-primaryDark"
        }`}
        style={{ color: isFilled ? "#FFFFFF" : colors.primaryDark }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function ActionRow({
  onNewPress = noop,
  onSettingsPress = noop,
}: ActionRowProps) {
  return (
    <View className="flex-row items-center justify-between px-6 pb-3 pt-2">
      <ActionChip
          icon="add"
          iconSet="ionicons"
          label='ახლის გახსნა'
          onPress={onNewPress}
          variant="filled"
      />
      <ActionChip
          icon="settings"
          iconSet="feather"
          label='პარამეტრები'
          onPress={onSettingsPress}
          variant="outlined"
      />
    </View>
  );
}
