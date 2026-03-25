import { useCallback, useState } from "react";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "@/theme/colors";
import type { Story } from "@/types/story";

const noop = () => {};

type StoryCardProps = {
  onDelete?: (id: string) => void;
  onEditTitle?: (id: string, title: string) => void;
  story: Story;
};

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function StoryCard({
  onDelete = noop,
  onEditTitle = noop,
  story,
}: StoryCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(story.title);

  const startEditing = useCallback(() => {
    setDraft(story.title);
    setEditing(true);
  }, [story.title]);

  const commitEdit = useCallback(() => {
    const trimmed = draft.trim();
    setEditing(false);

    if (trimmed && trimmed !== story.title) {
      onEditTitle(story.id, trimmed);
    }
  }, [draft, onEditTitle, story.id, story.title]);

  return (
    <View
      className="mx-4 mb-3 rounded-[14px] px-4 py-3"
      style={{
        backgroundColor: colors.sheetSurface,
        borderColor: colors.divider,
        borderWidth: 1,
        elevation: 1,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      }}
    >
      <View className="flex-row items-center">
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.8}
          className="mr-3 h-9 w-9 items-center justify-center rounded-full"
          hitSlop={8}
          onPress={startEditing}
          style={{ backgroundColor: colors.primarySoft }}
        >
          <Feather name="edit-2" size={16} color={colors.primaryDark} />
        </TouchableOpacity>

        <View className="flex-1">
          {editing ? (
            <TextInput
              autoFocus
              className="text-[15px] font-semibold"
              onBlur={commitEdit}
              onChangeText={setDraft}
              onSubmitEditing={commitEdit}
              returnKeyType="done"
              selectionColor={colors.primary}
              style={{ color: colors.textMain, padding: 0 }}
              value={draft}
            />
          ) : (
            <Text
              className="text-[15px] font-semibold"
              numberOfLines={1}
              style={{ color: colors.textMain }}
            >
              {story.title}
            </Text>
          )}
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.8}
          className="ml-3 h-9 w-9 items-center justify-center rounded-full"
          hitSlop={8}
          onPress={() => onDelete(story.id)}
          style={{ backgroundColor: "#FDECEB" }}
        >
          <MaterialIcons name="delete-outline" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>

      {story.transcript ? (
        <Text
          className="mt-2 text-[13px] leading-[19px]"
          numberOfLines={2}
          style={{ color: colors.textMuted }}
        >
          {story.transcript}
        </Text>
      ) : null}

      <Text
        className="mt-2 text-[12px]"
        style={{ color: colors.textMuted }}
      >
        {formatTime(story.createdAt)}
      </Text>
    </View>
  );
}
