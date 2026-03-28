import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Onboarding Pages
// import Onboarding1 from "./pages/onboarding/Onboarding1";
// import Onboarding2 from "./pages/onboarding/Onboarding2";
// import Onboarding3 from "./pages/onboarding/Onboarding3";

// Auth Pages
import Register from "./pages/auth/Register";
import SignIn from "./pages/auth/SignIn";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Legal Pages
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import CookiePolicy from "./pages/legal/CookiePolicy";

// Dashboard Pages
import Home from "./pages/dashboard/Home";
import Chat from "./pages/dashboard/Chat";
import History from "./pages/dashboard/History";
import Premium from "./pages/dashboard/Premium";
import Profile from "./pages/dashboard/Profile";
import FAQs from "./pages/dashboard/FAQs";
import Blog from "./pages/Blog";

import { PublicOnlyRoute } from "@/components/auth/PublicOnlyRoute";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

/** Redirects to a new path while preserving query params and hash */
function Redirect({ to }: { to: string }) {
  const { search, hash } = useLocation();
  return <Navigate to={`${to}${search}${hash}`} replace />;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* ─── Public Pages (SEO-indexable) ─── */}
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />

              {/* ─── Onboarding ─── */}
              {/* <Route path="/onboarding/1" element={<Onboarding1 />} /> */}
              {/* <Route path="/onboarding/2" element={<Onboarding2 />} /> */}
              {/* <Route path="/onboarding/3" element={<Onboarding3 />} /> */}

              {/* ─── Auth (public-only, redirects authenticated users) ─── */}
              <Route
                path="/register"
                element={
                  <PublicOnlyRoute>
                    <Register />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/signin"
                element={
                  <PublicOnlyRoute>
                    <SignIn />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicOnlyRoute>
                    <ForgotPassword />
                  </PublicOnlyRoute>
                }
              />

              {/* ─── Application Dashboard ─── */}
              <Route path="/app/home" element={<Home />} />
              <Route path="/app/chat" element={<Chat />} />
              <Route path="/app/history" element={<History />} />
              <Route path="/app/premium" element={<Premium />} />
              <Route path="/app/profile" element={<Profile />} />

              {/* ─── Legacy Redirects (backward compatibility) ─── */}
              <Route path="/home" element={<Redirect to="/app/home" />} />
              <Route path="/chat" element={<Redirect to="/app/chat" />} />
              <Route path="/history" element={<Redirect to="/app/history" />} />
              <Route path="/premium" element={<Redirect to="/app/premium" />} />
              <Route path="/profile" element={<Redirect to="/app/profile" />} />

              {/* ─── Catch-all ─── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;