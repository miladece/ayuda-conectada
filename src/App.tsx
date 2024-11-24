import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import Ofertas from "./pages/Ofertas";
import Solicitudes from "./pages/Solicitudes";
import Publicar from "./pages/Publicar";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ofertas" element={<Ofertas />} />
            <Route path="/solicitudes" element={<Solicitudes />} />
            <Route path="/publicar" element={<Publicar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
        <Footer />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;