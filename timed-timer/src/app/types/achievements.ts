export interface AchievementTier {
  level: number;
  requirement: number;
  reward: string;
}

export interface AchievementType {
  title: string;
  description: string;
  tiers: AchievementTier[];
  icon: string;
}

export interface AchievementProgress {
  typeId: string;
  currentTier: number;
  progress: number;
  unlockedAt?: string;
}

export interface Achievement {
  id: string;
  typeId: string;
  name: string;
  description: string;
  tier: number;
  unlockedAt: string;
  icon: string;
  reward: string;
}

export interface AchievementStats {
  totalUnlocked: number;
  currentStreak: number;
  longestStreak: number;
  focusTimeTotal: number;
  sessionsCompleted: number;
  dailyGoalsReached: number;
}

export const achievementTypes: Record<string, AchievementType> = {
  focusMaster: {
    title: "Focus Master",
    description: "Master the art of focused work",
    icon: "target",
    tiers: [
      { level: 1, requirement: 5 * 3600, reward: "Bronze Focus Badge" },
      { level: 2, requirement: 15 * 3600, reward: "Silver Focus Badge" },
      { level: 3, requirement: 30 * 3600, reward: "Gold Focus Badge" }
    ]
  },
  streakChampion: {
    title: "Streak Champion",
    description: "Maintain consistent daily focus sessions",
    icon: "flame",
    tiers: [
      { level: 1, requirement: 3, reward: "Bronze Streak Trophy" },
      { level: 2, requirement: 7, reward: "Silver Streak Trophy" },
      { level: 3, requirement: 14, reward: "Gold Streak Trophy" }
    ]
  },
  consistencyKing: {
    title: "Consistency King",
    description: "Complete focus sessions consistently",
    icon: "crown",
    tiers: [
      { level: 1, requirement: 10, reward: "Daily Focus Tracker" },
      { level: 2, requirement: 20, reward: "Weekly Focus Insights" },
      { level: 3, requirement: 30, reward: "Monthly Focus Report" }
    ]
  },
  breakMaster: {
    title: "Break Master",
    description: "Master the art of taking effective breaks",
    icon: "coffee",
    tiers: [
      { level: 1, requirement: 5, reward: "Break Timer" },
      { level: 2, requirement: 15, reward: "Break Analytics" },
      { level: 3, requirement: 30, reward: "Break Optimization Guide" }
    ]
  },
  productivityPro: {
    title: "Productivity Pro",
    description: "Achieve high productivity scores",
    icon: "trending-up",
    tiers: [
      { level: 1, requirement: 75, reward: "Basic Productivity Badge" },
      { level: 2, requirement: 85, reward: "Advanced Productivity Badge" },
      { level: 3, requirement: 95, reward: "Elite Productivity Badge" }
    ]
  },
  earlyBird: {
    title: "Early Bird",
    description: "Start your focus sessions early",
    icon: "sun",
    tiers: [
      { level: 1, requirement: 5, reward: "Morning Starter Badge" },
      { level: 2, requirement: 15, reward: "Sunrise Champion Badge" },
      { level: 3, requirement: 30, reward: "Dawn Master Badge" }
    ]
  },
  nightOwl: {
    title: "Night Owl",
    description: "Master late-night focus sessions",
    icon: "moon",
    tiers: [
      { level: 1, requirement: 5, reward: "Evening Focus Badge" },
      { level: 2, requirement: 15, reward: "Midnight Scholar Badge" },
      { level: 3, requirement: 30, reward: "Night Master Badge" }
    ]
  },
  weekendWarrior: {
    title: "Weekend Warrior",
    description: "Stay productive during weekends",
    icon: "calendar",
    tiers: [
      { level: 1, requirement: 4, reward: "Weekend Starter Badge" },
      { level: 2, requirement: 8, reward: "Weekend Champion Badge" },
      { level: 3, requirement: 12, reward: "Weekend Master Badge" }
    ]
  },
  perfectTimer: {
    title: "Perfect Timer",
    description: "Complete sessions without interruptions",
    icon: "check-circle",
    tiers: [
      { level: 1, requirement: 5, reward: "Focus Discipline Badge" },
      { level: 2, requirement: 15, reward: "Focus Master Badge" },
      { level: 3, requirement: 30, reward: "Focus Legend Badge" }
    ]
  },
  goalSeeker: {
    title: "Goal Seeker",
    description: "Reach your daily focus goals",
    icon: "target",
    tiers: [
      { level: 1, requirement: 7, reward: "Goal Starter Badge" },
      { level: 2, requirement: 14, reward: "Goal Champion Badge" },
      { level: 3, requirement: 30, reward: "Goal Master Badge" }
    ]
  }
};
