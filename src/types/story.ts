export type Story = {
  id: string;
  title: string;
  transcript: string;
  audioUri: string | null;
  createdAt: number;
};

let counter = 0;

export function createStory(
  transcript: string,
  audioUri: string | null,
): Story {
  counter += 1;

  return {
    id: `${Date.now()}-${counter}`,
    title: `ჩანაწერი #${counter}`,
    transcript,
    audioUri,
    createdAt: Date.now(),
  };
}
