import { useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme/colors";

const noop = () => {};

function GeorgiaFlag() {
  return (
    <View
      className="h-7 w-10 items-center justify-center rounded-[10px] bg-white"
      style={{ borderColor: "#E5E7EB", borderWidth: 1 }}
    >
      <View className="h-full w-full items-center justify-center">
        <View className="absolute h-[18px] w-[4px] rounded-full bg-[#E53935]" />
        <View className="absolute h-[4px] w-[18px] rounded-full bg-[#E53935]" />

        <View
          className="absolute left-[6px] top-[5px] h-[6px] w-[6px] items-center justify-center"
        >
          <View className="absolute h-[6px] w-[2px] rounded-full bg-[#E53935]" />
          <View className="absolute h-[2px] w-[6px] rounded-full bg-[#E53935]" />
        </View>
        <View
          className="absolute right-[6px] top-[5px] h-[6px] w-[6px] items-center justify-center"
        >
          <View className="absolute h-[6px] w-[2px] rounded-full bg-[#E53935]" />
          <View className="absolute h-[2px] w-[6px] rounded-full bg-[#E53935]" />
        </View>
        <View
          className="absolute bottom-[5px] left-[6px] h-[6px] w-[6px] items-center justify-center"
        >
          <View className="absolute h-[6px] w-[2px] rounded-full bg-[#E53935]" />
          <View className="absolute h-[2px] w-[6px] rounded-full bg-[#E53935]" />
        </View>
        <View
          className="absolute bottom-[5px] right-[6px] h-[6px] w-[6px] items-center justify-center"
        >
          <View className="absolute h-[6px] w-[2px] rounded-full bg-[#E53935]" />
          <View className="absolute h-[2px] w-[6px] rounded-full bg-[#E53935]" />
        </View>
      </View>
    </View>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View>
      {menuOpen ? (
        <View className="flex-row items-center px-5 pb-4 pt-3">
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.8}
            className="mr-2 h-10 w-10 items-center justify-center"
            onPress={() => setMenuOpen(false)}
          >
            <Ionicons name="chevron-back" size={28} color={colors.textMain} />
          </TouchableOpacity>

          <View
            className="h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: "#F1E36C" }}
          >
            <Text
              className="text-[22px] font-medium"
              style={{ color: colors.textMain }}
            >
              A
            </Text>
          </View>

          <View className="ml-3 flex-1 pr-2">
            <Text
              className="text-[16px] font-semibold"
              numberOfLines={1}
              style={{ color: colors.textMain }}
            >
              achi.teruashvili777@gmail.com
            </Text>

            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              className="mt-1 flex-row items-center self-start rounded-full px-3 py-1"
              onPress={noop}
              style={{ backgroundColor: "#7AD6B2" }}
            >
              <Text
                className="text-[12px] font-semibold"
                style={{ color: colors.textMain }}
              >
                {"\u10de\u10e0\u10d4\u10db\u10d8\u10e3\u10db\u10d8"}
              </Text>
              <Ionicons
                name="sparkles"
                size={12}
                color="#F59E0B"
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            className="ml-1 flex-row items-center"
            onPress={noop}
          >
            <GeorgiaFlag />
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color={colors.textMain}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row items-center justify-between px-6 pb-4 pt-3">
          <View className="flex-row items-center gap-2">
            <Text
              className="text-[17px] font-bold tracking-[0.2px] text-textMain"
              style={{ color: colors.textMain }}
            >
              {"\u10ee\u10db\u10d0"}
            </Text>
            <MaterialIcons
              name="swap-horiz"
              size={22}
              color={colors.textMain}
            />
            <Text
              className="text-[17px] font-bold tracking-[0.2px] text-textMain"
              style={{ color: colors.textMain }}
            >
              {"\u10e2\u10d4\u10e5\u10e1\u10e2\u10d8"}
            </Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.8}
            className="h-10 w-10 items-center justify-center"
            onPress={() => setMenuOpen(true)}
          >
            <Ionicons name="menu" size={32} color={colors.textMain} />
          </TouchableOpacity>
        </View>
      )}

      <View className="h-px w-full bg-divider" />
    </View>
  );
}
