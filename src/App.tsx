import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import PublicLayout from "@/components/PublicLayout";
import { usePageTracking } from "@/hooks/usePageTracking";
import Home from "./pages/Home";

const History = lazy(() => import("./pages/History"));
const Founder = lazy(() => import("./pages/Founder"));
const InMemoriam = lazy(() => import("./pages/InMemoriam"));
const Team = lazy(() => import("./pages/Team"));
const Activities = lazy(() => import("./pages/Activities"));
const News = lazy(() => import("./pages/News"));
const NewsArticle = lazy(() => import("./pages/NewsArticle"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Donate = lazy(() => import("./pages/Donate"));
const Membership = lazy(() => import("./pages/Membership"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin (split into its own chunk, only loaded for admin visitors)
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const ResetPassword = lazy(() => import("./pages/admin/ResetPassword"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminPages = lazy(() => import("./pages/admin/AdminPages"));
const AdminArticles = lazy(() => import("./pages/admin/AdminArticles"));
const AdminTeam = lazy(() => import("./pages/admin/AdminTeam"));
const AdminActivities = lazy(() => import("./pages/admin/AdminActivities"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminSocialMedia = lazy(() => import("./pages/admin/AdminSocialMedia"));
const AdminLogs = lazy(() => import("./pages/admin/AdminLogs"));
const AdminPartners = lazy(() => import("./pages/admin/AdminPartners"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminMedia = lazy(() => import("./pages/admin/AdminMedia"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
    },
  },
});

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

const RouteTracker = () => {
  usePageTracking();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteTracker />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="pages" element={<AdminPages />} />
                <Route path="articles" element={<AdminArticles />} />
                <Route path="team" element={<AdminTeam />} />
                <Route path="activities" element={<AdminActivities />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="social" element={<AdminSocialMedia />} />
                <Route path="logs" element={<AdminLogs />} />
                <Route path="partners" element={<AdminPartners />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="media" element={<AdminMedia />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Public routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/history" element={<History />} />
                <Route path="/founder" element={<Founder />} />
                <Route path="/in-memoriam" element={<InMemoriam />} />
                <Route path="/team" element={<Team />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:slug" element={<NewsArticle />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
