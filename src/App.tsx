
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletContextProvider } from "@/contexts/WalletContext";
import { AppProvider } from "@/contexts/AppContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Following from "./pages/Following";
import Settings from "./pages/Settings";
import SetupProfile from "./pages/SetupProfile";
import PostDetail from "./pages/PostDetail";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <WalletContextProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/following" element={<Following />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/setup-profile" element={<SetupProfile />} />
                <Route path="/post/:postId" element={<PostDetail />} />
                <Route path="/user/:username" element={<UserProfile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppProvider>
      </WalletContextProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
