export const cfRankOrder = [
  "newbie",
  "pupil",
  "specialist",
  "expert",
  "candidate master",
  "master",
  "international master",
  "grandmaster",
  "international grandmaster",
  "legendary grandmaster",
] as const;

export type CfRank = typeof cfRankOrder[number];

export const cfRankIndex: Record<CfRank, number> = Object.fromEntries(
  cfRankOrder.map((rank, idx) => [rank, idx])
) as Record<CfRank, number>;

export const lcBadgeOrder = [
  "knight",
  "guardian"
] as const;

export type LcBadge = typeof lcBadgeOrder[number];

export const lcBadgeIndex: Record<LcBadge, number> = Object.fromEntries(
  lcBadgeOrder.map((badge, idx) => [badge, idx])
) as Record<LcBadge, number>;

export const placementOrder = [
  "A",
  "A+",
  "Dream"
] as const;

export type placement_status = typeof placementOrder[number];

export const placementIndex: Record<placement_status, number> = Object.fromEntries(
  placementOrder.map((badge, idx) => [badge, idx])
) as Record<placement_status, number>;