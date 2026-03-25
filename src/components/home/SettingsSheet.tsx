import { useCallback, useMemo, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";

const noop = () => {};

const LANGUAGE_OPTIONS = [
  "ქართული",
  "ინგლისური",
  "ესპანური",
  "ფრანგული",
  "გერმანული",
  "იტალიური",
  "არაბული",
  "თურქული",
  "ჰინდი",
  "ბენგალური",
  "ნიდერლანდური",
  "პორტუგალიური",
] as const;

const SPEAKER_OPTION = "მოსაუბრის გამოყოფა";
const AUDIO_INPUT_MIC = "მიკროფონი";
const AUDIO_INPUT_SYSTEM = "სისტემის ხმა";
const PUNCTUATION_LABEL = "პუნქტუაცია";
const AUTOCORRECT_LABEL = "ავტოკორექტი";
const CANCEL_LABEL = "გაუქმება";
const SAVE_LABEL = "დამახსოვრება";
const SEARCH_LABEL = "ძიება";

type SettingsFieldKey = "audioInput" | "language" | "model" | "speaker";

export type SpeechSettings = {
  audioInput: string;
  autocorrect: boolean;
  language: string;
  model: "STT1" | "STT2" | "STT3";
  punctuation: boolean;
  speaker: string;
};

type SettingsSheetProps = {
  onCancel?: () => void;
  onSave?: (value: SpeechSettings) => void;
  value: SpeechSettings;
  visible: boolean;
};

type DropdownFieldProps = {
  onSelect: (value: string) => void;
  onToggle: () => void;
  open: boolean;
  options: readonly string[];
  searchable?: boolean;
  searchValue?: string;
  title: string;
  onSearchChange?: (value: string) => void;
};

type CheckboxRowItemProps = {
  checked: boolean;
  label: string;
  onPress: () => void;
};

export const defaultSpeechSettings: SpeechSettings = {
  audioInput: AUDIO_INPUT_MIC,
  autocorrect: false,
  language: LANGUAGE_OPTIONS[0],
  model: "STT1",
  punctuation: true,
  speaker: SPEAKER_OPTION,
};

function DropdownField({
  onSearchChange = noop,
  onSelect,
  onToggle,
  open,
  options,
  searchable = false,
  searchValue = "",
  title,
}: DropdownFieldProps) {
  return (
    <View style={{ zIndex: open ? 30 : 1 }}>
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.86}
        className="h-11 flex-row items-center rounded-[8px] px-3"
        hitSlop={8}
        onPress={onToggle}
        style={{
          backgroundColor: colors.sheetSurface,
          borderColor: open ? colors.primary : colors.sheetBorder,
          borderWidth: 1,
        }}
      >
        <Text className="flex-1 text-[14px]" style={{ color: colors.textMain }}>
          {title}
        </Text>
        <MaterialIcons
          name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={22}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      {open ? (
        <View
          className="mt-1 overflow-hidden rounded-[8px]"
          style={{
            backgroundColor: colors.sheetSurface,
            borderColor: colors.sheetBorder,
            borderWidth: 1,
          }}
        >
          {searchable ? (
            <View
              className="mx-2 mt-2 flex-row items-center rounded-[6px] px-2"
              style={{
                backgroundColor: colors.canvas,
                borderColor: colors.sheetDivider,
                borderWidth: 1,
              }}
            >
              <Feather name="search" size={15} color={colors.textMuted} />
              <TextInput
                className="ml-2 flex-1 py-2 text-[13px]"
                onChangeText={onSearchChange}
                placeholder={SEARCH_LABEL}
                placeholderTextColor={colors.textMuted}
                selectionColor={colors.primary}
                value={searchValue}
              />
            </View>
          ) : null}

          <ScrollView
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
            style={{ maxHeight: searchable ? 140 : 96 }}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                accessibilityRole="button"
                activeOpacity={0.84}
                className="border-t px-3 py-3"
                hitSlop={6}
                onPress={() => onSelect(option)}
                style={{ borderColor: colors.sheetDivider }}
              >
                <Text className="text-[14px]" style={{ color: colors.textMain }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

function CheckboxRowItem({ checked, label, onPress }: CheckboxRowItemProps) {
  return (
    <TouchableOpacity
      accessibilityRole="checkbox"
      activeOpacity={0.84}
      className="flex-1 flex-row items-center"
      hitSlop={8}
      onPress={onPress}
    >
      {checked ? (
        <Ionicons name="checkmark-circle" size={21} color={colors.primaryDark} />
      ) : (
        <Ionicons name="ellipse" size={18} color={colors.checkboxIdle} />
      )}
      <Text
        className="ml-2 text-[14px] font-medium"
        style={{ color: colors.textMain }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function SettingsSheet({
  onCancel = noop,
  onSave = noop,
  value,
  visible,
}: SettingsSheetProps) {
  const insets = useSafeAreaInsets();

  const [draft, setDraft] = useState(value);
  const [languageQuery, setLanguageQuery] = useState("");
  const [openField, setOpenField] = useState<SettingsFieldKey | null>(null);

  const filteredLanguages = useMemo(() => {
    const normalizedQuery = languageQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return LANGUAGE_OPTIONS;
    }

    return LANGUAGE_OPTIONS.filter((option) =>
      option.toLowerCase().includes(normalizedQuery),
    );
  }, [languageQuery]);

  const resetLocalState = useCallback(() => {
    setLanguageQuery("");
    setOpenField(null);
  }, []);

  const handleDismiss = useCallback(
    (mode: "cancel" | "save") => {
      Keyboard.dismiss();
      resetLocalState();
      if (mode === "save") {
        onSave(draft);
      } else {
        onCancel();
      }
    },
    [draft, onCancel, onSave, resetLocalState],
  );

  const toggleField = useCallback((field: SettingsFieldKey) => {
    setOpenField((currentField) => (currentField === field ? null : field));
    if (field !== "language") {
      setLanguageQuery("");
    }
  }, []);

  return (
    <Modal
      animationType="slide"
      onRequestClose={() => handleDismiss("cancel")}
      onShow={() => {
        setDraft(value);
        resetLocalState();
      }}
      transparent
      visible={visible}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          onPress={() => handleDismiss("cancel")}
          style={StyleSheet.absoluteFillObject}
        />

        <View
          style={[
            styles.sheetContainer,
            {
              paddingBottom: Math.max(insets.bottom, 18),
            },
          ]}
        >
          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-y-3">
              <DropdownField
                onSearchChange={setLanguageQuery}
                onSelect={(nextLanguage) => {
                  Keyboard.dismiss();
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    language: nextLanguage,
                  }));
                  setLanguageQuery("");
                  setOpenField(null);
                }}
                onToggle={() => toggleField("language")}
                open={openField === "language"}
                options={filteredLanguages}
                searchable
                searchValue={languageQuery}
                title={draft.language}
              />

              <DropdownField
                onSelect={(nextSpeaker) => {
                  Keyboard.dismiss();
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    speaker: nextSpeaker,
                  }));
                  setOpenField(null);
                }}
                onToggle={() => toggleField("speaker")}
                open={openField === "speaker"}
                options={[SPEAKER_OPTION]}
                title={draft.speaker}
              />

              <DropdownField
                onSelect={(nextModel) => {
                  Keyboard.dismiss();
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    model: nextModel as SpeechSettings["model"],
                  }));
                  setOpenField(null);
                }}
                onToggle={() => toggleField("model")}
                open={openField === "model"}
                options={["STT1", "STT2", "STT3"]}
                title={draft.model}
              />

              <DropdownField
                onSelect={(nextAudioInput) => {
                  Keyboard.dismiss();
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    audioInput: nextAudioInput,
                  }));
                  setOpenField(null);
                }}
                onToggle={() => toggleField("audioInput")}
                open={openField === "audioInput"}
                options={[AUDIO_INPUT_MIC, AUDIO_INPUT_SYSTEM]}
                title={draft.audioInput}
              />

              <View className="flex-row items-center justify-between px-1 pt-1">
                <CheckboxRowItem
                  checked={draft.punctuation}
                  label={PUNCTUATION_LABEL}
                  onPress={() =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      punctuation: !currentDraft.punctuation,
                    }))
                  }
                />
                <CheckboxRowItem
                  checked={draft.autocorrect}
                  label={AUTOCORRECT_LABEL}
                  onPress={() =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      autocorrect: !currentDraft.autocorrect,
                    }))
                  }
                />
              </View>

              <View className="flex-row justify-between pt-3">
                <TouchableOpacity
                  accessibilityRole="button"
                  activeOpacity={0.88}
                  className="mr-3 h-12 flex-1 items-center justify-center rounded-[12px]"
                  hitSlop={8}
                  onPress={() => handleDismiss("cancel")}
                  style={{ backgroundColor: colors.primarySoft }}
                >
                  <Text
                    className="text-[16px] font-semibold"
                    style={{ color: colors.primaryDark }}
                  >
                    {CANCEL_LABEL}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  accessibilityRole="button"
                  activeOpacity={0.88}
                  className="h-12 flex-1 items-center justify-center rounded-[12px]"
                  hitSlop={8}
                  onPress={() => handleDismiss("save")}
                  style={{ backgroundColor: colors.primaryDark }}
                >
                  <Text className="text-[16px] font-semibold text-white">
                    {SAVE_LABEL}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: colors.sheetBackdrop,
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: colors.sheetSurface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 20,
    paddingHorizontal: 16,
    paddingTop: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
});
