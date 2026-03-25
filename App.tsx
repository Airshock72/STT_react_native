import "./global.css";

import { useCallback, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { HistoryScreen } from "@/screens/HistoryScreen";
import { MainScreen } from "@/screens/MainScreen";
import type { Story } from "@/types/story";

if (__DEV__) {
  LogBox.ignoreLogs([
    "SafeAreaView has been deprecated and will be removed in a future release.",
  ]);
}

type Screen = "main" | "history";

export default function App() {
  const [screen, setScreen] = useState<Screen>("main");
  const [stories, setStories] = useState<Story[]>([]);

  const handleStorySave = useCallback((story: Story) => {
    setStories((prev) => [story, ...prev]);
  }, []);

  const handleDeleteStory = useCallback((id: string) => {
    setStories((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleEditStoryTitle = useCallback((id: string, title: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title } : s)),
    );
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {screen === "main" ? (
        <MainScreen
          onHistoryPress={() => setScreen("history")}
          onStorySave={handleStorySave}
        />
      ) : (
        <HistoryScreen
          onBack={() => setScreen("main")}
          onDeleteStory={handleDeleteStory}
          onEditStoryTitle={handleEditStoryTitle}
          stories={stories}
        />
      )}
    </SafeAreaProvider>
  );
}
