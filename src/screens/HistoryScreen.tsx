import { useMemo } from "react";
import { SectionList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HistoryHeader } from "@/components/history/HistoryHeader";
import { StoryCard } from "@/components/history/StoryCard";
import { colors } from "@/theme/colors";
import type { Story } from "@/types/story";

const noop = () => {};

type HistoryScreenProps = {
  onBack?: () => void;
  onDeleteStory?: (id: string) => void;
  onEditStoryTitle?: (id: string, title: string) => void;
  stories: Story[];
};

type Section = {
  title: string;
  data: Story[];
};

function getDateLabel(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = today.getTime() - dateDay.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "დღეს";
  if (diffDays === 1) return "გუშინ";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function groupByDate(stories: Story[]): Section[] {
  const sorted = [...stories].sort((a, b) => b.createdAt - a.createdAt);
  const groups = new Map<string, Story[]>();

  for (const story of sorted) {
    const label = getDateLabel(story.createdAt);
    const group = groups.get(label);

    if (group) {
      group.push(story);
    } else {
      groups.set(label, [story]);
    }
  }

  return Array.from(groups, ([title, data]) => ({ title, data }));
}

export function HistoryScreen({
  onBack = noop,
  onDeleteStory = noop,
  onEditStoryTitle = noop,
  stories,
}: HistoryScreenProps) {
  const insets = useSafeAreaInsets();
  const sections = useMemo(() => groupByDate(stories), [stories]);

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.canvas,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <HistoryHeader onBack={onBack} />

      {stories.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text
            className="text-center text-[15px]"
            style={{ color: colors.textMuted }}
          >
            ჯერ არ გაქვს ჩანაწერები.{"\n"}დაიწყე ახალი ჩაწერა!
          </Text>
        </View>
      ) : (
        <SectionList
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StoryCard
              onDelete={onDeleteStory}
              onEditTitle={onEditStoryTitle}
              story={item}
            />
          )}
          renderSectionHeader={({ section }) => (
            <Text
              className="mx-5 mb-2 mt-4 text-[13px] font-bold uppercase tracking-[0.5px]"
              style={{ color: colors.textMuted }}
            >
              {section.title}
            </Text>
          )}
          sections={sections}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}
