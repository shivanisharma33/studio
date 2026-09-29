import rawGalleries from "./storyGalleries.json";

export interface StoryGallery {
  title: string;
  location: string;
  category: string;
  images: string[];
}

export const storyGalleries = rawGalleries as Record<string, StoryGallery>;

export function getStoryGallery(slug: string): StoryGallery | undefined {
  return storyGalleries[slug];
}

export const storySlugs = Object.keys(storyGalleries);
