"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import StoryModal from "./StoryModal";

interface StoryContextType {
  activeStory: string | null;
  openStory: (slug: string) => void;
  closeStory: () => void;
}

const StoryContext = createContext<StoryContextType>({
  activeStory: null,
  openStory: () => {},
  closeStory: () => {},
});

export function StoryProvider({ children }: { children: ReactNode }) {
  const [activeStory, setActiveStory] = useState<string | null>(null);

  return (
    <StoryContext.Provider
      value={{
        activeStory,
        openStory: (slug: string) => setActiveStory(slug),
        closeStory: () => setActiveStory(null),
      }}
    >
      {children}
      {activeStory && (
        <StoryModal
          slug={activeStory}
          onClose={() => setActiveStory(null)}
          onSelectStory={(s) => setActiveStory(s)}
        />
      )}
    </StoryContext.Provider>
  );
}

export function useStory() {
  return useContext(StoryContext);
}
