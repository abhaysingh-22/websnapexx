import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Onboarding Pages
import Onboarding1 from "./pages/onboarding/Onboarding1";
import Onboarding2 from "./pages/onboarding/Onboarding2";
import Onboarding3 from "./pages/onboarding/Onboarding3";

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

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicOnlyRoute } from "@/components/auth/PublicOnlyRoute";

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
              <Route path="/" element={<Index />} />
              
              {/* Onboarding */}
              <Route path="/onboarding/1" element={<Onboarding1 />} />
              <Route path="/onboarding/2" element={<Onboarding2 />} />
              <Route path="/onboarding/3" element={<Onboarding3 />} />
              
              {/* Auth */}
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
              
              {/* Dashboard */}
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/faqs" element={<ProtectedRoute><FAQs /></ProtectedRoute>} />
              
              {/* Blog */}
              <Route path="/blog" element={<Blog />} />

              {/* Legal */}
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

// supabase serverr resumed 