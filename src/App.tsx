import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "./pages/Home";
import History from "./pages/History";
import Founder from "./pages/Founder";
import InMemoriam from "./pages/InMemoriam";
import Team from "./pages/Team";
import Activities from "./pages/Activities";
import News from "./pages/News";
import Donate from "./pages/Donate";
import Membership from "./pages/Membership";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminActivities from "./pages/admin/AdminActivities";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Admin routes — no Navbar/Footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="activities" element={<AdminActivities />} />
              <Route path="partners" element={<AdminPartners />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Public routes */}
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <main className="min-h-screen">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/founder" element={<Founder />} />
                      <Route path="/in-memoriam" element={<InMemoriam />} />
                      <Route path="/team" element={<Team />} />
                      <Route path="/activities" element={<Activities />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/donate" element={<Donate />} />
                      <Route path="/membership" element={<Membership />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
