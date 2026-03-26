import { useCallback, useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "@/theme/colors";

const noop = () => {};

type Language = "ka" | "en" | "ru";

type LanguageOption = {
  code: Language;
  flag: string;
  label: string;
};

const LANGUAGES: LanguageOption[] = [
  { code: "ka", flag: "🇬🇪", label: "ქართული" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "ru", flag: "🇷🇺", label: "Русский" },
];

type HistoryHeaderProps = {
  language?: Language;
  onBack?: () => void;
  onLanguageChange?: (language: Language) => void;
  userEmail?: string;
};

export function HistoryHeader({
  language = "ka",
  onBack = noop,
  onLanguageChange = noop,
  userEmail = "achi.teruashvili777@gmail.com",
}: HistoryHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentLanguage = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  const handleSelect = useCallback(
    (code: Language) => {
      onLanguageChange(code);
      setDropdownOpen(false);
    },
    [onLanguageChange],
  );

  return (
    <View>
      <View className="flex-row items-center px-4 pb-4 pt-3">
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.8}
          className="mr-2 h-10 w-10 items-center justify-center"
          hitSlop={10}
          onPress={onBack}
        >
          <Ionicons name="chevron-back" size={28} color={colors.textMain} />
        </TouchableOpacity>

        <View
          className="mr-2 h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: "#E8E0A0" }}
        >
          <Text className="text-[16px] font-bold" style={{ color: "#6B6320" }}>
            {userEmail.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View className="flex-1">
          <Text
            className="text-[15px] font-semibold"
            numberOfLines={1}
            style={{ color: colors.textMain }}
          >
            {userEmail}
          </Text>
          <View
            className="mt-1 flex-row items-center self-start rounded-full px-2 py-0.5"
            style={{ backgroundColor: "#E6F9E6", borderColor: "#A8D8A8", borderWidth: 1 }}
          >
            <Text className="text-[11px]">⭐</Text>
            <Text
              className="ml-1 text-[11px] font-semibold"
              style={{ color: "#2D7A2D" }}
            >
              პრემიუმი
            </Text>
          </View>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          className="ml-2 flex-row items-center rounded-[8px] px-3 py-2"
          hitSlop={6}
          onPress={() => setDropdownOpen(true)}
          style={{
            backgroundColor: colors.surfaceSoft,
            borderColor: colors.divider,
            borderWidth: 1,
          }}
        >
          <Text className="text-[18px]">{currentLanguage.flag}</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={20}
            color={colors.textMain}
            style={{ marginLeft: 2 }}
          />
        </TouchableOpacity>
      </View>

      <View className="h-px w-full" style={{ backgroundColor: colors.divider }} />

      <Modal
        animationType="fade"
        onRequestClose={() => setDropdownOpen(false)}
        transparent
        visible={dropdownOpen}
      >
        <Pressable
          onPress={() => setDropdownOpen(false)}
          style={styles.dropdownBackdrop}
        >
          <View style={styles.dropdownContainer}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                accessibilityRole="button"
                activeOpacity={0.84}
                className="flex-row items-center px-4 py-3"
                onPress={() => handleSelect(lang.code)}
                style={
                  lang.code !== LANGUAGES[0].code
                    ? { borderTopWidth: 1, borderColor: colors.divider }
                    : undefined
                }
              >
                <Text className="mr-3 text-[20px]">{lang.flag}</Text>
                <Text
                  className="flex-1 text-[15px] font-medium"
                  style={{
                    color:
                      lang.code === language
                        ? colors.primaryDark
                        : colors.textMain,
                  }}
                >
                  {lang.label}
                </Text>
                {lang.code === language ? (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={colors.primaryDark}
                  />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    flex: 1,
    justifyContent: "center",
  },
  dropdownContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    elevation: 8,
    minWidth: 220,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
});
