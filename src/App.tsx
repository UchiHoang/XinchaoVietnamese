import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Courses from "./pages/Courses";
import Lesson from "./pages/Lesson";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Exercises from "./pages/Exercises";
import Exercise from "./pages/Exercise";
import Checkout from "./pages/Checkout";
import Transactions from "./pages/Transactions";
import ChatSupport from "./pages/ChatSupport";
import TutorRegistration from "./pages/TutorRegistration";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminLessons from "./pages/admin/AdminLessons";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminExercises from "./pages/admin/AdminExercises";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminTutorBookings from "./pages/admin/AdminTutorBookings";
import AdminChatSupport from "./pages/admin/AdminChatSupport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/lesson/:id" element={<Lesson />} />
                <Route path="/library" element={<Library />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/exercise/:id" element={<Exercise />} />
                <Route path="/checkout/:courseId" element={<Checkout />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/chat-support" element={<ChatSupport />} />
                <Route path="/tutor-registration" element={<TutorRegistration />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="courses" element={<AdminCourses />} />
                  <Route path="lessons" element={<AdminLessons />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="documents" element={<AdminDocuments />} />
                  <Route path="exercises" element={<AdminExercises />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="tutor-bookings" element={<AdminTutorBookings />} />
                  <Route path="chat-support" element={<AdminChatSupport />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
