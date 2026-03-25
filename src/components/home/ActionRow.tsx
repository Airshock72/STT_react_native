import type { ComponentProps } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme/colors";

const noop = () => {};

type ActionChipProps = {
  icon: ComponentProps<typeof Ionicons>["name"] | ComponentProps<typeof Feather>["name"];
  label: string;
  variant: "filled" | "outlined";
  iconSet: "ionicons" | "feather";
};

function ActionChip({ icon, iconSet, label, variant }: ActionChipProps) {
  const isFilled = variant === "filled";

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      className={`h-10 flex-row items-center rounded-[8px] px-3 ${
        isFilled ? "bg-primary" : "border border-primary bg-canvas"
      }`}
      onPress={noop}
      style={{
        borderColor: isFilled ? colors.primary : colors.primaryDark,
        backgroundColor: isFilled ? colors.primary : colors.canvas,
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

export function ActionRow() {
  return (
    <View className="flex-row items-center justify-between px-6 pb-3 pt-2">
      <ActionChip
        icon="add"
        iconSet="ionicons"
        label='ახლის გახსნა'
        variant="filled"
      />
      <ActionChip
        icon="settings"
        iconSet="feather"
        label='პარამეტრები'
        variant="outlined"
      />
    </View>
  );
}
