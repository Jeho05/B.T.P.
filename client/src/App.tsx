/**
 * Design system reminder — Matière & Maîtrise:
 * calm editorial structure, mineral contrast, and Terre de Brique only as a directional accent.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Lenis from "lenis";
import { useEffect } from "react";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Admin from "./pages/Admin";
import { ProjectsPage, QuotePage, ServicesPage } from "./pages/Collections";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/realisations" component={ProjectsPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/devis" component={QuotePage} />
      <Route path="/administration" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      easing: (time) => 1 - (1 - time) ** 4,
      smoothWheel: true,
      syncTouch: false,
    });
    let frame = 0;
    const update = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
