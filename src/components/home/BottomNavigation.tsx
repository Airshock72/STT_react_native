import type { ReactNode } from "react";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";

const noop = () => {};

type BottomNavigationProps = {
  isRecording: boolean;
  isBusy?: boolean;
  onAudioFilePress?: () => void;
  onPrimaryPress: () => void;
  onYoutubePress?: () => void;
};

type NavItemProps = {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
  selected?: boolean;
};

function NavItem({ icon, label, onPress = noop, selected = false }: NavItemProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      className="items-center"
      onPress={onPress}
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

export function BottomNavigation({
  isBusy = false,
  isRecording,
  onAudioFilePress = noop,
  onPrimaryPress,
  onYoutubePress = noop,
}: BottomNavigationProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === "ios" ? 18 : 14);

  return (
    <View
      className="border-t px-8 pb-2 pt-4"
      style={{
        backgroundColor: colors.canvas,
        borderColor: colors.divider,
        paddingBottom: bottomInset,
      }}
    >
      <View className="flex-row items-end justify-between">
        <NavItem
          icon={
            <MaterialCommunityIcons
              name="file-plus-outline"
              size={30}
              color={colors.iconSoft}
            />
          }
          label='აუდიო ფაილი'
          onPress={onAudioFilePress}
        />

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.88}
          className="items-center"
          disabled={isBusy}
          onPress={onPrimaryPress}
          style={{ opacity: isBusy ? 0.72 : 1 }}
        >
          <View
            className="h-14 w-14 items-center justify-center rounded-[18px]"
            style={{
              backgroundColor: isRecording ? colors.recordingStop : colors.primary,
              shadowColor: isRecording ? colors.recordingStop : colors.primary,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.18,
              shadowRadius: 18,
              elevation: 6,
            }}
          >
            {isRecording ? (
              <MaterialIcons name="stop" size={24} color="#FFFFFF" />
            ) : (
              <Feather name="mic" size={22} color="#FFFFFF" />
            )}
          </View>
          <Text
            className="mt-2 text-[12px] font-medium"
            style={{ color: colors.textMain }}
          >
            {isRecording ? 'შეჩერება' : 'ჩაწერა'}
          </Text>
        </TouchableOpacity>

        <NavItem
          icon={
            <FontAwesome
              name="youtube-play"
              size={34}
              color={colors.youtube}
            />
          }
          label='Youtube Link'
          onPress={onYoutubePress}
        />
      </View>
    </View>
  );
}
