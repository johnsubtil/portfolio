import type { ProjectCategory } from './content';

export const ranks = ['E', 'D', 'C', 'B', 'A', 'S'] as const;
type Rank = (typeof ranks)[number];

interface NicheRank {
  rank: Rank;
}

export const rankGuidePost: string | undefined = 'ranks';

export const nicheRanks: Partial<Record<ProjectCategory, NicheRank>> = {
  software: { rank: 'B' },
  security: { rank: 'D' },
  hardware: { rank: 'A' },
  pedagogy: { rank: 'S' },
  design: { rank: 'D' },
  games: { rank: 'D' },
  art: { rank: 'E' },
  video: { rank: 'E' },
  stories: { rank: 'C' },
};
