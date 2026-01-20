import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "@/components/ScrollToTop";
import PageLoader from "@/components/PageLoader";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import Track from "./pages/Track";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/blog/BlogPost";
import NotFound from "./pages/NotFound";
import Bangalore from "./pages/locations/Bangalore";
import Hyderabad from "./pages/locations/Hyderabad";
import BangaloreMacBook from "./pages/locations/brands/BangaloreMacBook";
import BangaloreDell from "./pages/locations/brands/BangaloreDell";
import BangaloreLenovo from "./pages/locations/brands/BangaloreLenovo";
import BangaloreHP from "./pages/locations/brands/BangaloreHP";
import SellLaptopBangalore from "./pages/blog/SellLaptopBangalore";
import MacBookPro from "./pages/models/MacBookPro";
import MacBookAir from "./pages/models/MacBookAir";
import DellXPS from "./pages/models/DellXPS";
import HPPavilion from "./pages/models/HPPavilion";
import LenovoThinkPad from "./pages/models/LenovoThinkPad";
import IMac from "./pages/models/IMac";
import DellOptiplex from "./pages/models/DellOptiplex";
import HPDesktop from "./pages/models/HPDesktop";
import LenovoDesktop from "./pages/models/LenovoDesktop";
import AsusLaptop from "./pages/models/AsusLaptop";
import AcerLaptop from "./pages/models/AcerLaptop";
import SamsungLaptop from "./pages/models/SamsungLaptop";
import MicrosoftSurface from "./pages/models/MicrosoftSurface";
import RepairCategory from "./pages/repair/RepairCategory";
import RepairBrands from "./pages/repair/RepairBrands";
import RepairForm from "./pages/repair/RepairForm";
import RepairThankYou from "./pages/repair/RepairThankYou";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <PageLoader />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/sell/:category" element={<Sell />} />
              <Route path="/sell/:category/:brand" element={<Sell />} />
              <Route path="/sell/:category/:brand/:series" element={<Sell />} />
              <Route path="/sell/:category/:brand/:series/:model" element={<Sell />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/track/:id" element={<Track />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/bangalore" element={<Bangalore />} />
              <Route path="/hyderabad" element={<Hyderabad />} />
              <Route path="/bangalore/macbook" element={<BangaloreMacBook />} />
              <Route path="/bangalore/dell" element={<BangaloreDell />} />
              <Route path="/bangalore/lenovo" element={<BangaloreLenovo />} />
              <Route path="/bangalore/hp" element={<BangaloreHP />} />
              <Route path="/blog/sell-used-laptop-bangalore" element={<SellLaptopBangalore />} />
              <Route path="/models/macbook-pro" element={<MacBookPro />} />
              <Route path="/models/macbook-air" element={<MacBookAir />} />
              <Route path="/models/dell-xps" element={<DellXPS />} />
              <Route path="/models/hp-pavilion" element={<HPPavilion />} />
              <Route path="/models/lenovo-thinkpad" element={<LenovoThinkPad />} />
              <Route path="/models/imac" element={<IMac />} />
              <Route path="/models/dell-optiplex" element={<DellOptiplex />} />
              <Route path="/models/hp-desktop" element={<HPDesktop />} />
              <Route path="/models/lenovo-desktop" element={<LenovoDesktop />} />
              <Route path="/models/asus-laptop" element={<AsusLaptop />} />
              <Route path="/models/acer-laptop" element={<AcerLaptop />} />
              <Route path="/models/samsung-laptop" element={<SamsungLaptop />} />
              <Route path="/models/microsoft-surface" element={<MicrosoftSurface />} />
              <Route path="/repair" element={<RepairCategory />} />
              <Route path="/repair/brands" element={<RepairBrands />} />
              <Route path="/repair/form" element={<RepairForm />} />
              <Route path="/repair/thank-you" element={<RepairThankYou />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
