import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useOnlineSync } from "@/hooks/use-online-sync";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import '@/lib/i18n';
import Index from "./pages/Index";
import Practice from "./pages/Practice";
import Leaderboard from "./pages/Leaderboard";
import Duels from "./pages/Duels";
import Profile from "./pages/Profile";
import Exercise from "./pages/Exercise";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Visualizer from "./pages/Visualizer";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import { useIsStandalone } from "./hooks/use-standalone";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const LandingOrHome = () => {
  const { user, loading } = useAuth();
  const isStandalone = useIsStandalone();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (user) return <Index />;
  if (isStandalone) return <Navigate to="/auth" replace />;
  return <Landing />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
        <Route path="/" element={<PageTransition><LandingOrHome /></PageTransition>} />
        <Route path="/practice" element={<ProtectedRoute><PageTransition><Practice /></PageTransition></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><PageTransition><Leaderboard /></PageTransition></ProtectedRoute>} />
        <Route path="/duels" element={<ProtectedRoute><PageTransition><Duels /></PageTransition></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        <Route path="/exercise/:id" element={<ProtectedRoute><PageTransition><Exercise /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/path/:id" element={<ProtectedRoute><PageTransition><Practice /></PageTransition></ProtectedRoute>} />
        <Route path="/visualizer" element={<ProtectedRoute><PageTransition><Visualizer /></PageTransition></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();
  useOnlineSync();

  return (
    <div className="max-w-lg mx-auto min-h-screen relative">
      <AnimatedRoutes />
      {user && <BottomNav />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
