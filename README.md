# STT React Native (Speech-to-Text Storyteller)

A mobile application built with React Native and Expo that transforms speech into text, allowing users to capture stories, notes, or thoughts hands-free.

##  Project Overview

The **STT React Native** project is designed to provide a seamless speech-to-text experience. Users can record their voice, which is then transcribed in real-time. These transcriptions can be saved as "Stories," managed in a history list, and edited for better organization.

### Key Features
- **Real-time Speech Recognition**: High-accuracy transcription using `expo-speech-recognition`.
- **Story Management**: Save transcriptions with custom titles.
- **History Tracking**: Access and manage previous recordings.
- **Modern UI**: Clean and responsive interface built with NativeWind.

---

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 54)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Icons**: Expo Vector Icons (Lucide/Material icons)
- **Speech Engine**: `expo-speech-recognition`

---

##  Getting Started

### Prerequisites
- Node.js (LTS version recommended)
- npm or yarn
- Expo Go app on your mobile device (for testing) or an Android/iOS emulator

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd STT_react_native
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on a specific platform:**
   - Press `a` for Android (requires emulator or connected device).
   - Press `i` for iOS (requires macOS and Xcode).
   - Scan the QR code with Expo Go to run on a physical device.

---

## 📂 Project Structure

- `App.tsx`: The main entry point and navigation logic.
- `src/screens`: Contains `MainScreen` (recording) and `HistoryScreen`.
- `src/components`: Reusable UI components.
- `src/features`: Core business logic and custom hooks.
- `src/types`: TypeScript interfaces and type definitions (e.g., `Story`).
- `global.css`: Tailwind CSS configurations.

---

##  Future Roadmap

We aim to make this app a powerful tool for writers and note-takers. Planned features include:

- [ ] **Cloud Sync**: Save stories to a backend (Firebase/Supabase) to access them across devices.
- [ ] **AI Summarization**: Integration with LLMs to summarize long recordings.
- [ ] **Export Options**: Export stories as PDF, TXT, or Markdown files.
- [ ] **Multi-language Support**: Allow users to toggle between different languages for transcription.
- [ ] **Audio Playback**: Store and play back the original audio recording alongside the text.
- [ ] **Categorization**: Add tags or folders to organize stories.

---

## 📄 License
This project is licensed under the MIT License.
