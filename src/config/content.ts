export const projectStatuses = ['planned', 'in-progress', 'completed'] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

export const projectCategories = ['software', 'security', 'hardware', 'pedagogy', 'design', 'games', 'art', 'video', 'stories'] as const;
export type ProjectCategory = (typeof projectCategories)[number];

export const homeCategories: readonly ProjectCategory[] = ['software', 'security', 'design', 'video', 'stories'];

export const articleContentsMinimum = 3;

export const showProjectCategory = true;

export const homeFeaturedLimit = 3;

// Milliseconds each featured project stays in the hero; 0 turns auto-advance off.
export const homeHeroInterval = 6000;

export const homeProjectLimit = 6;

export const homePostLimit = 4;

export const showPlaceholderSlots = true;
