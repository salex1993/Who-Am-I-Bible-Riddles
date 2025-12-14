export interface RiddleData {
  question: string;
  options: string[];
  correctAnswer: string;
  reference: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Kids';
  difficultyLevel: number;
  category: string;
}

export enum GameMode {
  SINGLE = 'SINGLE',
  PARTY = 'PARTY',
  DAILY = 'DAILY',
  SUDDEN_DEATH = 'SUDDEN_DEATH'
}

export enum GameDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  KIDS = 'KIDS'
}

export enum GameState {
  START_SCREEN,
  SETUP_MODE,       // Select Single, Party, Daily, Sword Drill
  SETUP_PARTY,      // Configure Teams/Players/Series
  SETUP_DIFFICULTY, // Select Difficulty
  SETUP_CATEGORY,   // New: Select Specific Category
  LOADING,
  TURN_TRANSITION,  // Pass device state
  PLAYING,
  RESULT,           // Feedback state (brief)
  GAME_SUMMARY,     // End of game round (60s up)
  ERROR,
  PROFILE,          // View stats/achievements
  WISDOM_TREE,      // New: View category mastery
  ASCENSION_PROMPT  // Progressive difficulty offer
}

export type AvatarId = 'crown' | 'flame' | 'shield' | 'sword' | 'sun' | 'heart' | 'book' | 'cloud' | 'anchor' | 'globe';

export interface LeaderboardEntry {
  name: string;
  score: number;
  avatar: AvatarId;
  difficulty: string;
  date: number;
}

export interface GameSession {
  score: number; // For single player
  streak: number;
  highScore: number;
  mode?: GameMode;
  difficulty?: GameDifficulty;
  category?: string; // New: Selected category override
  avatar: AvatarId;
  // Daily Mode Specifics
  dailyIndex?: number;
  dailyTotal?: number;
  // Wisdom Tree Tracking
  categoryScores?: Record<string, number>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon identifier
  xpReward: number;
}

export interface PlayerProfile {
  totalXP: number;
  rank: string;
  dailyStreak: number;
  lastDailyDate: string; // ISO Date YYYY-MM-DD
  achievements: Record<string, number>; // id -> timestamp unlocked
  gamesPlayed: number;
  bestStreak: number;
  categoryProgress: Record<string, number>; // Category Name -> Total XP
}

// --- Party Mode Types ---

export type PartyFlow = 'TURN_BASED' | 'TEAM_BASED';
export type SeriesLength = 1 | 3 | 5 | 7 | 10;

export interface Player {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  score: number;
  color: string; // Tailwind color class suffix (e.g., 'red-500')
  avatar: AvatarId;
}

export interface PartyConfig {
  teams: Team[];
  seriesLength: SeriesLength;
  flow: PartyFlow;
}

export interface Turn {
  teamId: string;
  playerId: string;
  playerName: string;
  teamName: string;
  teamColor: string;
  teamAvatar: AvatarId;
  round: number;
}

// Matches the structure of the user's provided JSON/CSV data
export interface LocalRiddle {
  id: number;
  set: string;
  category: string;
  difficulty_level: number; // 1-5
  difficulty_label: string;
  difficulty_text: string;
  poem: string;            // The question
  question_type: string;
  answer: string;          // The correct answer
  primary_reference: string;
  secondary_references: string[];
  options?: string[];       
}