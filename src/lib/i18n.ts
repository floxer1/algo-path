import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      app: { name: 'AlgoTrainer', tagline: 'Master algorithms, one challenge at a time' },
      nav: { home: 'Home', practice: 'Practice', leaderboard: 'Leaderboard', duels: 'Duels', profile: 'Profile' },
      home: {
        greeting: 'Hey, {{name}}! 👋',
        streak: '{{count}} day streak',
        xp: '{{count}} XP',
        level: 'Level {{level}}',
        dailyChallenge: 'Daily Challenge',
        continueLearning: 'Continue Learning',
        learningPaths: 'Learning Paths',
        viewAll: 'View All',
      },
      paths: {
        beginner: 'Beginner Algorithms',
        dataStructures: 'Data Structures',
        advanced: 'Advanced Algorithms',
        interview: 'Interview Prep',
        beginnerDesc: 'Start your journey with sorting, searching, and basic patterns',
        dataStructuresDesc: 'Master arrays, trees, graphs, and hash maps',
        advancedDesc: 'Dynamic programming, greedy algorithms, and more',
        interviewDesc: 'Top problems from FAANG interviews',
        lessons: '{{count}} lessons',
        progress: '{{percent}}% complete',
      },
      practice: {
        title: 'Practice',
        allProblems: 'All Problems',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        solved: 'Solved',
        solve: 'Solve',
        runCode: 'Run Code',
        submit: 'Submit',
        testCases: 'Test Cases',
        passed: 'Passed',
        failed: 'Failed',
        language: 'Language',
      },
      leaderboard: {
        title: 'Leaderboard',
        global: 'Global',
        country: 'Country',
        friends: 'Friends',
        rank: 'Rank',
        weekly: 'Weekly League',
      },
      duels: {
        title: 'Duel Mode',
        findOpponent: 'Find Opponent',
        waiting: 'Searching for opponent...',
        vs: 'VS',
        timeLeft: 'Time Left',
        youWon: 'You Won! 🏆',
        youLost: 'Better luck next time!',
        draw: "It's a draw!",
      },
      profile: {
        title: 'Profile',
        solved: 'Solved',
        rank: 'Rank',
        streak: 'Streak',
        achievements: 'Achievements',
        settings: 'Settings',
        lowDataMode: 'Low Data Mode',
        language: 'Language',
        theme: 'Theme',
        downloadPacks: 'Download Packs',
        offline: 'Offline Packs',
        notifications: 'Notifications',
        logout: 'Log Out',
      },
      exercise: {
        aiCoach: 'AI Coach',
        hint: 'Get Hint',
        explanation: 'Explanation',
        optimize: 'Optimization Tips',
        complexity: 'Complexity Analysis',
      },
      auth: {
        login: 'Log In',
        signup: 'Sign Up',
        email: 'Email',
        password: 'Password',
        google: 'Continue with Google',
        apple: 'Continue with Apple',
        github: 'Continue with GitHub',
        or: 'or',
      },
      badges: {
        firstSolve: 'First Solve',
        streak7: '7-Day Streak',
        streak30: '30-Day Streak',
        speedDemon: 'Speed Demon',
        perfectWeek: 'Perfect Week',
      },
    },
  },
  fr: {
    translation: {
      app: { name: 'AlgoTrainer', tagline: 'Maîtrisez les algorithmes, un défi à la fois' },
      nav: { home: 'Accueil', practice: 'Pratique', leaderboard: 'Classement', duels: 'Duels', profile: 'Profil' },
      home: {
        greeting: 'Salut, {{name}}! 👋',
        streak: '{{count}} jours de suite',
        xp: '{{count}} XP',
        level: 'Niveau {{level}}',
        dailyChallenge: 'Défi du jour',
        continueLearning: 'Continuer',
        learningPaths: 'Parcours',
        viewAll: 'Tout voir',
      },
      paths: {
        beginner: 'Algorithmes débutant',
        dataStructures: 'Structures de données',
        advanced: 'Algorithmes avancés',
        interview: 'Préparation entretien',
        beginnerDesc: 'Commencez avec le tri, la recherche et les motifs de base',
        dataStructuresDesc: 'Maîtrisez les tableaux, arbres, graphes et tables de hachage',
        advancedDesc: 'Programmation dynamique, algorithmes gloutons et plus',
        interviewDesc: 'Les meilleurs problèmes des entretiens FAANG',
        lessons: '{{count}} leçons',
        progress: '{{percent}}% terminé',
      },
      practice: { title: 'Pratique', allProblems: 'Tous', easy: 'Facile', medium: 'Moyen', hard: 'Difficile', solved: 'Résolu', solve: 'Résoudre', runCode: 'Exécuter', submit: 'Soumettre', testCases: 'Tests', passed: 'Réussi', failed: 'Échoué', language: 'Langage' },
      leaderboard: { title: 'Classement', global: 'Mondial', country: 'Pays', friends: 'Amis', rank: 'Rang', weekly: 'Ligue hebdomadaire' },
      duels: { title: 'Mode Duel', findOpponent: 'Trouver un adversaire', waiting: 'Recherche...', vs: 'VS', timeLeft: 'Temps restant', youWon: 'Victoire! 🏆', youLost: 'La prochaine sera la bonne!', draw: 'Égalité!' },
      profile: { title: 'Profil', solved: 'Résolus', rank: 'Rang', streak: 'Série', achievements: 'Réussites', settings: 'Paramètres', lowDataMode: 'Mode économie', language: 'Langue', theme: 'Thème', downloadPacks: 'Télécharger', offline: 'Packs hors ligne', notifications: 'Notifications', logout: 'Déconnexion' },
      exercise: { aiCoach: 'Coach IA', hint: 'Indice', explanation: 'Explication', optimize: 'Optimisation', complexity: 'Complexité' },
      auth: { login: 'Connexion', signup: 'Inscription', email: 'Email', password: 'Mot de passe', google: 'Continuer avec Google', apple: 'Continuer avec Apple', github: 'Continuer avec GitHub', or: 'ou' },
      badges: { firstSolve: 'Premier résolu', streak7: '7 jours de suite', streak30: '30 jours de suite', speedDemon: 'Éclair', perfectWeek: 'Semaine parfaite' },
    },
  },
  es: {
    translation: {
      app: { name: 'AlgoTrainer', tagline: 'Domina algoritmos, un desafío a la vez' },
      nav: { home: 'Inicio', practice: 'Práctica', leaderboard: 'Ranking', duels: 'Duelos', profile: 'Perfil' },
      home: { greeting: 'Hola, {{name}}! 👋', streak: '{{count}} días seguidos', xp: '{{count}} XP', level: 'Nivel {{level}}', dailyChallenge: 'Desafío diario', continueLearning: 'Continuar', learningPaths: 'Rutas', viewAll: 'Ver todo' },
      paths: { beginner: 'Algoritmos básicos', dataStructures: 'Estructuras de datos', advanced: 'Algoritmos avanzados', interview: 'Prep. entrevistas', beginnerDesc: 'Comienza con ordenamiento y búsqueda', dataStructuresDesc: 'Arrays, árboles, grafos y hash maps', advancedDesc: 'Programación dinámica y más', interviewDesc: 'Top problemas de FAANG', lessons: '{{count}} lecciones', progress: '{{percent}}% completo' },
      practice: { title: 'Práctica', allProblems: 'Todos', easy: 'Fácil', medium: 'Medio', hard: 'Difícil', solved: 'Resuelto', solve: 'Resolver', runCode: 'Ejecutar', submit: 'Enviar', testCases: 'Pruebas', passed: 'Aprobado', failed: 'Fallido', language: 'Lenguaje' },
      leaderboard: { title: 'Ranking', global: 'Global', country: 'País', friends: 'Amigos', rank: 'Posición', weekly: 'Liga semanal' },
      duels: { title: 'Modo Duelo', findOpponent: 'Buscar oponente', waiting: 'Buscando...', vs: 'VS', timeLeft: 'Tiempo', youWon: '¡Ganaste! 🏆', youLost: '¡Más suerte la próxima!', draw: '¡Empate!' },
      profile: { title: 'Perfil', solved: 'Resueltos', rank: 'Posición', streak: 'Racha', achievements: 'Logros', settings: 'Ajustes', lowDataMode: 'Modo ahorro', language: 'Idioma', theme: 'Tema', downloadPacks: 'Descargar', offline: 'Packs offline', notifications: 'Notificaciones', logout: 'Salir' },
      exercise: { aiCoach: 'Coach IA', hint: 'Pista', explanation: 'Explicación', optimize: 'Optimización', complexity: 'Complejidad' },
      auth: { login: 'Iniciar sesión', signup: 'Registrarse', email: 'Email', password: 'Contraseña', google: 'Continuar con Google', apple: 'Continuar con Apple', github: 'Continuar con GitHub', or: 'o' },
      badges: { firstSolve: 'Primera solución', streak7: '7 días seguidos', streak30: '30 días seguidos', speedDemon: 'Velocista', perfectWeek: 'Semana perfecta' },
    },
  },
  pt: {
    translation: {
      app: { name: 'AlgoTrainer', tagline: 'Domine algoritmos, um desafio de cada vez' },
      nav: { home: 'Início', practice: 'Prática', leaderboard: 'Ranking', duels: 'Duelos', profile: 'Perfil' },
      home: { greeting: 'Olá, {{name}}! 👋', streak: '{{count}} dias seguidos', xp: '{{count}} XP', level: 'Nível {{level}}', dailyChallenge: 'Desafio diário', continueLearning: 'Continuar', learningPaths: 'Trilhas', viewAll: 'Ver tudo' },
    },
  },
  ar: {
    translation: {
      app: { name: 'AlgoTrainer', tagline: 'أتقن الخوارزميات، تحدي واحد في كل مرة' },
      nav: { home: 'الرئيسية', practice: 'تدريب', leaderboard: 'الترتيب', duels: 'مبارزات', profile: 'الملف' },
      home: { greeting: '!👋 {{name}} أهلاً', streak: '{{count}} يوم متتالي', xp: '{{count}} نقاط', level: 'المستوى {{level}}', dailyChallenge: 'تحدي اليوم', continueLearning: 'متابعة', learningPaths: 'مسارات', viewAll: 'عرض الكل' },
    },
  },
  sw: {
    translation: {
      app: { name: 'AlgoTrainer', tagline: 'Boresha algorithimu, changamoto moja kwa wakati' },
      nav: { home: 'Nyumbani', practice: 'Mazoezi', leaderboard: 'Nafasi', duels: 'Mashindano', profile: 'Wasifu' },
    },
  },
  yo: {
    translation: {
      app: { name: 'AlgoTrainer', tagline: 'Kọ algorithm, ipenija kan ni akoko kan' },
      nav: { home: 'Ilé', practice: 'Àdàṣe', leaderboard: 'Ipò', duels: 'Ìdíje', profile: 'Profaili' },
    },
  },
  ha: {
    translation: {
      app: { name: 'AlgoTrainer', tagline: 'Koyi algorithms, kalubale daya a lokaci daya' },
      nav: { home: 'Gida', practice: 'Aiki', leaderboard: 'Matsayi', duels: 'Gasar', profile: 'Bayani' },
    },
  },
  ln: {
    translation: {
      app: { name: 'AlgoTrainer', tagline: 'Yekola algorithme, défi moko na mbala moko' },
      nav: { home: 'Ndako', practice: 'Mosala', leaderboard: 'Bokeli', duels: 'Etumba', profile: 'Profil' },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
