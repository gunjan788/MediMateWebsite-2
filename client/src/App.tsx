import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Medications from "@/pages/Medications";
import Reminders from "@/pages/Reminders";
import Appointments from "@/pages/Appointments";
import Profiles from "@/pages/Profiles";
import Sharing from "@/pages/Sharing";
import MedInfo from "@/pages/MedInfo";
import Tutorials from "@/pages/Tutorials";
import Settings from "@/pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/medications" component={Medications} />
      <Route path="/reminders" component={Reminders} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/profiles" component={Profiles} />
      <Route path="/sharing" component={Sharing} />
      <Route path="/med-info" component={MedInfo} />
      <Route path="/tutorials" component={Tutorials} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
