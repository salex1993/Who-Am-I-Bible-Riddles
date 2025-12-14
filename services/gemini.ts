import { RiddleData, LocalRiddle, GameDifficulty } from "../types";
import { riddles } from "../data/riddles";

// Categories suitable for children
const KIDS_CATEGORIES = [
  "Patriarchs & Matriarchs",
  "Women of the Bible",
  "Angels & Heavenly Beings",
  "Parables & Symbolic Figures",
  "Judges & Deliverers", 
  "Apostles & Early Church",
  "Gentiles & Foreigners" // Includes Wise Men, etc.
];

// Helper to shuffle array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper to generate distractors if they are missing
const generateOptions = (currentRiddle: LocalRiddle, allRiddles: LocalRiddle[]): string[] => {
  if (currentRiddle.options && currentRiddle.options.length === 4) {
    return shuffleArray(currentRiddle.options);
  }

  // 1. Filter for other riddles, ideally same category
  let candidates = allRiddles.filter(r => 
    r.id !== currentRiddle.id && 
    r.category === currentRiddle.category && 
    r.answer !== currentRiddle.answer
  );

  // Fallback if not enough in category
  if (candidates.length < 3) {
    candidates = allRiddles.filter(r => r.id !== currentRiddle.id && r.answer !== currentRiddle.answer);
  }

  // 2. Shuffle candidates and pick 3
  const shuffledCandidates = shuffleArray(candidates);
  const distractors = shuffledCandidates.slice(0, 3).map(r => r.answer);

  // 3. Combine and shuffle
  return shuffleArray([currentRiddle.answer, ...distractors]);
};

const getBookFromCategory = (category: string): string => {
  const map: Record<string, string> = {
    "Patriarchs & Matriarchs": "Genesis",
    "Prophets & Seers": "The Prophets",
    "Kings & Rulers": "Kings & Chronicles",
    "Women of the Bible": "Various Scriptures",
    "Judges & Deliverers": "Judges & Joshua",
    "Apostles & Early Church": "Acts & Epistles",
    "Gentiles & Foreigners": "Old & New Testament",
    "Angels & Heavenly Beings": "Heavenly Realms",
    "Enemies & Villains": "Historical Books",
    "Parables & Symbolic Figures": "The Gospels"
  };
  return map[category] || "The Scriptures";
};

// Convert LocalRiddle to the App's RiddleData format
const mapLocalToRiddleData = (local: LocalRiddle, difficultyPreference?: GameDifficulty): RiddleData => {
  // Map numeric difficulty to string
  let difficulty: 'Easy' | 'Medium' | 'Hard' | 'Kids' = 'Easy';
  
  if (difficultyPreference === GameDifficulty.KIDS) {
    difficulty = 'Kids';
  } else {
    if (local.difficulty_level >= 3 && local.difficulty_level < 5) difficulty = 'Medium';
    if (local.difficulty_level >= 5) difficulty = 'Hard';
  }

  const options = generateOptions(local, riddles);
  const reference = local.primary_reference === "Bible" ? getBookFromCategory(local.category) : local.primary_reference;

  return {
    question: local.poem,
    options: options,
    correctAnswer: local.answer,
    reference: reference,
    explanation: `See ${reference}.`,
    difficulty: difficulty,
    difficultyLevel: local.difficulty_level,
    category: local.category
  };
};

export const getUniqueCategories = (): string[] => {
  const categories = new Set(riddles.map(r => r.category));
  return Array.from(categories).sort();
};

export const getRiddle = async (difficultyPreference?: GameDifficulty, category?: string): Promise<RiddleData> => {
  // Simulate network delay for "Consulting the Scribes..." effect
  await new Promise(resolve => setTimeout(resolve, 600));

  try {
    let candidates = riddles;

    // 1. Filter by Category if provided (Overrides difficulty tiers usually)
    if (category) {
       candidates = candidates.filter(r => r.category === category);
    } 
    // 2. Otherwise filter by Difficulty
    else {
      let targetLevels: number[] = [1, 2]; // Default to Easy

      if (difficultyPreference === GameDifficulty.EASY) {
        targetLevels = [1, 2];
      } else if (difficultyPreference === GameDifficulty.MEDIUM) {
        targetLevels = [3, 4];
      } else if (difficultyPreference === GameDifficulty.HARD) {
        targetLevels = [5];
      } else if (difficultyPreference === GameDifficulty.KIDS) {
        targetLevels = [1, 2];
      }

      candidates = candidates.filter(r => targetLevels.includes(r.difficulty_level));
      
      // Extra Filtering for Kids Mode
      if (difficultyPreference === GameDifficulty.KIDS) {
         candidates = candidates.filter(r => KIDS_CATEGORIES.includes(r.category));
      }
    }

    // Fallback: If no candidates match exact level (e.g. if dataset is small), expand search
    if (candidates.length === 0) {
      console.warn(`No riddles found for criteria. Using all riddles.`);
      candidates = riddles;
    }

    // Pick a random riddle
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const selectedRiddle = candidates[randomIndex];

    return mapLocalToRiddleData(selectedRiddle, difficultyPreference);

  } catch (error) {
    console.error("Error fetching riddle:", error);
    throw error;
  }
};