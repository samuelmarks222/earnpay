import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Earnings from "./pages/Earnings";
import Auth from "./pages/Auth";
import Groups from "./pages/Groups";
import Pages from "./pages/Pages";
import Reels from "./pages/Reels";
import MenuPage from "./pages/MenuPage";
import Friends from "./pages/Friends";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Marketplace from "./pages/Marketplace";
import Events from "./pages/Events";
import Watch from "./pages/Watch";
import Advertising from "./pages/Advertising";
import Saved from "./pages/Saved";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/pages" element={<Pages />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/advertising" element={<Advertising />} />
          <Route path="/saved" element={<Saved />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
