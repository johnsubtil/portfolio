import type { ProjectCategory } from './content';

export const ranks = ['E', 'D', 'C', 'B', 'A', 'S'] as const;
type Rank = (typeof ranks)[number];

interface NicheRank {
  rank: Rank;
}

export const rankGuidePost: string | undefined = 'ranks';

export const nicheRanks: Partial<Record<ProjectCategory, NicheRank>> = {
  software: { rank: 'C' },
  stories: { rank: 'D' },
};
