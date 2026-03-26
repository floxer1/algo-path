export const mockUser = {
  name: 'Alex',
  level: 12,
  xp: 2450,
  xpToNext: 3000,
  streak: 14,
  rank: 847,
  solved: 67,
  country: 'NG',
  avatar: '🧑‍💻',
};

export const learningPaths = [
  { id: 'beginner', icon: '🌱', color: 'primary', lessons: 24, progress: 75 },
  { id: 'dataStructures', icon: '🏗️', color: 'info', lessons: 32, progress: 40 },
  { id: 'advanced', icon: '🚀', color: 'xp', lessons: 28, progress: 10 },
  { id: 'interview', icon: '💼', color: 'accent', lessons: 40, progress: 0 },
];

export const problems = [
  { id: 1, title: 'Two Sum', difficulty: 'easy' as const, solved: true, category: 'Arrays', xp: 10 },
  { id: 2, title: 'Reverse Linked List', difficulty: 'easy' as const, solved: true, category: 'Linked Lists', xp: 10 },
  { id: 3, title: 'Binary Search', difficulty: 'easy' as const, solved: true, category: 'Searching', xp: 10 },
  { id: 4, title: 'Valid Parentheses', difficulty: 'easy' as const, solved: false, category: 'Stacks', xp: 10 },
  { id: 5, title: 'Merge Sort', difficulty: 'medium' as const, solved: false, category: 'Sorting', xp: 20 },
  { id: 6, title: 'BFS / DFS', difficulty: 'medium' as const, solved: false, category: 'Graphs', xp: 20 },
  { id: 7, title: 'LRU Cache', difficulty: 'medium' as const, solved: false, category: 'Design', xp: 20 },
  { id: 8, title: 'Dijkstra\'s Algorithm', difficulty: 'hard' as const, solved: false, category: 'Graphs', xp: 30 },
  { id: 9, title: 'Longest Palindrome Substring', difficulty: 'hard' as const, solved: false, category: 'Strings', xp: 30 },
  { id: 10, title: 'N-Queens', difficulty: 'hard' as const, solved: false, category: 'Backtracking', xp: 30 },
];

export const leaderboardData = [
  { rank: 1, name: 'CodeMaster', xp: 12450, country: 'IN', avatar: '👨‍💻' },
  { rank: 2, name: 'AlgoQueen', xp: 11200, country: 'NG', avatar: '👩‍💻' },
  { rank: 3, name: 'ByteWarrior', xp: 10800, country: 'KE', avatar: '🧑‍💻' },
  { rank: 4, name: 'StackOverflow', xp: 9600, country: 'BR', avatar: '👨‍🎓' },
  { rank: 5, name: 'TreeTraverser', xp: 8900, country: 'GH', avatar: '👩‍🎓' },
  { rank: 6, name: 'RecursionKing', xp: 8100, country: 'EG', avatar: '🤴' },
  { rank: 7, name: 'HashMapHero', xp: 7500, country: 'ZA', avatar: '🦸' },
  { rank: 8, name: 'GraphGuru', xp: 6800, country: 'FR', avatar: '🧙' },
  { rank: 9, name: 'SortingStar', xp: 6200, country: 'SN', avatar: '⭐' },
  { rank: 10, name: 'DPNinja', xp: 5900, country: 'US', avatar: '🥷' },
];

export const badges = [
  { id: 'firstSolve', icon: '🎯', unlocked: true },
  { id: 'streak7', icon: '🔥', unlocked: true },
  { id: 'streak30', icon: '💎', unlocked: false },
  { id: 'speedDemon', icon: '⚡', unlocked: true },
  { id: 'perfectWeek', icon: '🌟', unlocked: false },
];

export const dailyChallenge = {
  title: 'Maximum Subarray',
  difficulty: 'medium' as const,
  xp: 50,
  timeLeft: '14h 23m',
};

export const exerciseDetail = {
  id: 4,
  title: 'Valid Parentheses',
  difficulty: 'easy' as const,
  description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
  examples: [
    { input: 's = "()"', output: 'true' },
    { input: 's = "()[]{}"', output: 'true' },
    { input: 's = "(]"', output: 'false' },
  ],
  starterCode: {
    javascript: `function isValid(s) {\n  // Your code here\n}`,
    python: `def is_valid(s: str) -> bool:\n    # Your code here\n    pass`,
    java: `class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n    }\n}`,
    cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        // Your code here\n    }\n};`,
  },
  testCases: [
    { input: '"()"', expected: 'true', passed: null as boolean | null },
    { input: '"()[]{}"', expected: 'true', passed: null as boolean | null },
    { input: '"(]"', expected: 'false', passed: null as boolean | null },
  ],
};

export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'ln', name: 'Lingála', flag: '🇨🇩' },
];
