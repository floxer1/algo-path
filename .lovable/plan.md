

## Plan: Multi-theme complet + Multi-langue complet

### 1. Multi-theme complet

**Actuellement**: Light, Dark, System (2 palettes de couleurs seulement).

**Ce qui sera ajouté**: 3 thèmes de couleur supplémentaires en plus de Light/Dark :
- **Ocean** (bleu profond)
- **Sunset** (orange/corail chaud)  
- **Forest** (vert nature)

Chaque thème aura ses variantes light et dark, soit 8 combinaisons au total.

**Fichiers modifiés**:
- `src/index.css` : Ajouter les classes CSS `.theme-ocean`, `.theme-sunset`, `.theme-forest` avec variantes light/dark pour chaque
- `src/hooks/use-theme.ts` : Étendre pour gérer le thème couleur (colorTheme) en plus du mode (light/dark/system)
- `src/pages/Profile.tsx` : Ajouter un sélecteur de thème couleur visuel (pastilles colorées) au-dessus du toggle light/dark

### 2. Multi-langue complet

**Actuellement**: EN et FR sont complets. ES est partiel. PT, AR, SW, YO, HA, LN n'ont que app + nav.

**Problème additionnel**: Beaucoup de chaînes hardcodées en français dans les pages (Dashboard, ForgotPassword, ResetPassword, Profile, Landing, Leaderboard, Index, Visualizer, Duels).

**Ce qui sera fait**:

**a) Compléter toutes les traductions i18n** (`src/lib/i18n.ts`):
- Ajouter les clés manquantes pour les pages : dashboard, forgotPassword, resetPassword, visualizer, landing, common (erreurs, boutons)
- Compléter ES, PT, AR, SW, YO, HA, LN avec toutes les traductions

**b) Remplacer toutes les chaînes hardcodées** par des appels `t()` dans :
- `src/pages/Dashboard.tsx` : "Tableau de bord", titres de stats, labels de graphiques
- `src/pages/ForgotPassword.tsx` : "Mot de passe oublié", textes du formulaire
- `src/pages/ResetPassword.tsx` : "Nouveau mot de passe", textes du formulaire
- `src/pages/Profile.tsx` : "Modifier le profil", "Enregistrer", "Bio", erreurs toast
- `src/pages/Index.tsx` : "Tableau de bord", "Algorithm Visualizer"
- `src/pages/Landing.tsx` : Tout le contenu marketing (hero, features, how it works, footer)
- `src/pages/Leaderboard.tsx` : "Aucun joueur trouvé"
- `src/pages/Practice.tsx` : "No problems found"
- `src/pages/Duels.tsx` : Labels hardcodés
- `src/pages/Visualizer.tsx` : "Algorithm Visualizer"
- `src/pages/NotFound.tsx` : "404", "Page not found"
- `src/components/AvatarUpload.tsx` : Erreur toast

### Détails techniques

**Structure des thèmes CSS** : Chaque thème couleur sera une classe sur `<html>` (ex: `class="dark theme-ocean"`). Les variables CSS seront surchargées par thème.

**Stockage** : `localStorage` avec clés `algotrainer-theme` (light/dark/system) et `algotrainer-color-theme` (default/ocean/sunset/forest).

**Estimation** : ~10 fichiers modifiés, principalement `i18n.ts` (le plus gros), `index.css`, `use-theme.ts`, et les