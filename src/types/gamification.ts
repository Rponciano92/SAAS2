export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type BadgeCategory = 'knowledge' | 'productivity' | 'expertise' | 'special';
export type UserLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ContributionStatus = 'pending' | 'approved' | 'rejected' | 'revision';
export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'claimed';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  earnedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface Level {
  level: UserLevel;
  name: string;
  pointsRequired: number;
  color: string;
}

export interface Contribution {
  id: string;
  userId: string;
  title: string;
  type: 'knowledge' | 'teaching' | 'file' | 'methodology' | 'case' | 'feedback';
  status: ContributionStatus;
  submittedAt: Date;
  validatedAt?: Date;
  validator?: string;
  points: number;
  potentialPoints: number;
  feedback?: string;
  quality?: 'excellent' | 'good' | 'satisfactory' | 'unsatisfactory';
}

export interface MonthlyGoal {
  id: string;
  userId: string;
  month: number;
  year: number;
  status: GoalStatus;
  criteria: {
    minPoints: number;
    validatedContributions: number;
    activeCompanies: number;
    reportsGenerated: number;
    meetingsHeld: number;
    kpisMonitored: number;
    activeDays: number;
    approvalRate: number;
  };
  progress: {
    currentPoints: number;
    validatedContributions: number;
    activeCompanies: number;
    reportsGenerated: number;
    meetingsHeld: number;
    kpisMonitored: number;
    activeDays: number;
    approvalRate: number;
  };
  reward: {
    name: string;
    description: string;
    value: string;
    duration: string;
    claimedAt?: Date;
  };
}

export interface UserGamification {
  userId: string;
  currentLevel: UserLevel;
  totalPoints: number;
  monthlyPoints: number;
  weeklyPoints: number;
  badges: Badge[];
  streaks: {
    daily: number;
    productive: number;
    goals: number;
    contributions: number;
  };
  monthlyGoal?: MonthlyGoal;
  ranking: {
    monthly: number;
    allTime: number;
    contributions: number;
  };
  stats: {
    contributionsTotal: number;
    contributionsApproved: number;
    contributionsRejected: number;
    approvalRate: number;
    companiesActive: number;
    reportsGenerated: number;
    meetingsHeld: number;
    kpisMonitored: number;
    activeDaysMonth: number;
  };
}

export interface PointsTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  category: 'contribution' | 'activity' | 'achievement' | 'penalty' | 'bonus';
  timestamp: Date;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  objective: string;
  reward: {
    points: number;
    badge?: string;
    other?: string;
  };
  startDate: Date;
  endDate: Date;
  progress?: number;
  maxProgress: number;
  status: 'active' | 'completed' | 'expired';
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost?: number;
  requirementType: 'points' | 'badge' | 'level' | 'contribution' | 'special';
  requirementValue: number | string;
  category: 'digital' | 'physical' | 'discount' | 'feature' | 'recognition';
  image?: string;
  available: boolean;
}